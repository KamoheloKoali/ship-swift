import { createClient, getClientById } from "@/actions/clientActions"
import getCurrentUserClerkDetails from "@/actions/getCurrentUserDetails"
import { redirect } from "next/navigation"

export default async function Home() {
  const client = await getCurrentUserClerkDetails()
  const dbClient = await getClientById(client?.id || "")

  if (!dbClient) {

  const clientData = {
    clerkId: client?.id || "",
    email: client?.emailAddresses[0]?.emailAddress || "",
    phoneNumber: client?.phoneNumbers?.[0]?.phoneNumber || "", // Assuming phoneNumbers is an array
    firstName: client?.firstName || "",
    lastName: client?.lastName || "",
    photoUrl: client?.imageUrl || "",
    idPhotoUrl: "", // Assuming you will fetch or add the actual value later
  }

  await createClient(clientData)
}

  return redirect("/conversations")
}
