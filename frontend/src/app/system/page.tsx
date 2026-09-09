"use client";

import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { ProblemSection } from "@/components/ProblemSection";
import { InspectionLimitsSection } from "@/components/InspectionLimitsSection";
import { OurApproachSection } from "@/components/OurApproachSection";
import { SensingMatrixSection } from "@/components/SensingMatrixSection";
import { ThermalThermodynamicsSection } from "@/components/ThermalThermodynamicsSection";
import { AcousticIntelligenceSection } from "@/components/AcousticIntelligenceSection";
import { FieldNodeSection } from "@/components/FieldNodeSection";
import { EmbeddedProcessingSection } from "@/components/EmbeddedProcessingSection";
import { DualRadioNetworkSection } from "@/components/DualRadioNetworkSection";
import { GatewayEdgeSection } from "@/components/GatewayEdgeSection";
import { EdgeDiagnosticsSection } from "@/components/EdgeDiagnosticsSection";
import { MultiHiveNetworkSection } from "@/components/MultiHiveNetworkSection";
import { MultiPhysicsSimulationSection } from "@/components/MultiPhysicsSimulationSection";
import { ValidationEvidenceSection } from "@/components/ValidationEvidenceSection";
import { PrototypeBenchSection } from "@/components/PrototypeBenchSection";
import { ResultsSection } from "@/components/ResultsSection";
import { TechnicalDocsSection } from "@/components/TechnicalDocsSection";
import { Cpu, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SystemDiagnosticsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090b10] text-[#f1f5f9] font-sans selection:bg-[#f59e0b] selection:text-[#090b10]">
      <Navbar />

      {/* Engineering Diagnostic Header Banner */}
      <div className="bg-[#11141d] border-b border-[#283144] py-3 px-4 font-mono text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#f59e0b]" />
            <span className="font-bold text-[#f1f5f9] uppercase tracking-wider">
              Honey Chain Smart Hive Infrastructure: Deep Hardware & Simulation Console
            </span>
          </div>
          <Link href="/" className="text-[#94a3b8] hover:text-[#f1f5f9] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Honey Chain Overview</span>
          </Link>
        </div>
      </div>

      <main className="flex-grow">
        {/* Full 16-Stage Hardware & Simulation Pipeline */}
        <HeroSection />
        <ProblemSection />
        <InspectionLimitsSection />
        <OurApproachSection />
        <SensingMatrixSection />
        <ThermalThermodynamicsSection />
        <AcousticIntelligenceSection />
        <FieldNodeSection />
        <EmbeddedProcessingSection />
        <DualRadioNetworkSection />
        <GatewayEdgeSection />
        <EdgeDiagnosticsSection />
        <MultiHiveNetworkSection />
        <MultiPhysicsSimulationSection />
        <ValidationEvidenceSection />
        <PrototypeBenchSection />
        <ResultsSection />
        <TechnicalDocsSection />
      </main>

      <Footer />
    </div>
  );
}
