// Cosas que comparten el servidor Y el navegador.
// IMPORTANTE: este archivo NO importa la base de datos, así que es seguro
// usarlo desde los componentes del navegador (los paneles).

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
