'use client'
import { useState } from "react";
import PlaceSearch from "./place-search";
import TripMap from "./trip-map";

export type PickedPlace = {
    id:string,
    name:string,
    address:string,
    lat:number,
    lng:number
}

export default function TripPlanner({planId}:{planId:string}){
    const [places, setPlaces] = useState<PickedPlace[]>([]);

    const handlePick = (p:{
        id:string,
        displayName:{text:string},
        formattedAddress: string,
        location:{latitude:number, longitude:number}
    })=>{
        const place: PickedPlace = {
            id: p.id,
            name: p.displayName.text,
            address: p.formattedAddress,
            lat: p.location.latitude,
            lng: p.location.longitude
        }

        setPlaces((prev) =>
            prev.some((x) => x.id === place.id) ? prev : [...prev, place]
        );
    }

    return (
        <div className="grid grid-cols-[220px_1fr_45%] h-screen">
        <aside className="border-r border-gray-200 p-4 overflow-y-auto">
            {/* nav như cũ */}
        </aside>

        <main className="overflow-y-auto p-6">
            <h1 className="text-3xl font-bold">Trip to Hong Kong</h1>
            <div className="mt-4">
            <PlaceSearch onPick={handlePick} />
            </div>

            {/* danh sách địa điểm đã thêm */}
            <ul className="mt-6 flex flex-col gap-3">
            {places.map((p, i) => (
                <li key={p.id} className="border rounded-lg p-3">
                <div className="font-medium">{i + 1}. {p.name}</div>
                <div className="text-sm text-gray-500">{p.address}</div>
                </li>
            ))}
            </ul>
        </main>

        <div className="h-screen">
            <TripMap places={places} />
        </div>
        </div>
    );
}