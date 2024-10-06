import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const CardStatus = () => {
  return (
    <div className="w-full py-4 mylg:p-4">
      <Card className="relative w-full md:w-full md:max-w-md md:mx-auto border-none bg-muted/80 mylg:bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col mylg:flex-row mylg:items-center mylg:justify-between gap-4">
          {/* Switch with Label */}
          <div className="flex items-center gap-2">
            <Switch id="availability" />
            <label htmlFor="availability" className="text-sm font-medium">
              Available
            </label>
          </div>
          {/* Button for Trip Announcement */}
          <Button variant="default" className="w-full">
            Announce Scheduled Trip
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardStatus;
