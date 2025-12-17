
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { api } from "@/convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import Image from "next/image"
import Link from "next/link"
import { Suspense } from "react"

const BlogPage = () => {


    return (
        <div className='py-12'>
            <div className="text-center pb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Nuestros blosg flexis</h1>
                <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Piensa cerebro, pon tus ideas en ese blogs</p>
            </div>
            {/* Estreaming */}
            <Suspense fallback={<div>Cargando blogs...</div>}>
                <LoadBlog />
            </Suspense>
        </div>
    )
}

async function LoadBlog() {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simula una demora de 5 segundo
    // Fetch blogs del lado del servidor
    const data = await fetchQuery(api.blogs.obtenerBlogs)
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((blog) => (
                <Card key={blog._id} className="pt-0">
                    <div className="h-48 w-full overflow-hidden relative">
                        <Image
                            alt="imgs"
                            src={"https://images.pexels.com/photos/34605404/pexels-photo-34605404.jpeg"}
                            fill
                            className="rounded-t-lg"
                        />
                    </div>
                    <CardContent>
                        <Link href={`blog/${blog._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary"> {blog.titulo}</h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{blog.cuerpo}</p>
                    </CardContent>
                    <CardFooter>
                        <Link className={buttonVariants({ className: "w-full" })} href={`blog/${blog._id}`}>
                            Leer más.
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
export default BlogPage