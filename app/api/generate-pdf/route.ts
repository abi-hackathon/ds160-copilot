import { renderToBuffer } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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

const Field = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {value ? <Text style={styles.value}>{value}</Text> : <Text style={styles.empty}>Not provided</Text>}
  </View>
);

function buildDocument(formData: DS160FormData) {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return React.createElement(Document, {},
    React.createElement(Page, { size: "A4", style: styles.page },
      React.createElement(View, { style: styles.header },
        React.createElement(Text, { style: styles.title }, "DS-160 Preparation Worksheet"),
        React.createElement(Text, { style: styles.subtitle }, "Online Nonimmigrant Visa Application — U.S. Department of State"),
        React.createElement(Text, { style: styles.subtitle }, `Generated: ${today}`)
      ),
      React.createElement(View, { style: styles.warning },
        React.createElement(Text, { style: styles.warningText }, "This worksheet is for preparation purposes only. Enter information at ceac.state.gov. Verify all details match your passport exactly.")
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "PERSONAL INFORMATION 1"),
        React.createElement(Field, { label: "Surnames", value: formData.surnames }),
        React.createElement(Field, { label: "Given Names", value: formData.given_names }),
        React.createElement(Field, { label: "Sex", value: formData.sex === "M" ? "MALE" : formData.sex === "F" ? "FEMALE" : "" }),
        React.createElement(Field, { label: "Marital Status", value: formData.marital_status }),
        React.createElement(Field, { label: "Date of Birth", value: formData.date_of_birth }),
        React.createElement(Field, { label: "City of Birth", value: formData.city_of_birth }),
        React.createElement(Field, { label: "Country of Birth", value: formData.country_of_birth })
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "PERSONAL INFORMATION 2"),
        React.createElement(Field, { label: "Nationality", value: formData.nationality }),
        React.createElement(Field, { label: "National ID Number", value: formData.national_id_number || "Does Not Apply" })
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "PASSPORT"),
        React.createElement(Field, { label: "Passport Number", value: formData.passport_number }),
        React.createElement(Field, { label: "Date of Issue", value: formData.passport_date_of_issue }),
        React.createElement(Field, { label: "Date of Expiry", value: formData.passport_date_of_expiry }),
        React.createElement(Field, { label: "Place of Issue", value: formData.passport_place_of_issue })
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "TRAVEL INFORMATION"),
        React.createElement(Field, { label: "Purpose of Trip", value: formData.purpose_of_trip }),
        React.createElement(Field, { label: "Intended Date of Arrival", value: formData.intended_arrival_date }),
        React.createElement(Field, { label: "Intended Length of Stay", value: formData.intended_length_of_stay }),
        React.createElement(Field, { label: "US Stay Address", value: formData.us_stay_address_street }),
        React.createElement(Field, { label: "Person/Entity Paying", value: formData.person_paying_for_trip })
      ),
      React.createElement(View, { style: styles.section },
        React.createElement(Text, { style: styles.sectionTitle }, "PREVIOUS U.S. TRAVEL"),
        React.createElement(Field, { label: "Ever Been in U.S.", value: formData.ever_been_in_us === "Y" ? "YES" : formData.ever_been_in_us === "N" ? "NO" : "" }),
        React.createElement(Field, { label: "Ever Issued U.S. Visa", value: formData.ever_issued_us_visa === "Y" ? "YES" : formData.ever_issued_us_visa === "N" ? "NO" : "" }),
        React.createElement(Field, { label: "Ever Refused U.S. Visa", value: formData.ever_refused_us_visa === "Y" ? "YES" : formData.ever_refused_us_visa === "N" ? "NO" : "" })
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
    const doc = buildDocument(formData);
    const buffer = await renderToBuffer(doc);
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
