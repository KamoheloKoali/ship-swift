import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import TripForm from "./TripForm";
import { createScheduledTrip } from "@/actions/scheduledTripsActions";
import ScheduledTrips from "./TripCard";
import { useUser } from "@clerk/nextjs";

interface TripFormData {
  fromLocation: string;
  toLocation: string;
  routeDetails: string;
  tripDate: string;
}
const CardStatus = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  const handleSubmit = async (formData: TripFormData) => {
    try {
      setIsLoading(true);
      const tripDate = new Date(formData.tripDate).toISOString();

      await createScheduledTrip({
        ...formData,
        tripDate,
        driver: {
          connect: {
            Id: user?.id || "",
          },
        },
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full mylg:mb-1 mylg:px-4 mylg:pt-4">
      <Card className="relative w-full md:w-full md:max-w-md md:mx-auto mylg:w-full sm:bg-muted/80 md:bg-gradient-to-r from-primary-foreground/60 to-primary-foreground/95 mylg:bg-gradient-to-left from-white to-white">
        <CardContent className="flex items-center justify-center p-4 mylg:mb-1">
          <Button
            variant="default"
            className="w-[100%] mylg:w-[60%] buttonScreen:w-full"
            onClick={() => setIsDialogOpen(true)}
          >
            Announce Scheduled Trip
          </Button>

          <TripForm
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
      <div className="sm:block md:hidden mylg:block mylg:mt-1 mylg:h-[225px] mylg:overflow-y-auto mylg:no-scrollbar">
        <ScheduledTrips />
      </div>
    </div>
  );
};

export default CardStatus;
