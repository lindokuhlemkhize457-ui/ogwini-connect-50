import { Layout } from "@/components/layout/Layout";
import { HeroSection, FeaturesSection, StatsSection, CTASection } from "@/components/home/HeroSection";
import { OGAssistWidget } from "@/components/OGAssistWidget";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <OGAssistWidget />
    </Layout>
  );
};

export default Index;
