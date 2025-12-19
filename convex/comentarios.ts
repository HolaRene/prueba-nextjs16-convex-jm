import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const obtenerComentariosByBlogId = query({
    args:{
        blogId:v.id("blogs")
    },
    handler:async(ctx, args)=>{
        const data = await ctx.db.query("comentarios").filter((q)=>q.eq(q.field('blogId'), args.blogId)).order("desc").collect()
        return data
    }
})
export const crearComentarios = mutation({
    args:{
        blogId:v.id("blogs"),
        cuerpo:v.string()
    },
    handler:async(ctx, args)=>{
        const user = await authComponent.safeGetAuthUser(ctx)
        if(!user){
            throw new ConvexError("No estás autenticado")
        }
     return await ctx.db.insert('comentarios',{
        autorId:user._id,
        blogId:args.blogId,
        cuerpo: args.cuerpo,
        nombre: user.name
     })
    }
})