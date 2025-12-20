import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const crearBlog = mutation({
    args:{titulo: v.string(), cuerpo: v.string(),image:v.id("_storage")},
    handler: async (ctx, args)=>{
        const usuario = await authComponent.safeGetAuthUser(ctx)
        if(!usuario){
            throw new Error("Usuario no autenticado");
        }
        const nuevoBlog = await ctx.db.insert("blogs", {
            titulo: args.titulo,
            cuerpo: args.cuerpo,
            autorId: usuario._id,
            imageStorageId: args.image
        });
        return nuevoBlog;
    }
})

export const obtenerBlogs = query({
    args:{},
    handler: async (ctx) => {

        const blogs = await ctx.db.query("blogs").order("desc").collect();
        return Promise.all(
            blogs.map(async (blog)=>{
                const resolverImgURl = blog.imageStorageId !== undefined ? await ctx.storage.getUrl(blog.imageStorageId): null
                return {
                      ...blog,
                      image: resolverImgURl
                  }
                })          
        )
       
    }
})

export const obtenerBlogPorId = query({
    args:{
        blogId: v.id("blogs")
    },
    handler:async (ctx, args)=>{
        const blog = await ctx.db.get(args.blogId)

        if(!blog){
            return null
        }

        const resolverImgURl = blog?.imageStorageId !== undefined ? await ctx.storage.getUrl(blog.imageStorageId): null
        return {
            ...blog,
            imageUrl : resolverImgURl
        }
    }
})

export const generarImageSubidaUrl = mutation({
    args:{},
    handler:async(ctx)=>{
         const usuario = await authComponent.safeGetAuthUser(ctx)
        if(!usuario){
            throw new Error("Usuario no autenticado");
        }
        return await ctx.storage.generateUploadUrl()
    }
})

// interfaz de busqueda con Full Text Search
interface ResultadoBusquedaType{
    _id: string,
    titulo: string,
    cuerpo: string,
}

// Función para buscar posts en la colección "blogs" según un término y un límite de resultados.
export const busquedaPost = query({
    // Definición de los argumentos esperados: término de búsqueda y límite de resultados
    args: {
        term: v.string(),
        limit: v.number()
    },
    // Handler principal de la consulta
    handler: async (ctx, args) => {
        const limit = args.limit;
        // Array donde se almacenarán los resultados encontrados
        const resultados: ResultadoBusquedaType[] = [];

        // Set para evitar resultados duplicados (por _id)
        const vistos = new Set();

        // Función auxiliar para agregar documentos al array de resultados, evitando duplicados y respetando el límite
        const pushDocs = async (docs: Array<Doc<"blogs">>) => {
            for (const doc of docs) {
                if (vistos.has(doc._id)) continue; // Si ya se agregó, saltar
                vistos.add(doc._id);
                resultados.push({
                    _id: doc._id,
                    titulo: doc.titulo,
                    cuerpo: doc.cuerpo,
                });
                if (resultados.length >= limit) break; // Si se alcanza el límite, detener
            }
        };

        // Buscar primero por coincidencias en el título usando el índice de búsqueda
        const resultadosTitulo = await ctx.db
            .query("blogs")
            .withSearchIndex("buscar_titulo", (q) => q.search("titulo", args.term))
            .take(limit);

        // Agregar los resultados encontrados por título
        await pushDocs(resultadosTitulo);

        // Si aún no se alcanza el límite, buscar por coincidencias en el cuerpo
        if (resultados.length < limit) {
            const resultadosCuerpo = await ctx.db
                .query("blogs")
                .withSearchIndex("buscar_cuerpo", (q) => q.search("cuerpo", args.term))
                .take(limit - resultados.length);

            // Agregar los resultados encontrados por cuerpo
            await pushDocs(resultadosCuerpo);
        }
        // Retornar el array de resultados finales
        return resultados;
    }
});