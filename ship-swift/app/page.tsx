import { createClient, getClientById } from "@/actions/clientActions"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const client = await currentUser()
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
