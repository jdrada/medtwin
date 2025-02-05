import { useMemo, useState, useEffect } from "react";
import { EHRTypes, IAppContext, AppContext } from "./AppContext";
import * as r4 from "fhir/r4";
import Client from "fhirclient/lib/Client";

export interface IAppProviderProps {
  children: React.ReactNode;
}

const DEFAULT_APP_CONTEXT: IAppContext = {
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
  setPatient: (patient: any) => {},
  setPatientResource: (patientResource: any) => {},
  setFhirUrl: (fhirUrl: string) => {},
  setFhirClient: (fhirClient: Client | null) => {},
};

export function AppProvider(props: IAppProviderProps) {
  // Initialize state from sessionStorage if available
  const [accessToken, setAccessToken] = useState<string>(
    () =>
      sessionStorage.getItem("accessToken") || DEFAULT_APP_CONTEXT.accessToken
  );
  const [idToken, setIdToken] = useState<string>(
    () => sessionStorage.getItem("idToken") || DEFAULT_APP_CONTEXT.idToken
  );
  const [ehrType, setEhrType] = useState<EHRTypes | "">(
    () =>
      (sessionStorage.getItem("ehrType") as EHRTypes) ||
      DEFAULT_APP_CONTEXT.ehrType
  );
  const [patientFhirId, setPatientFhirId] = useState<string>(
    () =>
      sessionStorage.getItem("patientFhirId") ||
      DEFAULT_APP_CONTEXT.patientFhirId
  );
  const [patient, setPatient] = useState<r4.Patient | null>(() => {
    const savedPatient = sessionStorage.getItem("patient");
    return savedPatient
      ? JSON.parse(savedPatient)
      : DEFAULT_APP_CONTEXT.patient;
  });
  const [patientResource, setPatientResource] = useState(() => {
    const savedResources = sessionStorage.getItem("patientResource");
    return savedResources
      ? JSON.parse(savedResources)
      : DEFAULT_APP_CONTEXT.patientResource;
  });
  const [fhirUrl, setFhirUrl] = useState<string>(
    () => sessionStorage.getItem("fhirUrl") || DEFAULT_APP_CONTEXT.fhirUrl
  );
  const [fhirClient, setFhirClient] = useState<Client | null>(
    DEFAULT_APP_CONTEXT.fhirClient
  );

  // Update sessionStorage when state changes
  useEffect(() => {
    if (accessToken) sessionStorage.setItem("accessToken", accessToken);
  }, [accessToken]);

  useEffect(() => {
    if (idToken) sessionStorage.setItem("idToken", idToken);
  }, [idToken]);

  useEffect(() => {
    if (ehrType) sessionStorage.setItem("ehrType", ehrType);
  }, [ehrType]);

  useEffect(() => {
    if (patientFhirId) sessionStorage.setItem("patientFhirId", patientFhirId);
  }, [patientFhirId]);

  useEffect(() => {
    if (patient) sessionStorage.setItem("patient", JSON.stringify(patient));
  }, [patient]);

  useEffect(() => {
    if (fhirUrl) sessionStorage.setItem("fhirUrl", fhirUrl);
  }, [fhirUrl]);

  useEffect(() => {
    if (patientResource) {
      sessionStorage.setItem(
        "patientResource",
        JSON.stringify(patientResource)
      );
    }
  }, [patientResource]);

  useEffect(() => {
    const loadPatient = async () => {
      if (!fhirClient || !patientFhirId || !accessToken || patient !== null) {
        return;
      }

      try {
        const patients = await fhirClient.request(
          `Patient?_id=${patientFhirId}`,
          {
            flat: true,
          }
        );
        const loadedPatient = patients[0] ?? null;
        setPatient(loadedPatient);
      } catch (error) {
        console.error("Error loading patient:", error);
      }
    };

    loadPatient();
  }, [fhirClient, patientFhirId, accessToken, patient]);

  const clearSession = () => {
    sessionStorage.clear();
    setAccessToken("");
    setIdToken("");
    setEhrType("");
    setPatientFhirId("");
    setPatient(null);
    setFhirUrl("");
    setFhirClient(null);
  };

  return (
    <AppContext.Provider
      value={{
        accessToken,
        idToken,
        ehrType,
        patientFhirId,
        patient,
        patientResource,
        fhirUrl,
        fhirClient,
        setAccessToken,
        setIdToken,
        setEhrType,
        setPatientFhirId,
        setPatient,
        setPatientResource,
        setFhirUrl,
        setFhirClient,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
}
