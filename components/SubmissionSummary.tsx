"use client";

import { useState } from "react";
import { useFormStore } from "@/store/useFormStore";

interface SubmissionSummaryProps {
  onComplete: () => void;
}

export default function SubmissionSummary({ onComplete }: SubmissionSummaryProps) {
  const { formData, getCompletionPercentage } = useFormStore();
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("PDF generation failed");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ds160-worksheet.pdf";
      a.click();
      URL.revokeObjectURL(url);
      onComplete();
    } catch (err) {
      console.error(err);
      alert("PDF generation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const sections = [
    {
      title: "Personal Information",
      fields: [
        { label: "Surnames", value: formData.surnames },
        { label: "Given Names", value: formData.given_names },
        { label: "Date of Birth", value: formData.date_of_birth },
        { label: "City of Birth", value: formData.city_of_birth },
        { label: "Country of Birth", value: formData.country_of_birth },
        { label: "Nationality", value: formData.nationality },
        { label: "Sex", value: formData.sex === "M" ? "Male" : formData.sex === "F" ? "Female" : "" },
        { label: "Marital Status", value: formData.marital_status },
      ],
    },
    {
      title: "Passport",
      fields: [
        { label: "Passport Number", value: formData.passport_number },
        { label: "Date of Issue", value: formData.passport_date_of_issue },
        { label: "Date of Expiry", value: formData.passport_date_of_expiry },
        { label: "Place of Issue", value: formData.passport_place_of_issue },
      ],
    },
    {
      title: "Travel Information",
      fields: [
        { label: "Purpose of Trip", value: formData.purpose_of_trip },
        { label: "Intended Arrival", value: formData.intended_arrival_date },
        { label: "Length of Stay", value: formData.intended_length_of_stay },
        { label: "US Stay Address", value: formData.us_stay_address_street },
        { label: "Person Paying", value: formData.person_paying_for_trip },
      ],
    },
    {
      title: "Previous US Travel",
      fields: [
        { label: "Ever Been in US", value: formData.ever_been_in_us === "Y" ? "Yes" : formData.ever_been_in_us === "N" ? "No" : "" },
        { label: "Ever Issued US Visa", value: formData.ever_issued_us_visa === "Y" ? "Yes" : formData.ever_issued_us_visa === "N" ? "No" : "" },
        { label: "Ever Refused US Visa", value: formData.ever_refused_us_visa === "Y" ? "Yes" : formData.ever_refused_us_visa === "N" ? "No" : "" },
      ],
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-700">📋 DS-160 Preparation Summary</p>
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
          {getCompletionPercentage()}% complete
        </span>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">{section.title}</p>
            <div className="space-y-1">
              {section.fields.map(({ label, value }) => (
                <div key={label} className="grid grid-cols-2 gap-2">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-xs font-medium text-gray-700">
                    {value || <span className="text-gray-300">—</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="w-full mt-4 bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? "Generating PDF..." : "Download Worksheet (PDF)"}
      </button>
    </div>
  );
}
