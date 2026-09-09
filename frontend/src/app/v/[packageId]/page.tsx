import React from "react";
import ClientVerificationPage from "./ClientVerificationPage";

export async function generateStaticParams() {
  return [
    { packageId: "HC-PKG-A7F93E12" },
    { packageId: "HC-PKG-B8C24D91" },
    { packageId: "HC-PKG-C3D45E67" },
    { packageId: "demo" }
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ packageId: string }>;
}) {
  const resolvedParams = await params;
  return <ClientVerificationPage packageId={resolvedParams.packageId} />;
}
