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