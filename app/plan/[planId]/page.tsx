import TripMap from "./trip-map";

export default async function PlanPage({params}:{params: Promise<{planId:string}>}){
    const { planId } = await params;

    return(
        <div style={{height:'100vh'}}>
            <TripMap/>
        </div>
    )

}