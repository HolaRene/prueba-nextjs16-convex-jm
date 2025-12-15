import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    blogs: defineTable({
        titulo: v.string(),
        cuerpo: v.string(),
        autorId: v.string(),
    })
})