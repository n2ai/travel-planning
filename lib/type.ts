export type Interest = "food" | "culture" | "nature" | "shopping";
export type Pace = "relaxed" | "medium" | "packed";

export type Destination = {
    id: string
    name: string
    slug: string
    country: string
    region: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania'
    description: string | null
    lat: number
    lng: number
    google_place_id: string | null
    image_url: string | null 
    tags: string[]
    featured: boolean
    created_at: string
}

export type GenerateInput = {
    cityPlaceId:string
    startDate:string 
    endDate:string 
    hotel: { lat:number, lng:number}
    interests: Interest[]
    pace: Pace
    budgetCents?: number
}

export type Candidate = {
    placeId:string
    name:string
    lat:number 
    lng:number 
    rating:number | null 
    priceLevel: number | null
    interest:Interest | "meal"
}
