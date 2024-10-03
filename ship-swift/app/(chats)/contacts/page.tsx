import { getDriverById } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import ClientAddDriver from "@/screens/chat/contacts/ClientAddDriverDialog";
import DriverAddClient from "@/screens/chat/contacts/DriverAddClientDialog";
import ListOfContacts from "@/screens/chat/contacts/ListOfContacts";
import ConversationFallback from "@/screens/chat/conversation/ConversationFallback";
import ItemList from "@/screens/chat/item-list/ItemList";
import { Loader2 } from "lucide-react";
import React from "react";

type Props = {};

const Page = async (props: Props) => {
  const userRole = await getUserRoleById();
  const listOfContacts = await ListOfContacts();
  const incomingRequests = listOfContacts.incomingRequests;
  const outgoingRequests = listOfContacts.outgoingRequests;
  let incomingRequestsWithNames

  // Fetch the driver's full name for each incoming request
  if (incomingRequests.length > 0){
  incomingRequestsWithNames = await Promise.all(
    incomingRequests.map(async (request: any) => {
      const driverData = await getDriverById(request.senderId);  // Fetch driver by senderId
      const fullName = driverData.success ? `${driverData.data?.firstName} ${driverData.data?.lastName}` : "Unknown Driver";
      return {
        ...request,
        fullName,  // Add fullName to the request
      };
    })
  );}

  return (
    <>
      <ItemList
        title="Contacts"
        action={
          userRole.data?.client ? <ClientAddDriver /> : <DriverAddClient />
        }
      >
        <div>
          <div>
            <p>Contacts</p>
            {incomingRequestsWithNames ? (
              incomingRequestsWithNames.length === 0 ? (
                <p className="h-full w-full flex items-center justify-center">
                  No Contacts
                </p>
              ) : (
                // Rendering the incoming requests with full names
                <div>
                  {incomingRequestsWithNames.map((request: any) => (
                    <div key={request.Id} className="border-b py-2">
                      <p className="font-semibold">
                        {`Request from: ${request.fullName}`}
                      </p>
                      <p>{request.message}</p>
                      <p>Status: {request.isAccepted ? "Accepted" : request.isPending ? "Pending" : "Rejected"}</p>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <><Loader2 className="h-8 w-8" /></>
            )}
          </div>
        </div>
      </ItemList>
      <ConversationFallback />
    </>
  );
};

export default Page;
