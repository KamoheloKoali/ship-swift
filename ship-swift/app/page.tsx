// landing page here
import { createClient, getClientById } from "@/actions/clientActions";
// import { createDriver, getDriverById } from "@/actions/driverActions";
import getCurrentUserClerkDetails from "@/app/utils/getCurrentUserDetails";
import { redirect } from "next/navigation";

export default async function Home() {
  return(
    <>
    <div>Home</div>
    </>
  );
}
