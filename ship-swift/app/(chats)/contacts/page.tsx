import AddContactDialog from "@/screens/chat/contacts/AddContactDialog";
import ConversationFallback from "@/screens/chat/conversation/ConversationFallback";
import ItemList from "@/screens/chat/item-list/ItemList";
import React from "react";

type Props = {};

const Page = (props: Props) => {
  return (
    <>
      <ItemList title="Contacts" action={<AddContactDialog />}>Contacts</ItemList>
      <ConversationFallback />
    </>
  );
};

export default Page;
