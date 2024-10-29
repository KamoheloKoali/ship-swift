// landing page here
import { createClient, getClientById } from "@/actions/clientActions";
// import { createDriver, getDriverById } from "@/actions/driverActions";
import getCurrentUserClerkDetails from "@/app/utils/getCurrentUserDetails";
import { redirect } from "next/navigation";

export default async function Home() {
  const client = await getCurrentUserClerkDetails();
  const dbClient = await getClientById(client?.id || "");

  if (!dbClient.success) {
    const clientData = {
      clerkId: client?.id || "",
      email: client?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: client?.phoneNumbers?.[0]?.phoneNumber || "", // Assuming phoneNumbers is an array
      firstName: client?.firstName || "",
      lastName: client?.lastName || "",
      photoUrl: client?.imageUrl || "",
      idPhotoUrl: "", // Assuming you will fetch or add the actual value later
    };

    await createClient(clientData);
  }

  // const Driver = await getCurrentUserClerkDetails()
  //   const dbDriver = await getDriverById(Driver?.id || "")

  //   if (!dbDriver.success) {

  //   const DriverData = {
  //     clerkId: Driver?.id || "",
  //     email: Driver?.emailAddresses[0].emailAddress || "",
  //     phoneNumber: Driver?.phoneNumbers?.[0]?.phoneNumber || "", // Assuming phoneNumbers is an array
  //     firstName: Driver?.firstName || "",
  //     lastName: Driver?.lastName || "",
  //     photoUrl: Driver?.imageUrl || "",
  //     idPhotoUrl: "", // Assuming you will fetch or add the actual value later
  //     vehicleType: "",
  //     vehicleDetails: [""],
  //   }

  //   await createDriver(DriverData)
  // }
  if (!dbClient.success) {
    const clientData = {
      clerkId: client?.id || "",
      email: client?.emailAddresses[0]?.emailAddress || "",
      phoneNumber: client?.phoneNumbers?.[0]?.phoneNumber || "", // Assuming phoneNumbers is an array
      firstName: client?.firstName || "",
      lastName: client?.lastName || "",
      photoUrl: client?.imageUrl || "",
      idPhotoUrl: "", // Assuming you will fetch or add the actual value later
    };

    await createClient(clientData);
  }

  // const Driver = await getCurrentUserClerkDetails();
  // const dbDriver = await getDriverByID(Driver?.id || "");

  // if (!dbDriver) {
  //   const DriverData = {
  //     clerkId: Driver?.id || "",
  //     email: Driver?.emailAddresses[0].emailAddress || "",
  //     phoneNumber: Driver?.phoneNumbers?.[0]?.phoneNumber || "", // Assuming phoneNumbers is an array
  //     firstName: Driver?.firstName || "",
  //     lastName: Driver?.lastName || "",
  //     photoUrl: Driver?.imageUrl || "",
  //     idPhotoUrl: "", // Assuming you will fetch or add the actual value later
  //     vehicleType: "",
  //     vehicleDetails: [""],
  //   };

  //   await createDriver(DriverData);
  // }

  // return redirect("/conversations");
  return null;
}
