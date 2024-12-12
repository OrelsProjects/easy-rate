"use client";

import { AnimatedText } from "@/components/landing-page/animated-text";
import { Demo } from "@/components/landing-page/demo";
import Pricing from "@/components/landing-page/plans";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col space-y-12">
      <header className="text-center mb-12"></header>
      <main className="relative h-screen container mx-auto text-center pb-12">
        <AnimatedText text="Try it. You'll get it." />
        <Demo />
        <Pricing />
      </main>
    </div>
  );
}
