'use client'
import { APIProvider, Map } from "@vis.gl/react-google-maps"

export default function TripMap() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <Map
        style={{ width: '100%', height: '100%' }}
        defaultCenter={{ lat: 22.3193, lng: 114.1694 }}
        defaultZoom={11}
        gestureHandling="greedy"
        disableDefaultUI={false}
      />
    </APIProvider>
  );
}