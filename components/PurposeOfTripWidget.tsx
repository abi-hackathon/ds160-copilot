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

const PAYER_TYPES = [
  { value: "SELF", label: "SELF" },
  { value: "OTHER_PERSON", label: "OTHER PERSON" },
  { value: "OTHER_COMPANY", label: "OTHER COMPANY/ORGANIZATION" },
  { value: "US_PETITIONER", label: "U.S. PETITIONER" },
];

const LENGTH_UNITS = ["Day(s)", "Week(s)", "Month(s)", "Year(s)"];

interface PurposeOfTripWidgetProps {
  onComplete: (data: {
    purpose: string;
    specify?: string;
    sevis?: string;
    intended_arrival_date?: string;
    intended_length_of_stay?: string;
    us_stay_address_street?: string;
    us_stay_city?: string;
    person_paying_for_trip?: string;
  }) => void;
}

export default function PurposeOfTripWidget({ onComplete }: PurposeOfTripWidgetProps) {
  const { setField, setMultipleFields, markFieldComplete } = useFormStore();
  const [purpose, setPurpose] = useState("");
  const [specify, setSpecify] = useState("");
  const [sevis, setSevis] = useState("");
  const [arrivalDate, setArrivalDate] = useState("");
  const [lengthNum, setLengthNum] = useState("");
  const [lengthUnit, setLengthUnit] = useState("Month(s)");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payer, setPayer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = purpose &&
    (purpose !== "B" || specify) &&
    (purpose !== "F" || (specify && sevis));

  const handleSubmit = () => {
    const lengthOfStay = lengthNum ? `${lengthNum} ${lengthUnit}` : "";
    setMultipleFields({
      purpose_of_trip: purpose,
      intended_arrival_date: arrivalDate,
      intended_length_of_stay: lengthOfStay,
      us_stay_address_street: address,
      us_stay_city: city,
      person_paying_for_trip: payer,
    });
    ["purpose_of_trip", "intended_arrival_date", "intended_length_of_stay",
     "us_stay_address_street", "us_stay_city", "person_paying_for_trip"].forEach(markFieldComplete);

    setSubmitted(true);
    onComplete({
      purpose,
      specify,
      sevis,
      intended_arrival_date: arrivalDate,
      intended_length_of_stay: lengthOfStay,
      us_stay_address_street: address,
      us_stay_city: city,
      person_paying_for_trip: payer,
    });
  };

  if (submitted) {
    return (
      <div className="p-4 bg-green-50 rounded-xl border border-green-200">
        <p className="text-sm text-green-700 font-medium">✅ Travel information saved</p>
        <p className="text-xs text-green-600 mt-1">
          {VISA_TYPES.find(v => v.value === purpose)?.label}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
      <p className="text-sm font-semibold text-gray-700">🇺🇸 Travel Information</p>

      {/* Visa type */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Purpose of Trip to the U.S.</p>
        <select
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={purpose}
          onChange={(e) => { setPurpose(e.target.value); setSpecify(""); setSevis(""); }}
        >
          <option value="">— PLEASE SELECT A VISA CLASS —</option>
          {VISA_TYPES.map((v) => (
            <option key={v.value} value={v.value}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* B visa subtype */}
      {purpose === "B" && (
        <div>
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
        <div className="space-y-2">
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

      {/* Arrival date */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Intended Date of Arrival (DD MMM YYYY)</p>
        <input
          type="text"
          placeholder="e.g. 15 JUN 2026"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={arrivalDate}
          onChange={(e) => setArrivalDate(e.target.value)}
        />
      </div>

      {/* Length of stay */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Intended Length of Stay in U.S.</p>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            placeholder="e.g. 3"
            className="w-24 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lengthNum}
            onChange={(e) => setLengthNum(String(Math.max(1, parseInt(e.target.value) || 1)))}
          />
          <select
            className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={lengthUnit}
            onChange={(e) => setLengthUnit(e.target.value)}
          >
            {LENGTH_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* US stay address */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Address Where You Will Stay in the U.S.</p>
        <input
          type="text"
          placeholder="Street Address"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="City"
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>

      {/* Person paying */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Person/Entity Paying for Your Trip</p>
        <select
          className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={payer}
          onChange={(e) => setPayer(e.target.value)}
        >
          <option value="">— SELECT —</option>
          {PAYER_TYPES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      <button
        disabled={!canSubmit}
        onClick={handleSubmit}
        className="w-full mt-2 bg-blue-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
      >
        Save & Continue
      </button>
    </div>
  );
}
