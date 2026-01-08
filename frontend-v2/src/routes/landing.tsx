import { CTASection } from '@/features/landing/components/cta-section';
import { FeaturesSection } from '@/features/landing/components/features-secion';
import { Header } from '@/features/landing/components/header';
import { HeroSection } from '@/features/landing/components/hero-section';
import { ServicesSection } from '@/features/landing/components/services-section';
import { TestimonialsSection } from '@/features/landing/components/testimonials-section';
import { Footer } from '@/routes/customer/layout/footer';

export default function LandingRoute() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
