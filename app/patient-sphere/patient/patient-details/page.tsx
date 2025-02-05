"use client";

import React, { useContext } from "react";
import Head from "next/head";
import { AppContext } from "@/lib/hooks/AppContext/AppContext";
import AllergyDisplay from "@/components/allergy-display";

export interface IPageProps {}
export default function Page(props: IPageProps) {
  const appContext = useContext(AppContext);

  const patient = appContext.patient;
  const patientResource = appContext.patientResource;

  if (!patient || !patientResource) {
    return <div>No patient Data</div>;
  }

  return (
    <div className="p-8">
      <Head>
        <title>
          {patient.name?.[0]?.given?.[0]} {patient.name?.[0]?.family} Digital
          Clone
        </title>
      </Head>

      <div>
        <h1 className="text-2xl font-bold">Patient Details</h1>
        <p>
          <strong>Patient Name:</strong> {patient.name?.[0]?.given?.[0]}{" "}
          {patient.name?.[0]?.family}
        </p>
        <p>
          <strong>Sex:</strong> {patient.gender}
        </p>
        <p>
          <strong>D.O.B.:</strong> {patient.birthDate}
        </p>
        <p>
          <strong>Race:</strong>{" "}
          {patient?.extension?.[0]?.extension?.[0]?.valueCoding?.display}
          {", "}
          {patient?.extension?.[0]?.extension?.[2]?.valueString}{" "}
          {patient?.extension?.[0]?.extension?.[1]?.valueCoding?.display}
        </p>
        <p>
          <strong>Ethnicity:</strong>{" "}
          {patient?.extension?.[1]?.extension?.[0]?.valueCoding?.display}
        </p>

        <p>
          <strong>Contact Info:</strong> {patient.telecom?.[0]?.value}
        </p>
      </div>

      <AllergyDisplay allergy={patientResource.AllergyIntolerance} />

      {/* <pre>{JSON.stringify(patient, null, 2)}</pre> */}
    </div>
  );
}
