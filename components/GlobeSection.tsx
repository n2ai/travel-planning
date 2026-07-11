'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import type { Destination } from '@/lib/type';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

const Globe = dynamic(() => import('react-globe.gl'), {
    ssr: false,
    loading: () => <p>Loading globe...</p>,
});

const markerSvg = `<svg viewBox="-4 0 36 36">
    <defs>
        <linearGradient id="beachPin" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#2dd4bf"/>
            <stop offset="100%" stop-color="#0e7490"/>
        </linearGradient>
    </defs>
    <path fill="url(#beachPin)" stroke="#ffffff" stroke-width="1.5"
        d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,23.963 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="#fde68a" cx="14" cy="14" r="6"></circle>
</svg>`;

export default function GlobeSection({ destinations }: { destinations: Destination[] }) {
    const router = useRouter();
        const [countries, setCountries] = useState<any[]>([]);

    useEffect(() => {
        fetch('/countries.geojson')
            .then(res => res.json())
            .then(data => setCountries(data.features));
    }, []);

    const oceanMaterial = new THREE.MeshPhongMaterial({ color: '#3b82f6', flatShading: true });
    return (
        <Globe
            // XÓA globeImageUrl
            backgroundColor="rgba(0,0,0,0)"        // nền trong suốt, hòa vào page
            showAtmosphere={true}
            atmosphereColor="#60a5fa"
            globeMaterial={oceanMaterial}  // đại dương
            polygonsData={countries}
            polygonCapColor={() => '#4ade80'}      // mặt trên lục địa — xanh lá
            polygonSideColor={() => '#16a34a'}     // "vách" nhô lên — xanh đậm hơn
            polygonStrokeColor={() => '#16a34a'}
            polygonAltitude={0.008}
            htmlElementsData={destinations}
            htmlElement={(d) => {
                const dest = d as Destination;
                const el = document.createElement('div');
                el.innerHTML = markerSvg;
                el.style.width = '26px';
                el.style.cursor = 'pointer';
                el.style.pointerEvents = 'auto';
                el.title = `${dest.name}, ${dest.country}`;
                el.onclick = () => router.push(`/destinations/${dest.slug}`);
                return el;
            }}
        />
    );
}