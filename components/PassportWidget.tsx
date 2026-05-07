"use client";

import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";

const PASSPORT_TYPES = [
  { value: "R", label: "REGULAR" },
  { value: "O", label: "OFFICIAL" },
  { value: "D", label: "DIPLOMATIC" },
  { value: "L", label: "LAISSEZ-PASSER" },
  { value: "OTHER", label: "OTHER" },
];

interface PassportWidgetProps {
  onComplete: (data: {
    passport_type: string;
    passport_number: string;
    passport_date_of_issue: string;
    passport_date_of_expiry: string;
    passport_place_of_issue: string;
  }) => void;
}

export default function PassportWidget({ onComplete }: PassportWidgetProps) {
  const { formData, setMultipleFields, markFieldComplete } = useFormStore();
  const [passportType, setPassportType] = useState("R");
  const [number, setNumber] = useState(formData.passport_number);
  const [dateIssue, setDateIssue] = useState(formData.passport_date_of_issue);
  const [dateExpiry, setDateExpiry] = useState(formData.passport_date_of_expiry);
  const [placeIssue, setPlaceIssue] = useState(formData.passport_place_of_issue);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const data = {
      passport_type: passportType,
      passport_number: number,
      passport_date_of_issue: dateIssue,
      passport_date_of_expiry: dateExpiry,
      passport_place_of_issue: placeIssue,
    };
    setMultipleFields(data);
    ["passport_type", "passport_number", "passport_date_of_issue", "passport_date_of_expiry", "passport_place_of_issue"].forEach(markFieldComplete);
    setSubmitted(true);
    onComplete(data);
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">✅ Passport information confirmed</p>
        <p className="text-xs text-green-600 mt-1">{number} — expires {dateExpiry}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
      <p className="text-sm font-semibold text-gray-700">🛂 Passport Information</p>
      <p className="text-xs text-gray-400">Fields pre-filled from your passport scan — verify and confirm.</p>

      {/* Passport Type */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Passport/Travel Document Type</p>
        <select
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={passportType}
          onChange={(e) => setPassportType(e.target.value)}
        >
          {PASSPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Passport Number */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Passport Number</p>
        <input
          type="text"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
      </div>

      {/* Date of Issue */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Date of Issue (DD MMM YYYY)</p>
        <input
          type="text"
          placeholder="e.g. 11 OCT 2011"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={dateIssue}
          onChange={(e) => setDateIssue(e.target.value)}
        />
      </div>

      {/* Date of Expiry */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Date of Expiry (DD MMM YYYY)</p>
        <input
          type="text"
          placeholder="e.g. 10 OCT 2031"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={dateExpiry}
          onChange={(e) => setDateExpiry(e.target.value)}
        />
      </div>

      {/* Place of Issue */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Place of Issue</p>
        <input
          type="text"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={placeIssue}
          onChange={(e) => setPlaceIssue(e.target.value)}
        />
      </div>

      <button
        disabled={!number || !dateIssue || !dateExpiry || !placeIssue}
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Confirm Passport Details
      </button>
    </div>
  );
}
