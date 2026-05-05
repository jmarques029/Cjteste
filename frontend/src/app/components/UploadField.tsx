"use client";

import { useState, ChangeEvent } from "react";

interface UploadFieldProps {
  onUploadSuccess: (path: string) => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function UploadField({ onUploadSuccess }: UploadFieldProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [fileName, setFileName] = useState("");

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setStatus("uploading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setStatus("success");
        onUploadSuccess(data.path);
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div className="form-group full">
      <label htmlFor="documento_file" style={{ fontSize: '0.8rem', fontWeight: 600, color: '#a0a0be', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', display: 'block' }}>
        Documento de Identificação (PDF/RG/CNH)
      </label>
      <div className="relative">
        <input
          id="documento_file"
          type="file"
          onChange={handleFileChange}
          className="sr-only"
          accept="image/*,.pdf"
        />
        <label
          htmlFor="documento_file"
          className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            status === "success" 
              ? "border-green-500/50 bg-green-500/10" 
              : status === "error"
              ? "border-red-500/50 bg-red-500/10"
              : "border-white/10 bg-[#16161f] hover:border-[#6366f1]/50"
          }`}
        >
          <span className="text-xl">
            {status === "idle" && "📁"}
            {status === "uploading" && "⏳"}
            {status === "success" && "✅"}
            {status === "error" && "❌"}
          </span>
          <span className="text-sm font-medium">
            {status === "idle" && "Clique para selecionar ou arraste o arquivo"}
            {status === "uploading" && `Enviando ${fileName}...`}
            {status === "success" && "Upload concluído!"}
            {status === "error" && "Falha no upload. Tente novamente."}
          </span>
        </label>
      </div>
      {status === "success" && (
        <p className="mt-2 text-xs text-green-400 font-medium">
          Arquivo reconhecido: {fileName}
        </p>
      )}
    </div>
  );
}
