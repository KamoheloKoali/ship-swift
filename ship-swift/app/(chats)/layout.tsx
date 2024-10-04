import { TooltipProvider } from "@/components/ui/tooltip";
import SideBarWrapper from "@/screens/chat/sidebar/SideBarWrapper";
import { Metadata } from "next";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export const metadata: Metadata = {
  title: "Ship Swift | Contacts",
  description: "Courier Freelancing",
};

const Layout = ({ children }: Props) => {
  return (
    <TooltipProvider>
      <SideBarWrapper>{children}</SideBarWrapper>
    </TooltipProvider>
  );
};

export default Layout;
