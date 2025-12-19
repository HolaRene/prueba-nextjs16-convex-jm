import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    blogs: defineTable({
        titulo: v.string(),
        cuerpo: v.string(),
        autorId: v.string(),
        imageStorageId: v.optional(v.id("_storage"))
    })
    ,comentarios:defineTable({
        blogId: v.id("blogs"), 
        autorId: v.string(),
        nombre:v.string(),
        cuerpo:v.string(),
    })
})