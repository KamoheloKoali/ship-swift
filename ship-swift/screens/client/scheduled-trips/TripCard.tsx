import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type TripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED";

type ScheduledTrip = {
  id: string;
  driverId: string;
  fromLocation: string;
  toLocation: string;
  routeDetails: string;
  tripDate: Date;
  status: TripStatus;
  driver: {
    Id: string;
    name: string;
  };
};

interface TripCardProps {
  trip: ScheduledTrip;
}

const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {trip.fromLocation} to {trip.toLocation}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Trip Date: {trip.tripDate.toLocaleDateString()}</p>
        <p>Driver: {trip.driver.name}</p>
        <p>Route Details: {trip.routeDetails}</p>
      </CardContent>
      <CardFooter>
        <p className="text-gray-500">Status: {trip.status}</p>
      </CardFooter>
    </Card>
  );
};

interface ScheduledTripsPageProps {
  trips: ScheduledTrip[];
}

const ScheduledTripsPage: React.FC<ScheduledTripsPageProps> = ({ trips }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
};

export { TripCard, ScheduledTripsPage, type ScheduledTrip, type TripStatus };