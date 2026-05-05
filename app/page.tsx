"use client";

import { CopilotSidebar } from "@copilotkit/react-ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">DS-160 Copilot</h1>
      <p className="text-gray-500">Form preparation tool — coming soon.</p>
      <CopilotSidebar
        defaultOpen={true}
        clickOutsideToClose={false}
        labels={{
          title: "DS-160 Copilot",
          initial: "Hi! I'll help you prepare your DS-160 application.",
        }}
      />
    </main>
  );
}
