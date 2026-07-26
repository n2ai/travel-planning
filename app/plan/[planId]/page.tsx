import TripPlanner from './trip-planner';
import { getPlace } from '@/lib/places';
import { notFound } from 'next/navigation';
import type { PlaceRow } from '@/lib/places';

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>;
  searchParams: Promise<{ startDate?:string; endDate?:string}>
}) {
  const { planId } = await params;
  const {startDate, endDate} = await searchParams;

  let place:PlaceRow;
  try{
    place = await getPlace(planId);
  }catch(error){
    console.error(error)
    notFound();
  }
  console.log(planId)
  return <TripPlanner place={place} />;
}