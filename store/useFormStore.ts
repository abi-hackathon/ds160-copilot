import { create } from "zustand";

export interface DS160FormData {
  // Personal Info 1
  surnames: string;
  given_names: string;
  full_name_native_alphabet: string;
  other_names_used: "Y" | "N" | "";
  sex: "M" | "F" | "";
  marital_status: string;
  date_of_birth: string;
  city_of_birth: string;
  country_of_birth: string;

  // Personal Info 2
  nationality: string;
  national_id_number: string;

  // Passport
  passport_type: string;
  passport_number: string;
  passport_date_of_issue: string;
  passport_date_of_expiry: string;
  passport_place_of_issue: string;

  // Travel
  purpose_of_trip: string;
  intended_arrival_date: string;
  intended_length_of_stay: string;
  us_stay_address_street: string;
  us_stay_city: string;
  person_paying_for_trip: string;

  // Previous US Travel
  ever_been_in_us: "Y" | "N" | "";
  ever_issued_us_visa: "Y" | "N" | "";
  ever_refused_us_visa: "Y" | "N" | "";
}

interface FormStore {
  formData: DS160FormData;
  completedFields: Set<string>;
  currentField: string | null;
  setField: (key: keyof DS160FormData, value: string) => void;
  setMultipleFields: (fields: Partial<DS160FormData>) => void;
  markFieldComplete: (key: string) => void;
  setCurrentField: (key: string | null) => void;
  getCompletionPercentage: () => number;
}

const emptyForm: DS160FormData = {
  surnames: "",
  given_names: "",
  full_name_native_alphabet: "",
  other_names_used: "",
  sex: "",
  marital_status: "",
  date_of_birth: "",
  city_of_birth: "",
  country_of_birth: "",
  nationality: "",
  national_id_number: "",
  passport_type: "",
  passport_number: "",
  passport_date_of_issue: "",
  passport_date_of_expiry: "",
  passport_place_of_issue: "",
  purpose_of_trip: "",
  intended_arrival_date: "",
  intended_length_of_stay: "",
  us_stay_address_street: "",
  us_stay_city: "",
  person_paying_for_trip: "",
  ever_been_in_us: "",
  ever_issued_us_visa: "",
  ever_refused_us_visa: "",
};

const TOTAL_FIELDS = Object.keys(emptyForm).length;

export const useFormStore = create<FormStore>((set, get) => ({
  formData: emptyForm,
  completedFields: new Set(),
  currentField: null,

  setField: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  setMultipleFields: (fields) =>
    set((state) => ({
      formData: { ...state.formData, ...fields },
      completedFields: new Set([
        ...state.completedFields,
        ...Object.keys(fields),
      ]),
    })),

  markFieldComplete: (key) =>
    set((state) => ({
      completedFields: new Set([...state.completedFields, key]),
    })),

  setCurrentField: (key) => set({ currentField: key }),

  getCompletionPercentage: () => {
    const { completedFields } = get();
    return Math.round((completedFields.size / TOTAL_FIELDS) * 100);
  },
}));
