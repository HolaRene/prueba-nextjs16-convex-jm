import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const BlogId = () => {
    return (
        <div className='max-w-3xl mx-auto py-8 px-4 animate-in fade-in'>
            <Link className={buttonVariants({ variant: "ghost" })} href={'/blogs'}>
                <ArrowLeft className="size-4" /> Volver atrás
            </Link>
            <div className="relative w-full h-100 mb-8 rounded-xl overflow-hidden shadow-sm">

            </div>
        </div>
    )
}

export default BlogId