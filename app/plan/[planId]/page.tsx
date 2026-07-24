import TripPlanner from './trip-planner';

export default async function PlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  console.log(planId)
  return <TripPlanner planId={planId} />;
}