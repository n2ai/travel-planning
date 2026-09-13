import {createClient} from "@/lib/supabase/server";
import {redirect} from "next/navigation";
import LandingPage from "./landingPage";

export default async function Home() {
  const supabase = await createClient();
  const {data:user} = await supabase.auth.getUser();

  if(user) redirect("/home");

  return <LandingPage />;
}