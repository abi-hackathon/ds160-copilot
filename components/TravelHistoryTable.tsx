"use client";

import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";

interface USVisit {
  date_arrived: string;
  length_of_stay: string;
  unit: string;
}

interface TravelHistoryWidgetProps {
  onComplete: (data: {
    ever_been_in_us: "Y" | "N";
    visits?: USVisit[];
    ever_issued_us_visa: "Y" | "N";
    ever_refused_us_visa: "Y" | "N";
  }) => void;
}

export default function TravelHistoryTable({ onComplete }: TravelHistoryWidgetProps) {
  const { setField, markFieldComplete } = useFormStore();
  const [everBeenInUS, setEverBeenInUS] = useState<"Y" | "N" | "">("");
  const [visits, setVisits] = useState<USVisit[]>([{ date_arrived: "", length_of_stay: "", unit: "Month(s)" }]);
  const [everIssuedVisa, setEverIssuedVisa] = useState<"Y" | "N" | "">("");
  const [everRefused, setEverRefused] = useState<"Y" | "N" | "">("");
  const [submitted, setSubmitted] = useState(false);

  const addVisit = () => {
    if (visits.length < 5) {
      setVisits([...visits, { date_arrived: "", length_of_stay: "", unit: "Month(s)" }]);
    }
  };

  const removeVisit = (index: number) => {
    setVisits(visits.filter((_, i) => i !== index));
  };

  const updateVisit = (index: number, field: keyof USVisit, value: string) => {
    const updated = [...visits];
    updated[index] = { ...updated[index], [field]: value };
    setVisits(updated);
  };

  const canSubmit =
    everBeenInUS !== "" &&
    everIssuedVisa !== "" &&
    everRefused !== "" &&
    (everBeenInUS === "N" || visits.every((v) => v.date_arrived && v.length_of_stay));

  const handleSubmit = () => {
    setField("ever_been_in_us", everBeenInUS);
    setField("ever_issued_us_visa", everIssuedVisa);
    setField("ever_refused_us_visa", everRefused);
    markFieldComplete("ever_been_in_us");
    markFieldComplete("ever_issued_us_visa");
    markFieldComplete("ever_refused_us_visa");

    setSubmitted(true);
    onComplete({
      ever_been_in_us: everBeenInUS as "Y" | "N",
      visits: everBeenInUS === "Y" ? visits : undefined,
      ever_issued_us_visa: everIssuedVisa as "Y" | "N",
      ever_refused_us_visa: everRefused as "Y" | "N",
    });
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">✅ Travel history saved</p>
        <p className="text-xs text-green-600 mt-1">
          {everBeenInUS === "Y" ? `${visits.length} visit(s) recorded` : "No previous US travel"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      <p className="text-sm font-semibold text-gray-700">✈️ Previous U.S. Travel Information</p>

      {/* Ever been in US */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Have you ever been in the U.S.?</p>
        <div className="flex gap-3">
          {(["Y", "N"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setEverBeenInUS(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                everBeenInUS === v
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {v === "Y" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {/* Visit table */}
      {everBeenInUS === "Y" && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Last five U.S. visits (max 5)</p>
          {visits.map((visit, index) => (
            <div key={index} className="grid grid-cols-3 gap-1 items-center">
              <input
                type="text"
                placeholder="Date (DD MMM YYYY)"
                className="col-span-1 border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={visit.date_arrived}
                onChange={(e) => updateVisit(index, "date_arrived", e.target.value)}
              />
              <input
                type="number" min="1"
                placeholder="Length"
                className="border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={visit.length_of_stay}
                onChange={(e) => {const val = Math.max(1, parseInt(e.target.value) || 1); updateVisit(index, "length_of_stay", String(val));}}
              />
              <div className="flex gap-1 items-center">
                <select
                  className="flex-1 border border-gray-200 rounded-lg p-1.5 text-xs focus:outline-none"
                  value={visit.unit}
                  onChange={(e) => updateVisit(index, "unit", e.target.value)}
                >
                  <option>Day(s)</option>
                  <option>Week(s)</option>
                  <option>Month(s)</option>
                  <option>Year(s)</option>
                </select>
                {visits.length > 1 && (
                  <button
                    onClick={() => removeVisit(index)}
                    className="text-red-400 text-xs hover:text-red-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
          {visits.length < 5 && (
            <button
              onClick={addVisit}
              className="text-xs text-blue-500 hover:underline"
            >
              + Add another visit
            </button>
          )}
        </div>
      )}

      {/* Ever issued US visa */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Have you ever been issued a U.S. Visa?</p>
        <div className="flex gap-3">
          {(["Y", "N"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setEverIssuedVisa(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                everIssuedVisa === v
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {v === "Y" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      {/* Ever refused */}
      <div>
        <p className="text-xs text-gray-500 mb-2">Have you ever been refused a U.S. Visa or denied entry?</p>
        <div className="flex gap-3">
          {(["Y", "N"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setEverRefused(v)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                everRefused === v
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {v === "Y" ? "Yes" : "No"}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Save & Continue
      </button>
    </div>
  );
}
