import { NextResponse } from "next/server";
import { getPlace } from "@/lib/places";

export async function GET(_req:Request,{params}:{params:Promise<{placeId:string}>}){
    const { placeId } = await params;

    try{
        const p = await getPlace(placeId);
        return NextResponse.json({
            placeId: p.google_place_id,
            name: p.name,
            address: p.formatted_address,
            lat: p.lat,
            lng: p.lng,
        });

    }catch(e){
        console.error(e);
        return NextResponse.json({error:String(e)}, {status:500});
    }
}