import { HeroSection } from '../views/home/components/hero-section'
import { PillarsSection } from '../views/home/components/pillars-section'
import { QuickstartSection } from '../views/home/components/quickstart-section'
import { ComparisonSection } from '../views/home/components/comparison-section'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* 1. Aperture & Shutter Masthead / Hero */}
      <HeroSection />

      {/* 2. Core Engine Primitives (01-06) */}
      <PillarsSection />

      {/* 3. Developer Quickstart Code Examples (with Prism Syntax Theme) */}
      <QuickstartSection />

      {/* 4. Engine Benchmark Comparison Table */}
      <ComparisonSection />
    </div>
  )
}
