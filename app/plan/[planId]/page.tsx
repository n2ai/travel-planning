import TripMap from "./trip-map";

export default async function PlanPage({
    params
}:{
    params: Promise<{planId:string}>
}){
    const { planId } = await params

    return (
    <div className="grid grid-cols-[220px_1fr_45%] h-screen">
      {/* Sidebar trái */}
      <aside className="border-r border-gray-200 p-4 overflow-y-auto">
        <nav className="flex flex-col gap-3 text-sm">
          <span className="font-semibold">Overview</span>
          <span className="text-gray-500 pl-3">Explore</span>
          <span className="text-gray-500 pl-3">Notes</span>
          <span className="text-gray-500 pl-3">Places to visit</span>
          <span className="font-semibold mt-2">Itinerary</span>
          <span className="font-semibold mt-2">Budget</span>
        </nav>
      </aside>

      {/* Cột giữa — nội dung trip, scroll riêng */}
      <main className="overflow-y-auto p-6">
        {/* <h1 className="text-3xl font-bold">Trip to Hong Kong</h1>
        <p className="text-gray-500 mt-2">Trip ID: {planId}</p> */}
        {/* Sau này: danh sách địa điểm, itinerary... */}
        
      </main>

      {/* Map bên phải — đứng yên, không scroll theo */}
      <div className="h-screen">
        <TripMap />
      </div>
    </div>
  );
} 