import { v } from "convex/values";
import { mutation } from "./_generated/server";
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