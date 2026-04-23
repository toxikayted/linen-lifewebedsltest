import HeroSection from '../components/sections/HeroSection'
import FeaturedSection from '../components/sections/FeaturedSection'
import ConceptStrip from '../components/sections/ConceptStrip'
import PreorderCTASection from '../components/sections/PreorderCTASection'

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <FeaturedSection />
      <ConceptStrip />
      <PreorderCTASection />
    </main>
  )
}
