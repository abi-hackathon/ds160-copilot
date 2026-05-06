import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { DS160FormData } from "@/store/useFormStore";
import React from "react";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #1a56db",
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1a56db",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 9,
    color: "#6b7280",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1a56db",
    backgroundColor: "#eff6ff",
    padding: "4 8",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    paddingBottom: 4,
    borderBottom: "0.5px solid #f3f4f6",
  },
  label: {
    width: "40%",
    color: "#6b7280",
    fontSize: 9,
  },
  value: {
    width: "60%",
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
  },
  empty: {
    width: "60%",
    color: "#d1d5db",
    fontSize: 9,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: "0.5px solid #e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 8,
    color: "#9ca3af",
  },
  warning: {
    backgroundColor: "#fff7ed",
    border: "1px solid #fed7aa",
    padding: "6 10",
    marginBottom: 16,
  },
  warningText: {
    fontSize: 8,
    color: "#92400e",
  },
});

const Field = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    {value ? (
      <Text style={styles.value}>{value}</Text>
    ) : (
      <Text style={styles.empty}>Not provided</Text>
    )}
  </View>
);

interface DS160WorksheetProps {
  formData: DS160FormData;
}

export default function DS160Worksheet({ formData }: DS160WorksheetProps) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>DS-160 Preparation Worksheet</Text>
          <Text style={styles.subtitle}>
            Online Nonimmigrant Visa Application — U.S. Department of State
          </Text>
          <Text style={styles.subtitle}>Generated: {today}</Text>
        </View>

        <View style={styles.warning}>
          <Text style={styles.warningText}>
            ⚠ This worksheet is for preparation purposes only. You must enter this information
            directly into the official DS-160 form at ceac.state.gov. Verify all details
            match your passport exactly before submission.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION 1</Text>
          <Field label="Surnames" value={formData.surnames} />
          <Field label="Given Names" value={formData.given_names} />
          <Field label="Sex" value={formData.sex === "M" ? "MALE" : formData.sex === "F" ? "FEMALE" : ""} />
          <Field label="Marital Status" value={formData.marital_status} />
          <Field label="Date of Birth" value={formData.date_of_birth} />
          <Field label="City of Birth" value={formData.city_of_birth} />
          <Field label="Country of Birth" value={formData.country_of_birth} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PERSONAL INFORMATION 2</Text>
          <Field label="Nationality" value={formData.nationality} />
          <Field label="National ID Number" value={formData.national_id_number || "Does Not Apply"} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PASSPORT</Text>
          <Field label="Passport Number" value={formData.passport_number} />
          <Field label="Date of Issue" value={formData.passport_date_of_issue} />
          <Field label="Date of Expiry" value={formData.passport_date_of_expiry} />
          <Field label="Place of Issue" value={formData.passport_place_of_issue} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TRAVEL INFORMATION</Text>
          <Field label="Purpose of Trip" value={formData.purpose_of_trip} />
          <Field label="Intended Date of Arrival" value={formData.intended_arrival_date} />
          <Field label="Intended Length of Stay" value={formData.intended_length_of_stay} />
          <Field label="US Stay Address" value={formData.us_stay_address_street} />
          <Field label="US Stay City" value={formData.us_stay_city} />
          <Field label="Person/Entity Paying" value={formData.person_paying_for_trip} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREVIOUS U.S. TRAVEL</Text>
          <Field label="Ever Been in U.S." value={formData.ever_been_in_us === "Y" ? "YES" : formData.ever_been_in_us === "N" ? "NO" : ""} />
          <Field label="Ever Issued U.S. Visa" value={formData.ever_issued_us_visa === "Y" ? "YES" : formData.ever_issued_us_visa === "N" ? "NO" : ""} />
          <Field label="Ever Refused U.S. Visa" value={formData.ever_refused_us_visa === "Y" ? "YES" : formData.ever_refused_us_visa === "N" ? "NO" : ""} />
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>DS-160 Copilot — Preparation Worksheet</Text>
          <Text style={styles.footerText}>ceac.state.gov | Not an official government document</Text>
        </View>
      </Page>
    </Document>
  );
}
