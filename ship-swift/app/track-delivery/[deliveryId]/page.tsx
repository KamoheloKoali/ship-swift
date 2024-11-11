"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useMap } from "react-leaflet"; // Import the useMap hook directly
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth } from "@clerk/nextjs";
import { getClientById } from "@/actions/clientActions";
import { getLocation } from "@/actions/locationAction";
import { getJobRequestById } from "@/actions/jobRequestActions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import supabase from "@/app/utils/supabase";

// Dynamically import components (only those depending on DOM)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import("react-leaflet").then((mod) => mod.Circle),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

// Fix for marker icon default issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Function to set the map view to the user's location
const SetViewToLocation = ({ position }: { position: [number, number] }) => {
  const map = useMap(); // Correctly use useMap inside the component
  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Adjust the zoom level to fit the user's location
    }
  }, [position, map]);
  return null;
};

export default function LocationPage({
  params,
}: {
  params: { deliveryId: string };
}) {
  const [position, setPosition] = useState<[number, number] | null>(null); // Correct type for position (latitude, longitude)
  const [accuracy, setAccuracy] = useState<number | null>(null); // Accuracy is a number in meters
  const [isClient, setIsClient] = useState(false);
  const [isWindow, setIsWindow] = useState(false);
  const { userId } = useAuth();

  useEffect(() => {
    const checkIsAuthorized = async () => {
      // remember to check if driverid or clientid is equal to current userid
      const response = await getClientById(userId || "");
      if (response.success) {
        setIsClient(true);
      } else {
        setIsClient(false);
      }
    };
    checkIsAuthorized();
    setIsWindow(typeof window !== "undefined");
  }, []);

  useEffect(() => {
    const setupLocationTracking = async () => {
      try {
        const job = await getJobRequestById(params.deliveryId);

        if (!job?.Id || !job.driverId) {
          toast({
            description: "Could not find delivery job information",
            variant: "destructive",
          });
          return;
        }

        // Get initial location using existing getLocation function
        const response = await getLocation(job.driverId);

        if (!response.success) {
          toast({
            description: response.error,
            variant: "destructive",
          });
          return;
        }

        const latestLocation = response.data?.latest;

        if (latestLocation) {
          setAccuracy(latestLocation.accuracy);
          if (latestLocation.accuracy <= 500) {
            setPosition([latestLocation.latitude, latestLocation.longitude]);
          } else {
            console.warn("Poor accuracy:", latestLocation.accuracy);
            toast({
              description: `Location accuracy is low: ${latestLocation.accuracy} meters`,
              variant: "destructive",
            });
          }
        }

        // Subscribe to realtime updates
        const subscription = supabase
          .channel("location-updates")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "Location",
              filter: `driverId=eq.${job.driverId}`,
            },
            (payload) => {
              const newLocation = payload.new;
              setAccuracy(newLocation.accuracy);

              if (newLocation.accuracy <= 500) {
                setPosition([newLocation.latitude, newLocation.longitude]);
              } else {
                console.warn("Poor accuracy:", newLocation.accuracy);
                toast({
                  description: `Location accuracy is low: ${newLocation.accuracy} meters`,
                  variant: "destructive",
                });
              }
            }
          )
          .subscribe();

        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error setting up location tracking:", error);
        toast({
          description: "Error setting up location tracking",
          variant: "destructive",
        });
      }
    };

    setupLocationTracking();
  }, [params.deliveryId]);

  if (accuracy && accuracy > 500) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        Low Accuracy: {accuracy} meters
      </div>
    );
  }

  if (!isClient || !position) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
        Getting courier's location...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      {position && (
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          className="h-screen w-screen"
        >
          {/* TileLayer from OpenStreetMap */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Marker for user's location */}
          <Marker position={position} />

          {/* Circle depicting accuracy */}
          {accuracy && (
            <Circle center={position} radius={accuracy} color="blue" />
          )}

          {/* Update the map's view to the user's location */}
          <SetViewToLocation position={position} />
        </MapContainer>
      )}
    </div>
  );
}
