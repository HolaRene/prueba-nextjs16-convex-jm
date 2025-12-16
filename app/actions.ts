"use server"
import { fetchMutation } from 'convex/nextjs'

import z from "zod"
import { blogSPostchema } from "./esquemas/blog"
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'
import { getToken } from '@/lib/auth-server'

export async function crearBlogAction(valores: z.infer<typeof blogSPostchema>) {
    // verificar los datos con zod
    const parsed = blogSPostchema.safeParse(valores)
    // si no son validos, lanzar un error
    if (!parsed.success) {
        throw new Error("Datos invalidos para crear el blog")
    }
    // obtener el token del usuario
    const token = await getToken()
    // llamar a la mutacion para crear el blog
    await fetchMutation(api.blogs.crearBlog,{
        titulo: parsed.data.titulo,
        cuerpo: parsed.data.contenido,        
    },
{token})
    return redirect('/')
}