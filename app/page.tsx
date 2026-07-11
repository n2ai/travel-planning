import {getAllDestinations} from "@/lib/queries/destination";
import {getDestinationBySlug} from "@/lib/queries/destination";
import { Destination } from "@/lib/type";
import GlobeSection from "@/components/GlobeSection";
import SearchBox from "@/components/SearchBox";
import Link from "next/link";


export default async function Home() {
  const destinations = await getAllDestinations();
  return (
    <main className="min-h-screen overflow-x-hidden bg-cream">
      <section className="grid md:grid-cols-2 items-center min-h-screen max-w-7xl mx-auto px-8">
          {/* Cột trái */}
          <div>
              <h1 className="font-heading font-extrabold uppercase text-gradient-hero text-5xl lg:text-6xl leading-tight tracking-tight">Ready to see the world?</h1>
              <p className="font-extrabold text-charcoal text-1xl lg:text-2xl">Experience the world in your way</p>

              {/**Search Box */}
              <div className="mt-4">
                <SearchBox destinations={destinations} />
              </div>

              {/**Get Started button */}

              <div className="mt-15">
                <Link
                    href="#featured"
                    className="inline-block rounded-full bg-gradient-cta px-8 py-3.5
                              font-heading font-extrabold text-white
                              shadow-lg shadow-blue/25
                              transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                    Get started.
                </Link>
              </div>

          </div>
          {/* Cột phải */}
          <div className="relative md:w-[100%] md:translate-x-[-40%]">
              <GlobeSection destinations={destinations} />
          </div>
      </section>
    </main>
  )
}