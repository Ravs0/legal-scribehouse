import { Hero } from '@/components/home/HeroStage';
import { SeamFade } from '@/components/site/SeamFade';
import { ScrollStory } from '@/components/home/ScrollStory';
import { Desk } from '@/components/home/Desk';
import { Markets } from '@/components/home/Markets';
import { Services } from '@/components/home/Services';
import { Glance } from '@/components/home/Glance';
import { Process } from '@/components/home/Process';
import { ReadinessCheck } from '@/components/home/ReadinessCheck';
import { Proof } from '@/components/home/Proof';
import { InsightsTeaser } from '@/components/home/InsightsTeaser';
import { Faq } from '@/components/home/Faq';
import { Contact } from '@/components/home/Contact';

// v4.0 "Regional desk" order: the desk and its people first, then what we do and how, where, the interactive
// tools, proof, reading, questions, contact.
const Index = () => (
  <>
    <Hero />
    {/* Each seam fades the colour of one scene over the real background of its neighbour (no added bands). */}
    <SeamFade color="#D5B792" height={120} />
    <ScrollStory />
    <SeamFade color="#16120F" height={110} />
    <Desk />
    {/* The desk casts a short shadow onto the next room's wall. */}
    <SeamFade color="rgb(60 30 10 / 0.42)" height={64} />
    <Services />
    <SeamFade color="#E1C8A0" height={96} />
    <Process />
    <SeamFade color="#0D3E43" height={190} />
    <Markets />
    <ReadinessCheck />
    <Glance />
    <SeamFade color="#1F1915" onto="prev" height={150} />
    <Proof />
    <SeamFade color="#120F0D" height={170} />
    <InsightsTeaser />
    <Faq />
    <Contact />
  </>
);

export default Index;
