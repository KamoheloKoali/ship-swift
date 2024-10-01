import { TooltipProvider } from "@/components/ui/tooltip";
import { Metadata } from "next";
import React from "react";

type Props = React.PropsWithChildren<{}>;

export const metadata: Metadata = {
  title: "Ship Swift | Contacts",
  description: "Courier Freelancing",
};

const Layout = ({ children }: Props) => {
  return <TooltipProvider>{children}</TooltipProvider>;
};

export default Layout;
