import {getAllDestinations} from "@/lib/queries/destination";
import {getDestinationBySlug} from "@/lib/queries/destination";

export default async function Home() {
  const destinations = await getAllDestinations();
  const tokyoDestination = await getDestinationBySlug('tokyo-japan');
  const fakeDestination = await getDestinationBySlug('fake-destination');

  console.log('Total:', destinations?.length)
  console.log('Tokyo:', tokyoDestination?.name, tokyoDestination?.lat, tokyoDestination?.lng)
  console.log('Fake:', fakeDestination)

  return <main>Travel App</main>
}