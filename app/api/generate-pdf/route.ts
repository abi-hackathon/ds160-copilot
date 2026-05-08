import { renderToBuffer, Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { DS160FormData } from "@/store/useFormStore";
import React from "react";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 20, borderBottom: "2px solid #1a56db", paddingBottom: 10 },
  title: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#1a56db", marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#6b7280" },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#1a56db", backgroundColor: "#eff6ff", padding: "4 8", marginBottom: 8 },
  row: { flexDirection: "row", marginBottom: 4, paddingBottom: 4, borderBottom: "0.5px solid #f3f4f6" },
  label: { width: "40%", color: "#6b7280", fontSize: 9 },
  value: { width: "60%", fontFamily: "Helvetica-Bold", fontSize: 9 },
  empty: { width: "60%", color: "#d1d5db", fontSize: 9 },
  warning: { backgroundColor: "#fff7ed", border: "1px solid #fed7aa", padding: "6 10", marginBottom: 16 },
  warningText: { fontSize: 8, color: "#92400e" },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, borderTop: "0.5px solid #e5e7eb", paddingTop: 8, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 8, color: "#9ca3af" },
});

function field(label: string, value?: string) {
  return React.createElement(View, { style: styles.row },
    React.createElement(Text, { style: styles.label }, label),
    value
      ? React.createElement(Text, { style: styles.value }, value)
      : React.createElement(Text, { style: styles.empty }, "Not provided")
  );
}

function section(title: string, ...fields: React.ReactElement[]) {
  return React.createElement(View, { style: styles.section },
    React.createElement(Text, { style: styles.sectionTitle }, title),
    ...fields
  );
}

function buildDoc(f: DS160FormData) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "DS-160 Preparation Worksheet"),
        React.createElement(Text, { style: styles.subtitle }, "Online Nonimmigrant Visa Application — U.S. Department of State"),
        React.createElement(Text, { style: styles.subtitle }, `Generated: ${today}`)
      ),
      React.createElement(View, { style: styles.warning },
        React.createElement(Text, { style: styles.warningText }, "Preparation purposes only. Enter information at ceac.state.gov. Verify all details match your passport.")
      ),
      section("PERSONAL INFORMATION 1",
        field("Surnames", f.surnames),
        field("Given Names", f.given_names),
        field("Sex", f.sex === "M" ? "MALE" : f.sex === "F" ? "FEMALE" : undefined),
        field("Marital Status", f.marital_status),
        field("Date of Birth", f.date_of_birth),
        field("City of Birth", f.city_of_birth),
        field("Country of Birth", f.country_of_birth)
      ),
      section("PERSONAL INFORMATION 2",
        field("Nationality", f.nationality),
        field("National ID Number", f.national_id_number || "Does Not Apply")
      ),
      section("PASSPORT",
        field("Passport Number", f.passport_number),
        field("Date of Issue", f.passport_date_of_issue),
        field("Date of Expiry", f.passport_date_of_expiry),
        field("Place of Issue", f.passport_place_of_issue)
      ),
      section("TRAVEL INFORMATION",
        field("Purpose of Trip", f.purpose_of_trip),
        field("Intended Date of Arrival", f.intended_arrival_date),
        field("Intended Length of Stay", f.intended_length_of_stay),
        field("US Stay Address", f.us_stay_address_street),
        field("Person/Entity Paying", f.person_paying_for_trip)
      ),
      section("PREVIOUS U.S. TRAVEL",
        field("Ever Been in U.S.", f.ever_been_in_us === "Y" ? "YES" : f.ever_been_in_us === "N" ? "NO" : undefined),
        field("Ever Issued U.S. Visa", f.ever_issued_us_visa === "Y" ? "YES" : f.ever_issued_us_visa === "N" ? "NO" : undefined),
        field("Ever Refused U.S. Visa", f.ever_refused_us_visa === "Y" ? "YES" : f.ever_refused_us_visa === "N" ? "NO" : undefined)
      ),
      React.createElement(View, { style: styles.footer, fixed: true },
        React.createElement(Text, { style: styles.footerText }, "DS-160 Copilot — Preparation Worksheet"),
        React.createElement(Text, { style: styles.footerText }, "ceac.state.gov | Not an official government document")
      )
    )
  );
}

export const POST = async (req: NextRequest) => {
  try {
    const formData: DS160FormData = await req.json();
    const buffer = await renderToBuffer(buildDoc(formData));
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="ds160-worksheet.pdf"',
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
};
