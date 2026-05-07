"use client";

import { useCopilotAction, useCopilotReadable, useCopilotChat } from "@copilotkit/react-core";
import { TextMessage, Role } from "@copilotkit/runtime-client-gql";
import PassportExtractor from "@/components/PassportExtractor";
import PassportWidget from "@/components/PassportWidget";
import PurposeOfTripWidget from "@/components/PurposeOfTripWidget";
import TravelHistoryTable from "@/components/TravelHistoryTable";
import PersonalInfoCard from "@/components/PersonalInfoCard";
import SubmissionSummary from "@/components/SubmissionSummary";
import { useFormStore } from "@/store/useFormStore";

export function useDS160Actions() {
  const { formData } = useFormStore();
  const { appendMessage } = useCopilotChat();

  const advance = (message: string) => {
    appendMessage(new TextMessage({ content: message, role: Role.User }));
  };

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
        onComplete={() => advance("Passport extracted successfully. Please show my passport details for confirmation.")}
      />
    ),
  });

  useCopilotAction({
    name: "show_passport_details",
    description: "Show the passport details confirmation widget. Use this after passport extraction to let the user verify and confirm their passport type, number, dates and place of issue.",
    parameters: [],
    handler: async () => "Passport details widget shown to user.",
    render: () => (
      <PassportWidget
        onComplete={() => advance("Passport details confirmed. Now show my purpose of trip selection.")}
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
        onComplete={() => advance("Purpose of trip saved. Now show my previous US travel history.")}
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
        onComplete={() => advance("Travel history saved. Now show my personal information review.")}
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
        onComplete={() => advance("Personal information confirmed. Now show my DS-160 submission summary.")}
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
}
