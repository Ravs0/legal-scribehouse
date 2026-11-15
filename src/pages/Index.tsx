import { Hero } from '@/components/home/Hero';
import { Problems } from '@/components/home/Problems';
import { Markets } from '@/components/home/Markets';
import { Services } from '@/components/home/Services';
import { Glance } from '@/components/home/Glance';
import { Process } from '@/components/home/Process';
import { ReadinessCheck } from '@/components/home/ReadinessCheck';
import { Proof } from '@/components/home/Proof';
import { InsightsTeaser } from '@/components/home/InsightsTeaser';
import { Faq } from '@/components/home/Faq';
import { Contact } from '@/components/home/Contact';

const Index = () => (
  <>
    <Hero />
    <Problems />
    <Markets />
    <Services />
    <Glance />
    <Process />
    <ReadinessCheck />
    <Proof />
    <InsightsTeaser />
    <Faq />
    <Contact />
  </>
);

export default Index;
