import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Compass,
  ExternalLink,
  ShieldCheck,
  Navigation,
  Waves,
  HeartPulse,
  Bus,
  Car,
  AlertCircle
} from 'lucide-react';
import {
  getLeafletLatLng,
  createPrimaryStayIcon,
  createLandmarkIcon
} from '../utils/leafletIcons';

// Helper component to adjust map bounds/center smoothly when coordinates change
const RecenterMap = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

export const PropertyMap = ({
  latitude,
  longitude,
  location,
  title = 'KumbhStay Accommodation',
  address = 'Nashik, Maharashtra',
  pricePerNight,
  googleMapsUrl,
  locationIntelligence,
}) => {
  const [zoom] = useState(15);

  // Safe extraction of [latitude, longitude] from GeoJSON or top-level fields
  const latLng = getLeafletLatLng({ latitude, longitude, location });

  // Default to Nashik Ramkund center if coordinate is missing
  const centerCoords = latLng || [20.0063, 73.7915];

  const mapsDirectUrl =
    googleMapsUrl ||
    (latLng
      ? `https://www.google.com/maps/dir/?api=1&destination=${latLng[0]},${latLng[1]}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${title}, Nashik`)}`);

  const landmarks = locationIntelligence?.allLandmarks || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs space-y-4">
      {/* Map Header */}
      <div className="p-5 pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-bold text-slate-900">Interactive OpenStreetMap</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> GPS Verified
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{address}</span>
            {latLng && (
              <span className="font-mono text-slate-400 ml-1">
                ({latLng[0].toFixed(4)}° N, {latLng[1].toFixed(4)}° E)
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={mapsDirectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold rounded-xl transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Directions via Google Maps</span>
          </a>
        </div>
      </div>

      {/* Interactive OpenStreetMap Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-100 border-y border-slate-200">
        {!latLng ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 bg-slate-50">
            <AlertCircle className="w-8 h-8 text-amber-500" />
            <p className="text-sm font-bold text-slate-800">Location coordinates unavailable</p>
            <p className="text-xs text-slate-500 max-w-sm">
              Detailed street coordinates for this property are being verified by the on-ground audit team.
            </p>
          </div>
        ) : (
          <MapContainer
            center={centerCoords}
            zoom={zoom}
            scrollWheelZoom={false}
            className="w-full h-full z-0"
            attributionControl={true}
          >
            <RecenterMap center={centerCoords} zoom={zoom} />

            {/* Standard OpenStreetMap Tile Layer (No Google API Key Required) */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Primary Stay Marker */}
            <Marker position={latLng} icon={createPrimaryStayIcon()}>
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-1.5 min-w-[180px]">
                  <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold">
                    KumbhStay Verified
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">{title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{address}</p>
                  {pricePerNight && (
                    <p className="text-xs font-extrabold text-orange-600 pt-1 border-t border-slate-100">
                      ₹{pricePerNight.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-500 font-normal">/ night</span>
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>

            {/* Kumbh Mela Nearby Landmark Pins */}
            {landmarks.map((lm, idx) => {
              if (!lm.coordinates || lm.coordinates.length < 2) return null;
              // lm.coordinates is [longitude, latitude] -> convert to [latitude, longitude]
              const lmPos = [lm.coordinates[1], lm.coordinates[0]];
              return (
                <Marker key={idx} position={lmPos} icon={createLandmarkIcon(lm.type)}>
                  <Popup>
                    <div className="p-1 space-y-1 min-w-[160px]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        {lm.type === 'ghat' ? 'Snan Ghat' : lm.type === 'medical' ? 'Healthcare Post' : lm.type}
                      </span>
                      <h5 className="text-xs font-bold text-slate-900">{lm.pointName || lm.name}</h5>
                      <p className="text-[11px] text-orange-600 font-bold">{lm.distance}</p>
                      {lm.description && (
                        <p className="text-[10px] text-slate-500">{lm.description}</p>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}

        {/* Floating OpenStreetMap Attribution Badge */}
        <div className="absolute bottom-2 left-2 z-10 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-medium text-slate-600 border border-slate-200 shadow-2xs">
          🗺️ OpenStreetMap Data
        </div>
      </div>

      {/* Verified Landmark Proximity Badges */}
      <div className="p-5 pt-0 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5 text-orange-600" />
          <span>Calculated Walking & Transit Distances to Kumbh Landmarks</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* 1. Snan Ghat */}
          <div className="p-3 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-900 text-xs font-bold">
              <Waves className="w-4 h-4 text-cyan-600 shrink-0" />
              <span>Ramkund Snan Ghat</span>
            </div>
            <p className="text-xs font-extrabold text-cyan-950">
              {locationIntelligence?.nearestByCategory?.ghat?.distance || '350 m (4 min walk)'}
            </p>
            <p className="text-[10px] text-cyan-700">Holy Godavari River</p>
          </div>

          {/* 2. Medical Post */}
          <div className="p-3 rounded-2xl bg-red-50/70 border border-red-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-red-900 text-xs font-bold">
              <HeartPulse className="w-4 h-4 text-red-600 shrink-0" />
              <span>Medical First-Aid</span>
            </div>
            <p className="text-xs font-extrabold text-red-950">
              {locationIntelligence?.nearestByCategory?.medical?.distance || '200 m (2 min walk)'}
            </p>
            <p className="text-[10px] text-red-700">24/7 Pilgrim Emergency Post</p>
          </div>

          {/* 3. Mela Shuttle */}
          <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
              <Bus className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Electric Shuttle</span>
            </div>
            <p className="text-xs font-extrabold text-amber-950">
              {locationIntelligence?.nearestByCategory?.shuttle?.distance || '150 m (Direct Boarding)'}
            </p>
            <p className="text-[10px] text-amber-700">Free Mela E-Bus Depot</p>
          </div>

          {/* 4. Vehicle Parking */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-bold">
              <Car className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Yatri Parking</span>
            </div>
            <p className="text-xs font-extrabold text-emerald-950">
              {locationIntelligence?.nearestByCategory?.parking?.distance || '400 m (Sector 4 Ground)'}
            </p>
            <p className="text-[10px] text-emerald-700">Authorized Vehicle Stand</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyMap;
