"use client";

import PanelSinDB from "@/app/components/PanelSinDB";
import PanelConDB from "@/app/components/PanelConDB";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 md:px-8 md:py-10">
      <header className="mx-auto max-w-5xl text-center">
        <h1 className="text-3xl font-extrabold md:text-4xl">Muro de mensajes 📝</h1>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">
          Dos muros igualitos. Escribí en los dos. Después tocá el botón de abajo y
          fijate cuál se acuerda de tus mensajes... y cuál no. 🤔
        </p>

        {/* BOTÓN ESTRELLA: recarga la página entera. */}
        <button
          onClick={() => window.location.reload()}
          className="mt-5 rounded-2xl bg-indigo-600 px-7 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-indigo-700 active:scale-95"
        >
          🔄 Refrescá la página
        </button>
        <p className="mt-2 text-sm text-slate-500">
          (Es lo mismo que recargar la página en el navegador)
        </p>
      </header>

      <section className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
        <PanelSinDB />
        <PanelConDB />
      </section>

      <footer className="mx-auto mt-8 max-w-5xl text-center text-sm text-slate-500">
        <p>
          🏝️ El muro <strong>SIN</strong> base de datos vive solo en tu teléfono: es una
          isla que se borra. ☁️ El muro <strong>CON</strong> base de datos vive en un
          servidor que <strong>todos</strong> comparten.
        </p>
      </footer>
    </main>
  );
}
