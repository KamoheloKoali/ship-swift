import React from "react";
import {
  ScheduledTripsPage,
  ScheduledTrip,
} from "@/screens/client/scheduled-trips/TripCard";

const sampleTrips: ScheduledTrip[] = [
  {
    id: "1",
    driverId: "123",
    fromLocation: "New York",
    toLocation: "Los Angeles",
    routeDetails: "Interstate 80",
    tripDate: new Date("2023-06-01"),
    status: "SCHEDULED",
    driver: {
      Id: "123",
      name: "John Doe",
    },
  },
  {
    id: "1",
    driverId: "123",
    fromLocation: "New York",
    toLocation: "Los Angeles",
    routeDetails: "Interstate 80",
    tripDate: new Date("2023-06-01"),
    status: "SCHEDULED",
    driver: {
      Id: "123",
      name: "John Doe",
    },
  },
  {
    id: "2",
    driverId: "123",
    fromLocation: "New York",
    toLocation: "Los Angeles",
    routeDetails: "Interstate 80",
    tripDate: new Date("2023-06-01"),
    status: "SCHEDULED",
    driver: {
      Id: "123",
      name: "John Doe",
    },
  },
  {
    id: "3",
    driverId: "123",
    fromLocation: "New York",
    toLocation: "Los Angeles",
    routeDetails: "Interstate 80",
    tripDate: new Date("2023-06-01"),
    status: "SCHEDULED",
    driver: {
      Id: "123",
      name: "John Doe",
    },
  },
];

const Page = () => {
  return (
    <div className="flex items-center justify-center px-4">
      <ScheduledTripsPage trips={sampleTrips} />
    </div>
  );
};

export default Page;
