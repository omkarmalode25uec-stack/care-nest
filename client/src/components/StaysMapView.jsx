import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
  Info,
  Maximize2
} from 'lucide-react';
import { getLeafletLatLng, createStayPriceIcon } from '../utils/leafletIcons';

// Helper component to auto-fit map view bounds around mapped Nashik stays
const FitBounds = ({ properties, selectedId }) => {
  const map = useMap();

  useEffect(() => {
    if (!properties || properties.length === 0) return;

    // If a specific property is selected, pan smoothly to it
    if (selectedId) {
      const selected = properties.find((p) => p._id === selectedId);
      const coords = getLeafletLatLng(selected);
      if (coords) {
        map.setView(coords, 16, { animate: true });
        return;
      }
    }

    // Otherwise, fit bounds to include all mapped stays
    const validCoords = properties
      .map((p) => getLeafletLatLng(p))
      .filter((c) => c !== null);

    if (validCoords.length > 0) {
      map.fitBounds(validCoords, { padding: [40, 40], maxZoom: 15 });
    }
  }, [properties, selectedId, map]);

  return null;
};

export const StaysMapView = ({ properties = [], onSelectStay }) => {
  const [selectedStayId, setSelectedStayId] = useState(null);

  // Filter only stays that have valid coordinates and pass geographic safety
  const mappedProperties = properties.filter((p) => {
    const coords = getLeafletLatLng(p);
    return coords !== null;
  });

  const unmappedCount = properties.length - mappedProperties.length;

  // Default Nashik Ramkund center
  const defaultCenter = [20.0063, 73.7915];

  return (
    <div className="relative w-full h-[600px] sm:h-[680px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-100 flex flex-col">
      {/* Top Map Floating Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-800">
            {mappedProperties.length} Nashik Stay{mappedProperties.length !== 1 ? 's' : ''} on OpenStreetMap
          </span>
          {unmappedCount > 0 && (
            <span className="text-[11px] text-slate-500 font-medium border-l border-slate-200 pl-2">
              ({unmappedCount} awaiting GPS audit)
            </span>
          )}
        </div>

        <div className="bg-slate-900/90 text-white backdrop-blur-xs px-3 py-1.5 rounded-xl text-[11px] font-semibold border border-slate-700 shadow-md flex items-center gap-1.5 pointer-events-auto">
          <span>🗺️</span>
          <span>OpenStreetMap • Nashik Kumbh Mela</span>
        </div>
      </div>

      {/* Main Leaflet Map */}
      <div className="flex-1 w-full h-full">
        {mappedProperties.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50">
            <Info className="w-10 h-10 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">No Mapped Stays Found</h3>
            <p className="text-xs text-slate-500 max-w-sm">
              No stays matching your current filters have GPS coordinates. Try adjusting filters or switch to List View.
            </p>
          </div>
        ) : (
          <MapContainer
            center={defaultCenter}
            zoom={14}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            attributionControl={true}
          >
            <FitBounds properties={mappedProperties} selectedId={selectedStayId} />

            {/* OpenStreetMap Raster Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Mapped Stay Price Markers */}
            {mappedProperties.map((property) => {
              const coords = getLeafletLatLng(property);
              if (!coords) return null;

              const isSelected = selectedStayId === property._id;
              const primaryImage =
                property.images && property.images.length > 0
                  ? property.images[0]
                  : 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80';

              return (
                <Marker
                  key={property._id}
                  position={coords}
                  icon={createStayPriceIcon(property.pricePerNight, isSelected)}
                  eventHandlers={{
                    click: () => {
                      setSelectedStayId(property._id);
                      if (onSelectStay) onSelectStay(property);
                    },
                  }}
                >
                  <Popup className="custom-leaflet-popup" minWidth={260} maxWidth={300}>
                    <div className="space-y-2.5 p-1">
                      {/* Thumbnail Image */}
                      <div className="relative h-28 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={primaryImage}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white uppercase tracking-wider backdrop-blur-xs capitalize">
                            {property.propertyType}
                          </span>
                        </div>
                        {property.verificationStatus === 'verified' && (
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-600 backdrop-blur-xs">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" /> Verified
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info Details */}
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="text-xs font-extrabold text-slate-900 line-clamp-1">
                            {property.title}
                          </h4>
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[11px] shrink-0">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <span>{property.googleRating || 4.5}</span>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-orange-600 shrink-0" />
                          <span>{property.address}, {property.city}</span>
                        </p>

                        {property.distanceFromKumbh && (
                          <p className="text-[10px] text-orange-700 font-semibold mt-1">
                            🚶 {property.distanceFromKumbh}
                          </p>
                        )}
                      </div>

                      {/* Pricing & CTA */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-tight">Price per night</span>
                          <span className="text-sm font-black text-slate-900">
                            ₹{property.pricePerNight?.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <Link
                          to={`/stays/${property._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        )}
      </div>
    </div>
  );
};

export default StaysMapView;
