import "server-only"; // ⛔ si alguien importa esto desde el navegador, el build falla
import { neon } from "@neondatabase/serverless";

// Cliente de Neon sobre HTTP. Lee la URL secreta de la variable de entorno.
// El "!" le avisa a TypeScript que confiamos en que la variable existe.
// Gracias a "server-only", esto SOLO corre en el servidor y la URL
// nunca llega al navegador.
export const sql = neon(process.env.DATABASE_URL!);
