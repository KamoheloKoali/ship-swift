"use client";
import { useState } from "react";
import { useScheduledTrips } from "@/screens/client/utils/useScheduledTrips"; // Import the custom hook
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Import Avatar from ShadCN
import { Card, CardHeader, CardFooter } from "@/components/ui/card"; // ShadCN Card components

type Driver = {
  firstName: string;
  lastName: string;
  photoUrl: string | null; // photoUrl can be null if no photo is available
  vehicleType: string | null;
  isVerified: boolean;
};

type Trip = {
  id: string;
  fromLocation: string;
  toLocation: string;
  tripDate: string;
  status: string;
  driver: Driver;
  routeDetails: string;
};

const TripCard = () => {
  const trips = useScheduledTrips(); // Use the hook to get the trips
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const handleTripClick = (trip: Trip) => {
    // Handle click on a trip to show detailed view
    setSelectedTrip(trip);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Scheduled Trips
      </h2>

      {trips.length === 0 ? (
        <p className="text-center text-lg text-gray-500">No scheduled trips available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card
              key={trip.id}
              className="transition-all duration-300 transform hover:scale-105 shadow-xl rounded-lg border border-gray-300"
            >
              <CardHeader className="p-4 bg-gray-800 text-white rounded-t-lg">
                <h3 className="text-xl font-semibold">
                  {trip.fromLocation} to {trip.toLocation}
                </h3>
                <p className="text-sm">
                  {new Date(trip.tripDate).toLocaleDateString()}
                </p>
              </CardHeader>

              <div className="p-4 text-gray-800">
                <p className="text-md mb-2 font-medium">Status: {trip.status}</p>
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={trip.driver.photoUrl || undefined}
                      alt={`${trip.driver.firstName} ${trip.driver.lastName}`}
                    />
                    <AvatarFallback>
                      {`${trip.driver.firstName[0]}${trip.driver.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {trip.driver.firstName} {trip.driver.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {trip.driver.vehicleType || "No vehicle type specified"}
                    </p>
                    <p className="text-sm">
                      {trip.driver.isVerified ? "Verified" : "Not Verified"}
                    </p>
                  </div>
                </div>
              </div>

              <CardFooter className="p-4 bg-gray-100 rounded-b-lg text-right">
                <button
                  onClick={() => handleTripClick({ ...trip, tripDate: trip.tripDate.toISOString() })}
                  className="text-blue-600 hover:text-blue-800 focus:outline-none"
                >
                  View Details
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Show detailed trip information if selected */}
      {selectedTrip && (
        <div className="mt-6 max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Trip Details</h3>
          <p className="text-lg">From: {selectedTrip.fromLocation}</p>
          <p className="text-lg">To: {selectedTrip.toLocation}</p>
          <p className="text-lg">Route: {selectedTrip.routeDetails}</p>
          <p className="text-lg">
            Scheduled for: {new Date(selectedTrip.tripDate).toLocaleString()}
          </p>
          <p className="text-lg">Status: {selectedTrip.status}</p>
          <div className="mt-4">
            <h4 className="text-xl font-semibold text-gray-800">Driver Info</h4>
            <p className="text-lg">
              {selectedTrip.driver.firstName} {selectedTrip.driver.lastName}
            </p>
            <p className="text-lg">
              Vehicle Type: {selectedTrip.driver.vehicleType || "N/A"}
            </p>
            <p className="text-lg">
              {selectedTrip.driver.isVerified ? "Verified" : "Not Verified"}
            </p>
            <Avatar className="mt-4">
              <AvatarImage
                src={selectedTrip.driver.photoUrl || undefined}
                alt={`${selectedTrip.driver.firstName} ${selectedTrip.driver.lastName}`}
              />
              <AvatarFallback>
                {`${selectedTrip.driver.firstName[0]}${selectedTrip.driver.lastName[0]}`}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripCard;
