import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

export const POST = async (req: NextRequest) => {
  try {
    const { imageBase64, mediaType } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Extract the following fields from this passport bio page and return ONLY a valid JSON object with no additional text, markdown, or explanation.

Fields to extract:
- surnames
- given_names
- nationality
- sex (return "M" for male, "F" for female)
- date_of_birth (format: DD MMM YYYY, e.g. "15 AUG 1980")
- city_of_birth
- country_of_birth
- passport_number
- passport_date_of_issue (format: DD MMM YYYY)
- passport_date_of_expiry (format: DD MMM YYYY)
- passport_place_of_issue

If a field is not visible or not applicable, return an empty string for that field.
Return ONLY the JSON object.`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const extracted = JSON.parse(clean);

    return NextResponse.json(extracted);
  } catch (err) {
    console.error("Passport extraction error:", err);
    return NextResponse.json(
      { error: "Failed to extract passport data" },
      { status: 500 }
    );
  }
};
