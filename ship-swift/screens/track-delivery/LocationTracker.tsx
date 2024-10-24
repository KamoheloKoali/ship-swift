import { useState, useEffect } from "react";

const LocationTracker = ({
  updateLocation,
}: {
  updateLocation: (lat: number, lng: number, accuracy: number) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          updateLocation(latitude, longitude, accuracy);
        },
        (err) => {
          setError(err.message);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 30000,
          timeout: 27000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, [updateLocation]);

  return error ? (
    <div>Error: {error}</div>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="50"
      height="50"
      viewBox="0 0 24 24"
      className="animate-pulse"
    >
      <circle cx="12" cy="12" r="4" opacity=".35"></circle>
    </svg>
  );
};

export default LocationTracker;
