"use client"

import Link from "next/link"
import { Button, buttonVariants } from "../ui/button"
import { ModeToggle } from "../ui/theme-toggle"
import { useConvexAuth } from "convex/react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


const Nabvar = () => {
    const ruta = useRouter()
    // Esta autenticado?
    const { isAuthenticated, isLoading } = useConvexAuth()
    return (
        <nav className='w-full py-5 flex items-center justify-between'>
            <div className='flex items-center gap-8'>
                <Link href={'/'}>
                    <h1 className="text-3xl font-bold">Proximamente<span className="text-blue-500">Pro</span></h1>
                </Link>
                <div className="flex items-center gap-2">
                    <Link className={buttonVariants({ variant: "ghost" })} href={'/'}>Inicio</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href={'/blog'}>Blog</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href={'/crear'}>Crear</Link>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {
                    isLoading ? null : isAuthenticated ? (
                        <Button
                            onClick={() => {
                                authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            toast.success("Sesión cerrada correctamente")
                                            ruta.push('/')
                                        },
                                        onError: (error) => {
                                            toast.error(`Error al cerrar sesión: ${error.error.message}`)
                                        }
                                    },
                                })
                            }}
                        >Cerrar sesión</Button>
                    ) : (
                        <>
                            <Link className={buttonVariants()} href={'/auth/iniciar-sesion'}>Iniciar sesión</Link>
                            <Link className={buttonVariants({ variant: "outline" })} href={'/auth/registro'}>Registrarse</Link>
                        </>
                    )
                }
                <ModeToggle />
            </div>
        </nav>
    )
}

export default Nabvar