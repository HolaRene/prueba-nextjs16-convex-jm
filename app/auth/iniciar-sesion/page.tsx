"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { loginSchema } from "@/app/esquemas/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import z from "zod"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Loader } from "lucide-react"

const Page = () => {
    const [isPending, startTransition] = useTransition()

    const ruta = useRouter()
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    function onSubmit(data: z.infer<typeof loginSchema>) {
        // Lógica para manejar el envío del formulario
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Sesión iniciada correctamente")
                        ruta.push('/')
                    },
                    onError: (error) => {
                        toast.error(`Error al iniciar sesión: ${error.error.message}`)
                    }
                },
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Iniciar Sesión</CardTitle>
                <CardDescription>Inicia sesión para empezar</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Formulario de inicio de sesión aquí */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Campos del formulario */}
                    <FieldGroup>
                        <Controller
                            name="email" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Correo</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} type="email" placeholder="Tu correo" {...field} />
                                    {
                                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                    }
                                </Field>
                            )}
                        />
                        <Controller
                            name="password" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Contraseña</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Tu contraseña" type="password" {...field} />
                                    {
                                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                    }
                                </Field>
                            )}
                        />
                        <Button disabled={isPending}>
                            {
                                isPending ? <>
                                    <Loader className="animate-spin mr-2 h-4 w-4" />
                                    <span>Cargando...</span>
                                </> : "Iniciar Sesión"
                            }
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default Page