import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const crearBlog = mutation({
    args:{titulo: v.string(), cuerpo: v.string(),},
    handler: async (ctx, args)=>{
        const usuario = await authComponent.safeGetAuthUser(ctx)
        if(!usuario){
            throw new Error("Usuario no autenticado");
        }
        const nuevoBlog = await ctx.db.insert("blogs", {
            titulo: args.titulo,
            cuerpo: args.cuerpo,
            autorId: usuario._id,
        });
        return nuevoBlog;
    }
})

export const obtenerBlogs = query({
    args:{},
    handler: async (ctx) => {
        const blogs = await ctx.db.query("blogs").order("desc").collect();
        return blogs;
    }
})