import { CardDemo } from "@/components/ui/aceternity/animatedCard";
import ImageCard from "@/components/ui/image-card";
import React from "react";
import PackagePopover from "./components/PackagePopover";
import RestrictedPopover from "./components/RestrictedPopover";

const Page = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full">
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Create A New Order"
          description="Deliver"
          href="/client/dashboard/deliver"
        />
        <PackagePopover />
        <RestrictedPopover />
      </div>
    </div>
  );
};

export default Page;
