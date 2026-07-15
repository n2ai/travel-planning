'use client';
import { useState } from "react";

type Place = {
    id:string,
    displayName: { text: string}
    formattedAddress: string;
    location: { latitude:number, longtitude: number};
};

export default function PlaceSearch({onPick}:{ onPick: (p:Place) => void}){
    const [results, setResults] = useState<Place[]>([]);
    let timer: ReturnType<typeof setTimeout>

    const search = (q:string)=>{
        clearTimeout(timer);
        if (q.length < 3) return setResults([]);
        timer = setTimeout(async ()=>{
            const res = await fetch(`/api/places?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setResults(data.places);
        },400)
    }

    return  (
        <div className="relative">
            <input
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Thêm địa điểm..."
                onChange={(e) => search(e.target.value)}
            />
            {results.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border rounded-lg mt-1 shadow">
                {results.map((p) => (
                    <li
                    key={p.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => { onPick(p); setResults([]); }}
                    >
                    <div className="font-medium">{p.displayName.text}</div>
                    <div className="text-sm text-gray-500">{p.formattedAddress}</div>
                    </li>
                ))}
                </ul>
            )}
        </div>
    )
}