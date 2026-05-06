import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import DS160Worksheet from "@/components/DS160Worksheet";
import React from "react";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.json();

    const buffer = await renderToBuffer(
      React.createElement(DS160Worksheet, { formData })
    );

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ds160-worksheet.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
};
