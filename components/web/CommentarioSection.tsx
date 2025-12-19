'use client'
import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { comentariosSquemas } from "@/app/esquemas/comentarios"

const CommentarioSection = () => {
    const form = useForm({
        resolver: zodResolver(comentariosSquemas),
        defaultValues: {
            cuerpo: 'Primer Blog',
        }
    })
    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold">5 comentarios</h2>
            </CardHeader>
            <CardContent></CardContent>
        </Card>
    )
}

export default CommentarioSection