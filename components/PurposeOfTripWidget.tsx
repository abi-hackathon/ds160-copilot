"use client";

import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";

const VISA_TYPES = [
  { value: "B", label: "TEMP. BUSINESS OR PLEASURE VISITOR (B)" },
  { value: "F", label: "STUDENT (F)" },
  { value: "H1B", label: "TEMPORARY WORKER (H1B)" },
  { value: "J", label: "EXCHANGE VISITOR (J)" },
  { value: "L", label: "INTRACOMPANY TRANSFEREE (L)" },
  { value: "O", label: "EXTRAORDINARY ABILITY (O)" },
];

const B_SUBTYPES = [
  { value: "B1", label: "BUSINESS (B1)" },
  { value: "B2", label: "TOURISM/MEDICAL TREATMENT (B2)" },
  { value: "B1B2", label: "BUSINESS & TOURISM (B1/B2)" },
];

const F_SUBTYPES = [
  { value: "F1", label: "STUDENT (F1)" },
  { value: "F2", label: "SPOUSE/CHILD OF STUDENT (F2)" },
];

interface PurposeOfTripWidgetProps {
  onComplete: (data: { purpose: string; specify?: string; sevis?: string }) => void;
}

export default function PurposeOfTripWidget({ onComplete }: PurposeOfTripWidgetProps) {
  const { setField, markFieldComplete } = useFormStore();
  const [purpose, setPurpose] = useState("");
  const [specify, setSpecify] = useState("");
  const [sevis, setSevis] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setField("purpose_of_trip", purpose);
    markFieldComplete("purpose_of_trip");

    if (specify) markFieldComplete("specify_b_visa");
    if (sevis) {
      setField("passport_place_of_issue", sevis); // placeholder until we add sevis field
      markFieldComplete("sevis_number");
    }

    setSubmitted(true);
    onComplete({ purpose, specify, sevis });
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">✅ Purpose of trip saved</p>
        <p className="text-xs text-green-600 mt-1">{VISA_TYPES.find(v => v.value === purpose)?.label}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <p className="text-sm font-semibold text-gray-700 mb-3">🇺🇸 Purpose of Trip to the U.S.</p>

      {/* Visa type */}
      <select
        className="w-full border border-gray-200 rounded-lg p-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={purpose}
        onChange={(e) => { setPurpose(e.target.value); setSpecify(""); setSevis(""); }}
      >
        <option value="">— PLEASE SELECT A VISA CLASS —</option>
        {VISA_TYPES.map((v) => (
          <option key={v.value} value={v.value}>{v.label}</option>
        ))}
      </select>

      {/* B visa subtype */}
      {purpose === "B" && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 mb-1">Specify</p>
          <select
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={specify}
            onChange={(e) => setSpecify(e.target.value)}
          >
            <option value="">— SELECT —</option>
            {B_SUBTYPES.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* F visa subtype + SEVIS */}
      {purpose === "F" && (
        <div className="mb-3 space-y-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">Specify</p>
            <select
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={specify}
              onChange={(e) => setSpecify(e.target.value)}
            >
              <option value="">— SELECT —</option>
              {F_SUBTYPES.map((v) => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">SEVIS Number</p>
            <input
              type="text"
              placeholder="e.g. N1234567890"
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={sevis}
              onChange={(e) => setSevis(e.target.value)}
            />
          </div>
        </div>
      )}

      <button
        disabled={!purpose || (purpose === "B" && !specify) || (purpose === "F" && (!specify || !sevis))}
        onClick={handleSubmit}
        className="w-full mt-2 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Save & Continue
      </button>
    </div>
  );
}
