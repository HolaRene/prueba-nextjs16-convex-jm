import z from "zod";

export const registerSchema = z.object({
    email: z.email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(32, { message: "La contraseña no puede exceder los 32 caracteres" }),
    nombre: z.string().min(3, { message: "El nombre debe tener al menos 2 caracteres" }).max(30, { message: "El nombre no puede exceder los 32 caracteres" }),
})

export const loginSchema = z.object({
    email: z.email({ message: "Correo electrónico inválido" }),
    password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres" }).max(32, { message: "La contraseña no puede exceder los 32 caracteres" }),
})