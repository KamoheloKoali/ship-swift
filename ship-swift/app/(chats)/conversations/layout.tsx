import ItemList from "@/screens/chat/item-list/ItemList";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return (
    <>
      <ItemList title="Conversations">Conversations</ItemList>
      {children}
    </>
  );
};

export default ConversationsLayout;
