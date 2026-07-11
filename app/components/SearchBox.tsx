'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Destination } from "@/lib/type";

export default function SearchBox({destinations}: {destinations: Destination[]}) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const trimmedQuery = query.trim().toLocaleLowerCase();

    const currentDestinations = destinations
    .filter((destination) =>
        destination.name.toLowerCase().includes(trimmedQuery) ||
        destination.country.toLowerCase().includes(trimmedQuery)
    )
    .slice(0, 8);
    

    return(
        <div className="relative w-full max-w-md">
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 stroke-navy/50"
            >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
            </svg>
            <input value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search destinations..."
                className="w-full rounded-full bg-cream py-3.5 pl-12 pr-5 shadow-lg outline-none focus:ring-2 focus:ring-blue/30"
                />
            {trimmedQuery !== '' && currentDestinations.length > 0 && (
                <ul className="absolute top-full mt-2 w-full z-20 rounded-2xl bg-white shadow-xl overflow-hidden">
                    {currentDestinations.map((destination) => {
                        return (
                            <li key={destination.id} >
                                <button onClick={() => {
                                    router.push(`/destinations/${destination.slug}`);
                                    setQuery('');
                                }}
                                    className="flex w-full items-baseline justify-between px-5 py-3 text-left hover:bg-lavender"
                                >
                                    <span className="font-heading font-semibold text-navy">{destination.name}</span>
                                    <span className="text-sm text-charcoal/60">{destination.country}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
    
    
}