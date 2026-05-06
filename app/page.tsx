"use client";

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import PassportExtractor from "@/components/PassportExtractor";
import PurposeOfTripWidget from "@/components/PurposeOfTripWidget";
import TravelHistoryTable from "@/components/TravelHistoryTable";
import PersonalInfoCard from "@/components/PersonalInfoCard";
import SubmissionSummary from "@/components/SubmissionSummary";
import { useFormStore } from "@/store/useFormStore";

export default function Home() {
  const { formData, getCompletionPercentage } = useFormStore();

  useCopilotReadable({
    description: "Current DS-160 form state — what fields are filled and what still needs to be collected",
    value: formData,
  });

  useCopilotAction({
    name: "show_passport_extractor",
    description: "Show the passport upload widget to extract personal information from the user's passport bio page. Use this at the start of the session or when the user wants to upload their passport.",
    parameters: [],
    handler: async () => "Passport extractor shown to user.",
    render: () => (
      <PassportExtractor
        onComplete={(data) => console.log("Passport extracted:", data)}
      />
    ),
  });

  useCopilotAction({
    name: "show_purpose_of_trip",
    description: "Show the visa type selection widget. Use this after passport extraction or when the user needs to specify their purpose of travel to the US.",
    parameters: [],
    handler: async () => "Purpose of trip widget shown to user.",
    render: () => (
      <PurposeOfTripWidget
        onComplete={(data) => console.log("Purpose of trip saved:", data)}
      />
    ),
  });

  useCopilotAction({
    name: "show_travel_history",
    description: "Show the previous US travel history widget. Use this after purpose of trip is set, or when the user wants to enter their previous US travel information, visa history, or visa refusals.",
    parameters: [],
    handler: async () => "Travel history widget shown to user.",
    render: () => (
      <TravelHistoryTable
        onComplete={(data) => console.log("Travel history saved:", data)}
      />
    ),
  });

  useCopilotAction({
    name: "show_personal_info_review",
    description: "Show the personal information review card so the user can verify and correct details extracted from their passport. Use this after passport extraction.",
    parameters: [],
    handler: async () => "Personal info review shown to user.",
    render: () => (
      <PersonalInfoCard
        onComplete={(data) => console.log("Personal info confirmed:", data)}
      />
    ),
  });

  useCopilotAction({
    name: "show_submission_summary",
    description: "Show the final DS-160 preparation summary with all collected information. Use this when the user asks to review everything, see a summary, or download their worksheet.",
    parameters: [],
    handler: async () => "Submission summary shown to user.",
    render: () => (
      <SubmissionSummary
        onComplete={() => console.log("PDF download requested")}
      />
    ),
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">DS-160 Copilot</h1>
          <p className="text-gray-500 mt-1">AI-powered visa application preparation</p>
        </div>

        <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 font-medium">Form Progress</span>
            <span className="text-blue-600 font-semibold">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getCompletionPercentage()}%` }}
            />
          </div>
        </div>

        {formData.surnames && (
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Extracted Info</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {formData.surnames && (
                <div><span className="text-gray-400">Surnames: </span><span className="font-medium">{formData.surnames}</span></div>
              )}
              {formData.given_names && (
                <div><span className="text-gray-400">Given Names: </span><span className="font-medium">{formData.given_names}</span></div>
              )}
              {formData.date_of_birth && (
                <div><span className="text-gray-400">DOB: </span><span className="font-medium">{formData.date_of_birth}</span></div>
              )}
              {formData.passport_number && (
                <div><span className="text-gray-400">Passport No: </span><span className="font-medium">{formData.passport_number}</span></div>
              )}
              {formData.nationality && (
                <div><span className="text-gray-400">Nationality: </span><span className="font-medium">{formData.nationality}</span></div>
              )}
              {formData.sex && (
                <div><span className="text-gray-400">Sex: </span><span className="font-medium">{formData.sex === "M" ? "Male" : "Female"}</span></div>
              )}
              {formData.purpose_of_trip && (
                <div><span className="text-gray-400">Visa Type: </span><span className="font-medium">{formData.purpose_of_trip}</span></div>
              )}
              {formData.ever_been_in_us && (
                <div><span className="text-gray-400">Been in US: </span><span className="font-medium">{formData.ever_been_in_us === "Y" ? "Yes" : "No"}</span></div>
              )}
            </div>
          </div>
        )}

        {!formData.surnames && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-4xl mb-3">👋</p>
            <p className="text-gray-700 font-medium">Tell the copilot you want to start your DS-160</p>
            <p className="text-gray-400 text-sm mt-1">It will guide you field by field</p>
          </div>
        )}
      </div>

      <CopilotSidebar
        defaultOpen={true}
        clickOutsideToClose={false}
        labels={{
          title: "DS-160 Copilot",
          initial: "Hi! I'll help you prepare your DS-160 application. To get started, upload your passport bio page and I'll extract your personal information automatically. Just say 'let's start' or 'upload passport'.",
        }}
      />
    </main>
  );
}
