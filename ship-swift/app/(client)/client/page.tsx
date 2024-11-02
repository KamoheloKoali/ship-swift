import { CardDemo } from "@/components/ui/aceternity/animatedCard";
import ImageCard from "@/components/ui/image-card";
import React from "react";
import PackagePopover from "./components/PackagePopover";
import RestrictedPopover from "./components/RestrictedPopover";
import Dashboard from "@/screens/client-dashboard/DashBoard";
import MyJobs from "@/screens/client/dashboard/jobs";

const Page = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <MyJobs />
    </div>
  );
};

export default Page;
