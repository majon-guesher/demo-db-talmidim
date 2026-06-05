"use client";

import { useEffect, useState } from "react";
import { MAX_TEXT, MAX_NAME, type Message } from "@/app/lib/db";

export default function PanelConDB() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Trae los mensajes desde el servidor.
  async function load() {
    try {
      const res = await fetch("/api/messages", { cache: "no-store" });
      if (!res.ok) throw new Error("No se pudo cargar");
      const data: Message[] = await res.json();
      setMessages(data);
      setLastUpdate(new Date());
      setError(null);
    } catch {
      setError("No me pude conectar al servidor 😕");
    }
  }

  // Carga inicial + auto-actualización cada 3s.
  // Limpiamos el intervalo al desmontar (¡importante!).
  useEffect(() => {
    load();
    const poll = setInterval(load, 3000);
    return () => clearInterval(poll); // 🧹 limpieza
  }, []);

  // Contador "hace Xs" que tickea cada segundo.
  useEffect(() => {
    const tick = setInterval(() => {
      if (lastUpdate) {
        setSecondsAgo(Math.round((Date.now() - lastUpdate.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [lastUpdate]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t || sending) return;
    setSending(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), text: t }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "Error al mandar");
      }
      setText("");
      await load(); // refresco inmediato después de mandar
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al mandar");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col rounded-2xl border-2 border-sky-300 bg-sky-50 p-4">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-sky-700">☁️ CON base de datos</h2>
        <p className="text-sm text-sky-700/80">
          Vive en el servidor. Lo ven todos los teléfonos y no se borra.
        </p>
        <p className="mt-1 text-xs text-sky-600">
          📡 Datos del servidor · actualizado hace {secondsAgo}s ·{" "}
          {messages.length} mensajes
        </p>
      </div>

      <form onSubmit={handleSend} className="mb-2 flex flex-col gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={MAX_NAME}
          placeholder="Tu nombre (opcional)"
          className="rounded-lg border border-sky-300 bg-white px-3 py-2 outline-none focus:border-sky-500"
        />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={MAX_TEXT}
          placeholder="Escribí tu mensaje..."
          className="rounded-lg border border-sky-300 bg-white px-3 py-2 outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-700 active:scale-95 disabled:opacity-50"
        >
          {sending ? "Mandando..." : "Mandar"}
        </button>
      </form>

      <button
        onClick={load}
        className="mb-3 self-start rounded-lg border border-sky-400 px-3 py-1 text-sm text-sky-700 transition hover:bg-sky-100"
      >
        🔄 Refrescar
      </button>

      {error && <p className="mb-2 text-sm text-red-600">{error}</p>}

      <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
        {messages.length === 0 && !error && (
          <li className="text-sm italic text-sky-700/60">
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
