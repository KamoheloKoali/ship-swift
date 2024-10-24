import { useState, useEffect } from "react";

const LocationTracker = ({
  updateLocation,
}: {
  updateLocation: (lat: number, lng: number) => void;
}) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation(latitude, longitude);
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

  return error ? <div>Error: {error}</div> : <div>Tracking location...</div>;
};

export default LocationTracker;
