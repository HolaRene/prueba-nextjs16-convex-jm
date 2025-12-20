import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    blogs: defineTable({
        titulo: v.string(),
        cuerpo: v.string(),
        autorId: v.string(),
        imageStorageId: v.optional(v.id("_storage"))
    })
    .searchIndex("buscar_titulo",{
        searchField:"titulo"
    })
    .searchIndex("buscar_cuerpo",{
        searchField:"cuerpo"
    })// para busqueda con Full Text Search
    ,comentarios:defineTable({
        blogId: v.id("blogs"), 
        autorId: v.string(),
        nombre:v.string(),
        cuerpo:v.string(),
    })
})