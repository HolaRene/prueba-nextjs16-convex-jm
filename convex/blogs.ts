import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

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