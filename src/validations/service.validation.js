import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  duration: z.number().positive("La duración debe ser mayor a cero"),
  price: z.number().nonnegative("El precio no puede ser negativo"),
  category: z.string().min(1, "La categoría es obligatoria"),
  available: z.boolean().optional(),
});
export const updateServiceSchema = serviceSchema.partial();