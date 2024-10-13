import { getClientById } from "@/actions/clientActions";
import { getAllcontacts } from "@/actions/contactsActions";
import { getDriverById } from "@/actions/driverActions";
import { getUserRoleById } from "@/app/utils/getUserRole";
import ListContacts from "@/screens/chat/conversation/ListContacts";
import ItemList from "@/screens/chat/item-list/ItemList";
import { currentUser } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = async ({ children }: Props) => {
  try {
    const user = await currentUser();
    const userRole = await getUserRoleById();
    const role = userRole.data?.client;
    let contacts: any = [];
    let contactsWithNames;
    const allContacts = await getAllcontacts();
    allContacts.data?.map((contact) => {
      if (contact.clientId === user?.id || contact.driverId === user?.id) {
        contacts.push(contact);
      }
    });

    if (userRole.data?.client) {
      if (Array.isArray(contacts) && contacts.length > 0) {
        contactsWithNames = await Promise.all(
          contacts.map(async (request: any) => {
            const driverData = await getDriverById(request.driverId); // Fetch driver by senderId
            const fullName = driverData.success
              ? `${driverData.data?.firstName} ${driverData.data?.lastName}`
              : "Unknown Driver";
            const photoUrl = driverData.data?.photoUrl;
            return {
              ...request,
              fullName, // Add fullName to the request
              photoUrl,
            };
          })
        );
      }
    } else {
      if (Array.isArray(contacts) && contacts.length > 0) {
        contactsWithNames = await Promise.all(
          contacts.map(async (request: any) => {
            const clientData = await getClientById(request.sclientId); // Fetch client by senderId
            const fullName = clientData.success
              ? `${clientData.data?.firstName} ${clientData.data?.lastName}`
              : "Unknown Client";
            const photoUrl = clientData.data?.photoUrl;
            return {
              ...request,
              fullName, // Add fullName to the request
              photoUrl,
            };
          })
        );
      }
    }

    return (
      <>
        <ItemList title="Conversations">
          {contacts === null || role === null ? (
            <div className="w-full flex h-screen justify-center items-center">
              {" "}
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ListContacts Contacts={contactsWithNames} role={role ?? false} />
          )}
        </ItemList>
        {children}
      </>
    );
  } catch (error) {
    <div className="flex justify-center items-center w-full">
      An unexpected error occured
    </div>;
  }
};

export default ConversationsLayout;
