"use client";
import React, { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import FHIR from "fhirclient";
import Client from "fhirclient/lib/Client";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";

interface IPage {
  params: { [key: string]: any };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page(props: IPage) {
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    FHIR.oauth2
      .ready()
      .then(async (client: Client) => {
        console.log("client", client);

        // Clear existing session storage before setting new patient data
        sessionStorage.clear();

        // Save the fhirClient...
        appContext.setFhirClient(client);

        // Save some data from the response...
        if (client.patient.id) {
          appContext.setPatientFhirId(client.patient.id ?? "");
        }
        if (client.state.serverUrl) {
          appContext.setFhirUrl(client.state.serverUrl ?? "");
        }
        appContext.setAccessToken(
          client.state.tokenResponse?.access_token ?? ""
        );
        appContext.setIdToken(client.state.tokenResponse?.id_token ?? "");

        // Redirect to /patient-sphere/patient/patient-details...

        const patientId = client.patient.id;

        const patient = await client.patient.read();
        appContext.setPatient(patient);
        console.log("patient", patient);

        // Fetch multiple resource types for the patient
        const resourceTypes = [
          "AllergyIntolerance",
          "Condition",
          // "Medication",
          // "MedicationRequest",
          // "Observation",
          // // "Procedure",
          // "Immunization",
        ];

        const resourcePromises = resourceTypes.map((resourceType) =>
          client.request(`${resourceType}?patient=${patientId}`)
        );

        try {
          const responses = await Promise.all(resourcePromises);
          const patientResources = responses.reduce((acc, response, index) => {
            acc[resourceTypes[index]] = response.entry || [];
            return acc;
          }, {});

          console.log("Patient Resources:", patientResources);
          appContext.setPatientResource(patientResources);
        } catch (error) {
          console.error("Error fetching patient resources:", error);
        }

        router.push("/patient-sphere/patient/patient-details");
      })
      .catch(console.error);
  }, []);

  return <div>Loading...</div>;
}
