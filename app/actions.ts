"use server"
import { fetchMutation } from 'convex/nextjs'

import z from "zod"
import { blogSPostchema } from "./esquemas/blog"
import { api } from '@/convex/_generated/api'
import { redirect } from 'next/navigation'
import { getToken } from '@/lib/auth-server'
import { revalidatePath } from 'next/cache'

export async function crearBlogAction(valores: z.infer<typeof blogSPostchema>) {
   
try {
     // verificar los datos con zod
    const parsed = blogSPostchema.safeParse(valores)
    // si no son validos, lanzar un error
    if (!parsed.success) {
        throw new Error("Datos invalidos para crear el blog")
    }
    // obtener el token del usuario de betterAuth
    const token = await getToken()
    const imgBlogUrl =await fetchMutation(api.blogs.generarImageSubidaUrl, {},{token})
    const subirResultados = await fetch(imgBlogUrl, {
        method: "POST",
        headers:{
            "Content-Type":parsed.data.img.type
        },
        body:parsed.data.img
    })
    if(!subirResultados.ok){
        return{
            error: "Error al subir la imagen"
        }
    }
    const {storageId} = await subirResultados.json()
    await fetchMutation(
        api.blogs.crearBlog,{
            cuerpo:parsed.data.contenido,
            titulo: parsed.data.titulo,
            image:  storageId
        }, 
        {token}
    )

} catch {
    console.log('error flexi en crear blog')
     return{
            error: "Error al crear el blog"
        }
}
    revalidatePath('/blogs')
    return redirect('/blogs')
}