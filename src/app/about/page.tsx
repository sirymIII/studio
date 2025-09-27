import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="prose prose-lg mx-auto max-w-3xl">
              <h1 className="font-headline text-4xl font-bold">
                Tourism in Nigeria
              </h1>
              <p>
                Nigeria is one of Africa’s most dynamic destinations, offering
                travelers a unique mix of history, culture, and natural wonders.
                With over 250 ethnic groups, the country’s cultural diversity
                shines through in its festivals, art, music, and cuisine.
                Visitors can witness the grandeur of the Durbar festival in the
                North, the sacred traditions of the Osun-Osogbo Festival, or the
                vibrant nightlife of Lagos.
              </p>
              
              <div className="relative my-8 h-96 w-full overflow-hidden rounded-lg">
                <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/Zuma_Rock_in_Nigeria_2.jpg/1280px-Zuma_Rock_in_Nigeria_2.jpg"
                  alt="Zuma Rock, a large monolith in Nigeria"
                  fill
                  className="object-cover"
                />
              </div>

              <p>
                Nature lovers will find plenty to explore: the rolling hills and
                serene landscapes of Obudu Mountain Resort, the spectacular
                Erin-Ijesha Waterfalls, Zuma Rock’s iconic silhouette, and the
                wildlife-rich Yankari National Park. For those seeking
                relaxation, Nigeria’s coastline is dotted with beautiful beaches
                perfect for unwinding.
              </p>
              <p>
                Beyond sights and sounds, Nigeria’s warm hospitality leaves a
                lasting impression. Every region offers its own unique charm,
                making travel across the country a rewarding and unforgettable
                journey.
              </p>
              <p>
                Nigeria truly is the heartbeat of Africa—where culture, nature,
                and adventure come alive.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
