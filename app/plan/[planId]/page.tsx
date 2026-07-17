import TripPlanner from './trip-planner';

export default async function PlanPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = await params;
  return <TripPlanner planId={planId} />;
}