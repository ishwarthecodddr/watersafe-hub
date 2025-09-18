import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ReportDTO } from '@/lib/api';

// Fix default icon paths for Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import type { LatLngTuple } from 'leaflet';

L.Icon.Default.mergeOptions({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
});

type Props = {
  reports: ReportDTO[];
};

function parseCoordinates(input?: string | null): { lat: number; lng: number } | null {
  if (!input) return null;
  const raw = input.trim();
  // Try simple "lat, lng"
  const simpleMatch = raw.match(/^\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*$/);
  if (simpleMatch) {
    return { lat: parseFloat(simpleMatch[1]), lng: parseFloat(simpleMatch[2]) };
  }
  // Try formats with N/S/E/W and degree symbols
  const cardMatch = raw.match(/([\d.]+)\s*°?\s*([NnSs])\s*,\s*([\d.]+)\s*°?\s*([EeWw])/);
  if (cardMatch) {
    let lat = parseFloat(cardMatch[1]);
    let lng = parseFloat(cardMatch[3]);
    const ns = cardMatch[2].toUpperCase();
    const ew = cardMatch[4].toUpperCase();
    if (ns === 'S') lat = -lat;
    if (ew === 'W') lng = -lng;
    return { lat, lng };
  }
  return null;
}

export function MapView({ reports }: Props) {
  const points = useMemo(() => {
    return reports
      .map((r) => ({
        id: r.id,
        code: r.reportCode,
        location: r.location,
        description: r.description,
        coords: parseCoordinates(r.coordinates ?? undefined),
        status: r.status,
        priority: r.priority,
      }))
      .filter((p) => p.coords !== null);
  }, [reports]);


  const center: LatLngTuple = points.length > 0
    ? [points[0].coords!.lat, points[0].coords!.lng]
    : [25.2, 89.3];

  return (
    <MapContainer center={center} zoom={10} scrollWheelZoom={false} className="h-96 rounded-lg overflow-hidden">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {points.map((p) => (
        <Marker key={p.id} position={[p.coords!.lat, p.coords!.lng]}>
          <Popup>
            <div className="space-y-1">
              <div className="font-semibold">{p.location}</div>
              <div className="text-xs">{p.description}</div>
              <div className="text-xs">Code: {p.code}</div>
              <div className="text-xs">Status: {p.status.toLowerCase()} | Priority: {p.priority.toLowerCase()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;
