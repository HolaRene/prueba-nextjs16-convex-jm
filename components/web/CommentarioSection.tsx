'use client'
import { Loader, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { comentariosSquemas } from "@/app/esquemas/comentarios"
import { Button } from "../ui/button"
import { useTransition } from "react"
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field"
import { Textarea } from "../ui/textarea"
import { toast } from "sonner"
import z from "zod"
import { useParams } from "next/navigation"
import { Id } from "@/convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { Separator } from "@radix-ui/react-dropdown-menu"



const CommentarioSection = () => {
    const params = useParams<{ blogId: Id<"blogs"> }>()

    const [isPending, startTransition] = useTransition()
    const form = useForm({
        resolver: zodResolver(comentariosSquemas),
        defaultValues: {
            cuerpo: 'Primer Blog',
            blogId: params.blogId
        }
    })

    const crearComentario = useMutation(api.comentarios.crearComentarios)
    const comentarios = useQuery(api.comentarios.obtenerComentariosByBlogId, { blogId: params.blogId })


    function onSubmit(valores: z.infer<typeof comentariosSquemas>) {
        try {
            startTransition(async () => {
                await crearComentario({
                    blogId: params.blogId,
                    cuerpo: valores.cuerpo
                })
                form.reset()
                toast.success("Blog creado correctamente")
            })
        } catch {
            toast.error("Ha ocurrido un error")
            console.log('Ha ocurrido un error en onsubmit')
        }
    }

    if (comentarios === undefined) {
        return <p>Cargando</p>
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2 border-b">
                <MessageSquare className="size-5" />
                <h2 className="text-xl font-bold">{comentarios?.length} comentarios</h2>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                    <FieldGroup>
                        <Controller
                            control={form.control}
                            name="cuerpo"
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Contenido</FieldLabel>
                                    <Textarea aria-invalid={fieldState.invalid} {...field} placeholder="Contenido del blog" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>

                            )}
                        />
                    </FieldGroup>
                    <Button disabled={isPending}>
                        {
                            isPending ? <>
                                <Loader className="animate-spin mr-2 h-4 w-4" />
                                <span>Cargando...</span>
                            </> : "Crear Comentario"
                        }
                    </Button>
                </form>
                {comentarios.length > 0 && <Separator />}
                <section>
                    {
                        comentarios?.map((comentario) => (
                            <div className="flex gap-4" key={comentario._id}>
                                <Avatar>
                                    <AvatarImage src={`https://avatar.vercel.sh/${comentario._id}`} />
                                    <AvatarFallback>
                                        {comentario.nombre.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-center">
                                        <p className="font-semibold text-sm">{comentario.nombre}</p>
                                        <p className="text-muted-foreground text-xs">{new Date(comentario._creationTime).toLocaleDateString()}</p>
                                    </div>
                                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{comentario.cuerpo}</p>
                                </div>
                            </div>
                        ))
                    }
                </section>
            </CardContent>
        </Card>
    )
}

export default CommentarioSection