import SideBarWrapper from "@/screens/chat/sidebar/SideBarWrapper";
import React from "react";

type Props = React.PropsWithChildren<{}>;

const ConversationsLayout = ({ children }: Props) => {
  return <SideBarWrapper>{children}</SideBarWrapper>;
};

export default ConversationsLayout;
