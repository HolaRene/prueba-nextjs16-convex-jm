import z from "zod";

export const blogSPostchema = z.object({
    titulo: z.string().min(5, "El título debe tener al menos 5 caracteres").max(50, "El título no puede exceder los 50 caracteres"),
    contenido: z.string().min(10, "El contenido debe tener al menos 10 caracteres"),
    img: z.instanceof(File),    
})