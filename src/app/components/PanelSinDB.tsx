"use client";

import { useState } from "react";
import { MAX_TEXT, MAX_NAME } from "@/app/lib/shared";

type LocalMsg = { id: number; name: string; text: string };

export default function PanelSinDB() {
  // El estado vive SOLO acá, en la memoria del navegador.
  // Si refrescás, React arranca de cero y esto se borra. 🏝️
  const [messages, setMessages] = useState<LocalMsg[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setMessages((prev) => [
      { id: Date.now(), name: name.trim(), text: t },
      ...prev, // el más nuevo va arriba
    ]);
    setText("");
  }

  return (
    <div className="flex flex-col rounded-2xl border-2 border-amber-300 bg-amber-50 p-4">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-amber-700">🏝️ SIN base de datos</h2>
        <p className="text-sm text-amber-700/80">
          Vive solo en tu teléfono. Si refrescás, ¡se borra todo!
        </p>
      </div>

      <form onSubmit={handleSend} className="mb-3 flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME}
          placeholder="Tu nombre (opcional)"
          className="rounded-lg border border-amber-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_TEXT}
          placeholder="Escribí tu mensaje..."
          className="rounded-lg border border-amber-300 bg-white px-3 py-2 outline-none focus:border-amber-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 font-semibold text-white transition hover:bg-amber-600 active:scale-95"
        >
          Mandar
        </button>
      </form>

      <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && (
          <li className="text-sm italic text-amber-700/60">
            Todavía no hay mensajes. Mandá uno 👆
          </li>
        )}
        {messages.map((m) => (
          <li key={m.id} className="rounded-lg bg-white px-3 py-2 shadow-sm">
            {m.name && <span className="font-semibold">{m.name}: </span>}
            <span>{m.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
