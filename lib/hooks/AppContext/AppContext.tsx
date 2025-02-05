import { createContext } from "react";
import * as r4 from "fhir/r4";
import Client from "fhirclient/lib/Client";

export type EHRTypes = "smarthealthit" | "epic" | "cerner" | "athenahealth";

export interface IAppContext {
  // MeldRx Data...
  accessToken: string;
  idToken: string;
  ehrType: EHRTypes | "";
  patientFhirId: string;
  patient: r4.Patient | null;
  patientResource: {
    AllergyIntolerance?: r4.AllergyIntolerance[];
    Condition?: r4.Condition[];
    // Medication?: any[];
    // MedicationRequest?: any[];
    // Observation?: any[];
    // Procedure?: any[];
    // Immunization?: any[];
  } | null;
  fhirUrl: string;

  fhirClient: Client | null;

  setAccessToken: (accessToken: string) => void;
  setIdToken: (idToken: string) => void;
  setEhrType: (ehrType: EHRTypes) => void;
  setPatientFhirId: (patientFhirId: string) => void;
  setPatient: (patient: r4.Patient | null) => void;
  setPatientResource: (
    patientResource: {
      AllergyIntolerance?: any[];
      Condition?: any[];
      //   Medication?: any[];
      //   MedicationRequest?: any[];
      //   Observation?: any[];
      //   Procedure?: any[];
      //   Immunization?: any[];
    } | null
  ) => void;
  setFhirUrl: (fhirUrl: string) => void;
  setFhirClient: (fhirClient: Client | null) => void;
}

export const AppContext = createContext<IAppContext>({
  accessToken: "",
  idToken: "",
  ehrType: "",
  patientFhirId: "",
  patient: null,
  patientResource: null,
  fhirUrl: "",
  fhirClient: null,

  setAccessToken: (accessToken: string) => {},
  setIdToken: (idToken: string) => {},
  setEhrType: (ehrType: string) => {},
  setPatientFhirId: (patientFhirId: string) => {},
  setPatient: (patient: r4.Patient | null) => {},
  setPatientResource: (
    patientResource: {
      AllergyIntolerance?: any[];
      Condition?: any[];
      Medication?: any[];
      MedicationRequest?: any[];
      Observation?: any[];
      Procedure?: any[];
      Immunization?: any[];
    } | null
  ) => {},
  setFhirUrl: (fhirUrl: string) => {},
  setFhirClient: (fhirClient: Client | null) => {},
});
