import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// @ts-ignore - no types packaged
import type { ReportDTO } from '@/lib/api';

// Configure default marker icons (Vite asset handling)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

function parseCoordinates(raw?: string | null): [number, number] | null {
  if (!raw) return null;
  // Normalize: remove degree symbol, spaces around commas
  const cleaned = raw.replace(/°/g, '').replace(/\s+/g, ' ').trim();
  const parts = cleaned.split(',').map(p => p.trim());
  if (parts.length !== 2) return null;

  const parsePart = (part: string): number | null => {
    // Matches: 25.2N, -12.5S, 89.3, 89.3E etc
    const m = part.match(/^(-?\d+(?:\.\d+)?)([NnSsEeWw])?$/);
    if (!m) return null;
    let val = parseFloat(m[1]);
    const dir = m[2]?.toUpperCase();
    if (dir === 'S' || dir === 'W') val = -val;
    return isNaN(val) ? null : val;
  };

  const lat = parsePart(parts[0]);
  const lng = parsePart(parts[1]);
  if (lat == null || lng == null) return null;
  // Basic sanity bounds
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lat, lng];
}

interface HeatLayerProps { points: [number, number, number][]; active: boolean; }
const HeatLayer: React.FC<HeatLayerProps> = ({ points, active }) => {
  const map = useMap();
  useEffect(() => {
    if (!active) return;
    // @ts-ignore - plugin added to L namespace
    const heat = (L as any).heatLayer(points, { radius: 28, blur: 22, minOpacity: 0.25 });
    heat.addTo(map);
    return () => { map.removeLayer(heat); };
  }, [points, active, map]);
  return null;
};

export interface MapViewProps {
  reports: ReportDTO[];
  showHeat?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ reports, showHeat = false }) => {
  const coords = reports
    .map(r => parseCoordinates(r.coordinates))
    .filter((c): c is [number, number] => Array.isArray(c));

  const center: [number, number] = coords[0] || [20.5937, 78.9629]; // India fallback

  const heatPoints: [number, number, number][] = reports
    .map(r => {
      const c = parseCoordinates(r.coordinates);
      if (!c) return null;
      let weight = 1;
      switch (r.priority) {
        case 'CRITICAL': weight = 5; break;
        case 'HIGH': weight = 3; break;
        case 'MEDIUM': weight = 2; break;
      }
      if (r.status === 'RESOLVED') weight *= 0.5;
      return [c[0], c[1], weight];
    })
    .filter((v): v is [number, number, number] => !!v);

  return (
    <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {showHeat && <HeatLayer points={heatPoints} active={showHeat} />}
      {reports.map(r => {
        const c = parseCoordinates(r.coordinates);
        if (!c) return null;
        // Priority-based color mapping -> aligns with legend (safe/moderate/unsafe)
        const color = (() => {
          switch (r.priority) {
            case 'CRITICAL': return '#dc2626'; // red-600 (Unsafe)
            case 'HIGH': return '#f97316'; // orange-500 (Moderate/High risk)
            case 'MEDIUM': return '#eab308'; // yellow-500 (Moderate)
            case 'LOW': return '#16a34a'; // green-600 (Safe)
            default: return '#2563eb'; // blue-600 fallback
          }
        })();
        return (
          <CircleMarker
            key={r.id}
            center={c}
            radius={8}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 2 }}
          >
            <Popup>
              <div className='space-y-1'>
                <div className='font-semibold text-sm'>{r.location}</div>
                <div className='text-xs'>{r.description}</div>
                <div className='text-xs'>Priority: {r.priority}</div>
                <div className='text-xs'>Status: {r.status}</div>
                <div className='text-[10px] text-muted-foreground'>#{r.reportCode}</div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default MapView;
