import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CommentarioSection from "@/components/web/CommentarioSection"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { fetchQuery, preloadQuery } from "convex/nextjs"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

interface BlogIdProps {
    params: Promise<{
        blogId: Id<"blogs">
    }>
}
// funcion para crear seo dinamico.
export async function generateMetadata({ params }: BlogIdProps): Promise<Metadata> {
    const { blogId } = await params
    const fata = await fetchQuery(api.blogs.obtenerBlogPorId, { blogId: blogId })
    if (!fata) {
        return {
            title: 'Blog no encontrado'
        }
    }
    return {
        title: fata.titulo,
        description: fata.cuerpo
    }

}

const BlogId = async ({ params }: BlogIdProps) => {
    const { blogId } = await params
    // Total: 200ms (el tiempo del más lento)
    const [blog, preloadedComents] = await Promise.all([
        await fetchQuery(api.blogs.obtenerBlogPorId, { blogId: blogId }),

        await preloadQuery(api.comentarios.obtenerComentariosByBlogId, { blogId: blogId })
    ])
    if (!blog) {
        return <div>
            <h1 className="text-6xl font-bold py-12 text-red-500">Hola muy bien</h1>
        </div>
    }
    return (
        <div className='max-w-3xl mx-auto py-8 px-4 animate-in fade-in'>
            <Link className={buttonVariants({ variant: "ghost", className: "mb-4" })} href={'/blogs'}>
                <ArrowLeft className="size-4" /> Volver atrás
            </Link>
            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image src={blog.imageUrl ?? "https://images.pexels.com/photos/34605404/pexels-photo-34605404.jpeg"
                } alt={blog.titulo} fill className="object-cover" />
            </div>
            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">{blog.titulo}</h1>
                <p className="text-sm text-muted-foreground">Creado en: {new Date(blog._creationTime).toLocaleDateString()}</p>
            </div>
            <Separator className="my-8" />
            <p className="text-lg leading-relaxed text-foreground/90">{blog.cuerpo}</p>
            <Separator className="my-8" />
            <CommentarioSection preploadedComents={preloadedComents} />
        </div>
    )
}

export default BlogId