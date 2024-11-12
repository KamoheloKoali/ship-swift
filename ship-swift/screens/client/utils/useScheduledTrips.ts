import { useEffect, useState } from "react";
import supabase from "@/app/utils/supabase";
import { getScheduledTripsWithDriver } from "@/actions/scheduledTripsActions";

type TripStatus =
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "OTHER_STATUS";

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
    firstName: string;
    lastName: string;
    photoUrl: string;
    vehicleType: string | null;
    isVerified: boolean;
  };
};

export const useScheduledTrips = () => {
  const [trips, setTrips] = useState<ScheduledTrip[]>([]);

  useEffect(() => {
    // Fetch initial data from Prisma
    const fetchTrips = async () => {
      try {
        const tripsData = await getScheduledTripsWithDriver();
        setTrips(tripsData || []);
      } catch (error) {
        console.error("Error loading scheduled trips:", error);
      }
    };

    fetchTrips();

    // Set up real-time subscription with Supabase
    const subscription = supabase
      .channel("scheduled-trips-updates")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "scheduledTrips",
        },
        (payload) => {
          // Handle INSERT event (New trip added)
          setTrips((prevTrips) => [...prevTrips, payload.new as ScheduledTrip]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scheduledTrips",
        },
        (payload) => {
          // Handle UPDATE event (Trip status or details changed)
          setTrips((prevTrips) =>
            prevTrips.map((trip) =>
              trip.id === payload.new.id ? { ...trip, ...payload.new } : trip
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "scheduledTrips",
        },
        (payload) => {
          // Handle DELETE event (Trip deleted)
          setTrips((prevTrips) =>
            prevTrips.filter((trip) => trip.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return trips;
};
