"use client";

import { useState, useRef } from "react";
import { useFormStore } from "@/store/useFormStore";

interface ExtractedPassportData {
  surnames?: string;
  given_names?: string;
  nationality?: string;
  sex?: string;
  date_of_birth?: string;
  city_of_birth?: string;
  country_of_birth?: string;
  passport_number?: string;
  passport_date_of_issue?: string;
  passport_date_of_expiry?: string;
  passport_place_of_issue?: string;
}

interface PassportExtractorProps {
  onComplete: (data: ExtractedPassportData) => void;
}

export default function PassportExtractor({ onComplete }: PassportExtractorProps) {
  const [status, setStatus] = useState<"idle" | "uploading" | "extracting" | "done" | "error">("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedPassportData | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { setMultipleFields } = useFormStore();

  const handleFile = async (file: File) => {
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setStatus("extracting");

    try {
      // Convert to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve((r.result as string).split(",")[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });

      // Call Claude vision via our API route
      const response = await fetch("/api/extract-passport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mediaType: file.type,
        }),
      });

      if (!response.ok) throw new Error("Extraction failed");

      const data = await response.json();
      setExtracted(data);
      setMultipleFields(data);
      setStatus("done");
      onComplete(data);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 border-2 border-dashed border-gray-300 rounded-xl bg-white">
      <div className="text-center mb-4">
        <p className="text-sm font-semibold text-gray-700">📷 Upload Passport Bio Page</p>
        <p className="text-xs text-gray-400 mt-1">Claude will extract your details automatically</p>
      </div>

      {/* Drop zone */}
      {status === "idle" && (
        <div
          className="cursor-pointer flex flex-col items-center gap-2 py-6"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <span className="text-4xl">🛂</span>
          <p className="text-sm text-gray-500">Click or drag passport image here</p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {/* Extracting state */}
      {status === "extracting" && (
        <div className="flex flex-col items-center gap-3 py-6">
          {preview && (
            <img src={preview} alt="Passport preview" className="w-48 rounded-lg opacity-60" />
          )}
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <span className="animate-spin">⏳</span>
            <span>Extracting passport details...</span>
          </div>
        </div>
      )}

      {/* Done state */}
      {status === "done" && extracted && (
        <div className="space-y-2">
          {preview && (
            <img src={preview} alt="Passport preview" className="w-full rounded-lg mb-3" />
          )}
          <p className="text-xs font-semibold text-green-600 mb-2">✅ Extracted successfully</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(extracted).map(([key, value]) =>
              value ? (
                <div key={key} className="bg-gray-50 rounded p-1">
                  <span className="text-gray-400 capitalize">{key.replace(/_/g, " ")}: </span>
                  <span className="font-medium text-gray-700">{value}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div className="text-center py-4">
          <p className="text-sm text-red-500">❌ Extraction failed. Please try again.</p>
          <button
            className="mt-2 text-xs text-blue-500 underline"
            onClick={() => setStatus("idle")}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
