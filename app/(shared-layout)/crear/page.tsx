"use client"

import { blogSPostchema } from "@/app/esquemas/blog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api } from "@/convex/_generated/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { Loader } from "lucide-react"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"

const CrearPage = () => {
    const [isPending, startTransition] = useTransition()
    const crearBlogMutation = useMutation(api.blogs.crearBlog)
    const form = useForm({
        resolver: zodResolver(blogSPostchema),
        defaultValues: {
            titulo: 'Primer Blog',
            contenido: '',
        }
    })

    function onSubmit(valores: z.infer<typeof blogSPostchema>) {
        startTransition(() => {
            crearBlogMutation({
                titulo: valores.titulo,
                cuerpo: valores.contenido,
            })
        })

    }
    return (
        <div className='py-12'>
            <div className="text-center pb-3">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Crear un blog</h1>
                <p className="text-xl text-muted-foreground pt-2">Comparte tus ideas con un blog</p>
            </div>
            <Card className="w-full max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Crear un blog</CardTitle>
                    <CardDescription>Completa los detalles del blog que deseas crear</CardDescription>
                </CardHeader>
                {/* Formulario para crear un blog */}
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Aquí irán los campos del formulario */}
                        <FieldGroup>
                            <Controller
                                control={form.control}
                                name="titulo"
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Título</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} {...field} placeholder="Título del blog" />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>

                                )}
                            />
                            <Controller
                                control={form.control}
                                name="contenido"
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
                            <Button disabled={isPending}>
                                {
                                    isPending ? <>
                                        <Loader className="animate-spin mr-2 h-4 w-4" />
                                        <span>Cargando...</span>
                                    </> : "Crear Blog"
                                }
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CrearPage