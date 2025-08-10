"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";

interface MapProps {
  initialLatitude: string;
  initialLongitude: string;
  onLocationChange: (lat: string, lng: string) => void;
}

export default function Map({
  initialLatitude,
  initialLongitude,
  onLocationChange,
}: MapProps) {
  const [position, setPosition] = useState<[number, number]>([
    parseFloat(initialLatitude),
    parseFloat(initialLongitude),
  ]);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    setPosition([parseFloat(initialLatitude), parseFloat(initialLongitude)]);
  }, [initialLatitude, initialLongitude]);

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationChange(e.latlng.lat.toString(), e.latlng.lng.toString());
      },
    });

    return position ? (
      <Marker
        position={position}
        icon={L.icon({
          iconUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })}
      />
    ) : null;
  }

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
    </MapContainer>
  );
}