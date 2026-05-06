"use client";

import { useState } from "react";
import { useFormStore, DS160FormData } from "@/store/useFormStore";

interface PersonalInfoCardProps {
  onComplete: (data: Partial<DS160FormData>) => void;
}

export default function PersonalInfoCard({ onComplete }: PersonalInfoCardProps) {
  const { formData, setMultipleFields, markFieldComplete } = useFormStore();
  const [editing, setEditing] = useState(false);
  const [local, setLocal] = useState({
    surnames: formData.surnames,
    given_names: formData.given_names,
    date_of_birth: formData.date_of_birth,
    city_of_birth: formData.city_of_birth,
    country_of_birth: formData.country_of_birth,
    nationality: formData.nationality,
    sex: formData.sex,
    marital_status: formData.marital_status,
    passport_number: formData.passport_number,
    passport_date_of_issue: formData.passport_date_of_issue,
    passport_date_of_expiry: formData.passport_date_of_expiry,
    passport_place_of_issue: formData.passport_place_of_issue,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleConfirm = () => {
    setMultipleFields(local);
    Object.keys(local).forEach((k) => markFieldComplete(k));
    setSubmitted(true);
    onComplete(local);
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">✅ Personal information confirmed</p>
      </div>
    );
  }

  const fields: { key: keyof typeof local; label: string }[] = [
    { key: "surnames", label: "Surnames" },
    { key: "given_names", label: "Given Names" },
    { key: "date_of_birth", label: "Date of Birth" },
    { key: "city_of_birth", label: "City of Birth" },
    { key: "country_of_birth", label: "Country of Birth" },
    { key: "nationality", label: "Nationality" },
    { key: "sex", label: "Sex (M/F)" },
    { key: "marital_status", label: "Marital Status" },
    { key: "passport_number", label: "Passport Number" },
    { key: "passport_date_of_issue", label: "Date of Issue" },
    { key: "passport_date_of_expiry", label: "Date of Expiry" },
    { key: "passport_place_of_issue", label: "Place of Issue" },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-700">👤 Personal Information Review</p>
        <button
          onClick={() => setEditing(!editing)}
          className="text-xs text-blue-500 hover:underline"
        >
          {editing ? "Done editing" : "Edit"}
        </button>
      </div>

      <div className="space-y-2">
        {fields.map(({ key, label }) => (
          <div key={key} className="grid grid-cols-2 gap-2 items-center">
            <p className="text-xs text-gray-400">{label}</p>
            {editing ? (
              <input
                type="text"
                className="border border-gray-200 rounded p-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-400"
                value={local[key]}
                onChange={(e) =>
                  setLocal((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            ) : (
              <p className="text-xs font-medium text-gray-700">
                {local[key] || <span className="text-gray-300">—</span>}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleConfirm}
        className="w-full mt-4 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        Confirm & Continue
      </button>
    </div>
  );
}
