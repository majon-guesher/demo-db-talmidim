import { neon } from "@neondatabase/serverless";

// Cliente de Neon sobre HTTP. Lee la URL secreta de la variable de entorno.
// El "!" le avisa a TypeScript que confiamos en que la variable existe.
// OJO: esto SOLO corre en el servidor. La URL nunca llega al navegador.
export const sql = neon(process.env.DATABASE_URL!);

// Así se ve un mensaje en toda la app (un "molde" compartido).
export type Message = {
  id: number;
  name: string | null;
  text: string;
  created_at: string; // viene como texto ISO desde la base
};

// Límites de validación (los usamos en el servidor y en el navegador).
export const MAX_TEXT = 280;
export const MAX_NAME = 40;
