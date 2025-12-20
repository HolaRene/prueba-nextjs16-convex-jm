
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

export const dynamic = "force-static" // "auto" | "error" | "force-static" | "force-dynamic"
export const revalidate = 30// 0 | number | false > en segundos.

export const metadata: Metadata = {
    title: "mi blog",
    description: "...flexis",
    category: "Web nexts",
    authors: [{
        name: "Don joe"
    }]
}

const BlogPage = () => {
    return (
        <div className='py-12'>
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Nuestros blosg flexis</h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Piensa cerebro, pon tus ideas en ese blogs</p>
            </div>
            {/* Estreaming */}
            <Suspense fallback={<SkeletonLaodingUI />}>
                <LoadBlog />
            </Suspense>
        </div>
    )
}

async function LoadBlog() {
    // await new Promise((resolve) => setTimeout(resolve, 5000)); // Simula una demora de 5 segundo
    // Fetch blogs del lado del servidor
    const data = await fetchQuery(api.blogs.obtenerBlogs)
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((blog) => (
                <Card key={blog._id} className="pt-0">
                    <div className="h-48 w-full overflow-hidden relative">
                        <Image
                            alt="imgs"
                            src={blog.image ?? "https://images.pexels.com/photos/34605404/pexels-photo-34605404.jpeg"}
                            fill
                            className="rounded-t-lg object-cover"
                        />
                    </div>
                    <CardContent>
                        <Link href={`blogs/${blog._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary"> {blog.titulo}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{blog.cuerpo}</p>
                    </CardContent>
                    <CardFooter>
                        <Link className={buttonVariants({ className: "w-full" })} href={`blogs/${blog._id}`}>
                            Leer más.
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function SkeletonLaodingUI() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((_, i) => <div className="flex flex-col space-y-3" key={i}>
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="space-y-2 flex flex-col">
                    <Skeleton className="h-8 w-3/4 rounded-lg" />
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>)}
        </div>
    )
}
export default BlogPage