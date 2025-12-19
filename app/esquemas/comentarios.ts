import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const comentariosSquemas = z.object({
    cuerpo:z.string().min(3),
    blogId:z.custom<Id<"comentarios">>()
})