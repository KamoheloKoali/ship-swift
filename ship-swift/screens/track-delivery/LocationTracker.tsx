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
          timeout: 60000,
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
    <div className="relative flex justify-center items-center">
      {/* SVG Icon  */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        className="relative"
      >
        <circle
          cx="12.1"
          cy="12.1"
          r="1"
          fill="none"
          stroke="#33d17a"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>

      {/* Ping Effect  */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        className="absolute animate-ping"
      >
        <circle
          cx="12.1"
          cy="12.1"
          r="4"
          fill="none"
          stroke="#33d17a"
          opacity="0.5"
          stroke-width="2"
        />
      </svg>
    </div>
  );
};

export default LocationTracker;
