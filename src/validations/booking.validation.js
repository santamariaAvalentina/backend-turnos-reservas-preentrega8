import { z } from "zod";

export const bookingSchema = z.object({
  clientName: z.string().min(1, "El nombre del cliente es obligatorio"),
  clientEmail: z.string().email("El email no es válido"),
  date: z.string().min(1, "La fecha es obligatoria"),
  time: z.string().min(1, "La hora es obligatoria"),
  status: z.string().min(1, "El estado es obligatorio"),
  services: z.array(
    z.object({
      service: z.string().min(1, "El servicio es obligatorio"),
      quantity: z.number().positive("La cantidad debe ser mayor a cero"),
    })
  ).optional(),
});
export const addServiceToBookingSchema = z.object({
  bid: z.string().min(1, "El ID de la reserva es obligatorio"),
  sid: z.string().min(1, "El ID del servicio es obligatorio"),
});