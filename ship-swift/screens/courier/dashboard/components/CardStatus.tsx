import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const CardStatus = () => {
  return (
    <div className="px-4">
      <Card className="w-full max-w-sm mx-auto border-none bg-muted/80">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Status</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-start">
          {/* Switch with Label */}
          <div className="flex items-center gap-2">
            <Switch id="availability" />
            <label htmlFor="availability" className="text-sm font-medium">
              Available
            </label>
          </div>

          {/* Button for Trip Announcement */}
          <Button variant="default">Announce Scheduled Trip</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CardStatus;
