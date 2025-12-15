"use client"
import { registerSchema } from "@/app/esquemas/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const IniciarSesion = () => {
    const [isPending, startTransition] = useTransition()
    const ruta = useRouter()

    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            nombre: "el mero don"
        }
    })

    function onSubmit(data: z.infer<typeof registerSchema>) {
        // Lógica para manejar el envío del formulario
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.nombre,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Ha sido registrado correctamente")
                        ruta.push('/')
                    },
                    onError: (error) => {
                        toast.error(`Error al registrar: ${error.error.message}`)
                    }
                },
            })
        })
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Registrarse</CardTitle>
                <CardDescription>Crea una cuenta para empezar</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Formulario de inicio de sesión aquí */}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Campos del formulario */}
                    <FieldGroup>
                        <Controller
                            name="nombre" control={form.control} render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Nombre</FieldLabel>
                                    <Input aria-invalid={fieldState.invalid} placeholder="Tu nombre" {...field} />
                                    {
                                        fieldState.invalid && <FieldError errors={[fieldState.error]} />
                                    }
                                </Field>
                            )}
                        />
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
                                </> : "Registrarse"
                            }
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}

export default IniciarSesion