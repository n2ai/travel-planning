// app/plan/[planId]/trip-map.tsx
'use client';
import { APIProvider, Map, AdvancedMarker, Pin, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';
import type { PickedPlace } from './trip-planner';

function PanToLatest({ places }: { places: PickedPlace[] }) {
  const map = useMap();
  useEffect(() => {
    if (!map || places.length === 0) return;
    const last = places[places.length - 1];
    map.panTo({ lat: last.lat, lng: last.lng }); // bay tới điểm mới thêm
  }, [places, map]);
  return null;
}

export default function TripMap({ places }: { places: PickedPlace[] }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 22.3193, lng: 114.1694 }}
        defaultZoom={11}
        mapId="TRIP_MAP" // BẮT BUỘC để dùng AdvancedMarker
        gestureHandling="greedy"
      >
        {places.map((p, i) => (
          <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }}>
            <Pin background="#ea4335" glyphColor="#fff">
              {/* số thứ tự trong pin, giống Wanderlog */}
            </Pin>
          </AdvancedMarker>
        ))}
        <PanToLatest places={places} />
      </Map>
    </APIProvider>
  );
}