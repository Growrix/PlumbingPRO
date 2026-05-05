import { HeroSection } from "@/features/home/HeroSection";
import { StatsBar } from "@/features/home/StatsBar";
import { ServicesPreview } from "@/features/home/ServicesPreview";
import { TrustSection } from "@/features/home/TrustSection";
import { TestimonialsSection } from "@/features/home/TestimonialsSection";
import { CtaBanner } from "@/features/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <ServicesPreview />
      <TrustSection />
      <TestimonialsSection />
      <CtaBanner />
    </>
  );
}
