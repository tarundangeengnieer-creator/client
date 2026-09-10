import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface MapNode {
  id: string;
  lng: number;
  lat: number;
  element?: HTMLElement; // Custom DOM element for the marker
}

export interface MapRoute {
  id: string;
  coordinates: [number, number][]; // [[lng, lat], [lng, lat]]
  color?: string;
  width?: number;
  dashed?: boolean;
}

interface GeospatialMapProps {
  nodes?: MapNode[];
  routes?: MapRoute[];
  initialCenter?: [number, number];
  initialZoom?: number;
  interactive?: boolean;
  className?: string;
  onMapClick?: (lngLat: { lng: number; lat: number }) => void;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  nodes = [],
  routes = [],
  initialCenter = [0, 20],
  initialZoom = 1.2,
  interactive = true,
  className = "w-full h-full",
  onMapClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapInstance.current) return; // initialize map only once

    const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
    const baseUrl = import.meta.env.VITE_MAP_STYLE_URL || 'https://demotiles.maplibre.org/style.json';
    
    // Safely append key without duplicating, only if we have a key and it's not the demo tiles
    const styleUrl = new URL(baseUrl);
    if (apiKey && !styleUrl.searchParams.has('key') && !baseUrl.includes('demotiles')) {
      styleUrl.searchParams.append('key', apiKey);
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl.toString(),
      center: initialCenter,
      zoom: initialZoom,
      interactive: interactive,
      attributionControl: false,
    });

    mapInstance.current = map;

    // Add standard Zoom & Rotation controls
    if (interactive) {
      map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    }

    map.on('load', () => {
      // Add routes
      routes.forEach(route => {
        const sourceId = `route-source-${route.id}`;
        const layerId = `route-layer-${route.id}`;

        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route.coordinates
              }
            }
          });

          map.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': route.color || '#3b82f6',
              'line-width': route.width || 2,
              ...(route.dashed ? { 'line-dasharray': [2, 2] } : {})
            }
          });
        }
      });
    });

    return () => {
      map.remove();
      mapInstance.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once

  const onMapClickRef = useRef(onMapClick);
  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  // Smoothly flyTo coordinates when center changes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !initialCenter) return;
    map.flyTo({
      center: initialCenter,
      zoom: Math.max(map.getZoom(), initialZoom || 2.5),
      speed: 1.2,
      essential: true
    });
  }, [initialCenter?.[0], initialCenter?.[1], initialZoom]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    
    const clickHandler = (e: maplibregl.MapMouseEvent) => {
      if (onMapClickRef.current) {
        onMapClickRef.current(e.lngLat);
      }
    };
    
    map.on('click', clickHandler);
    return () => {
      map.off('click', clickHandler);
    };
  }, []);

  // Update nodes (Markers)
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const activeIds = new Set<string>();

    nodes.forEach(node => {
      activeIds.add(node.id);

      if (!markersRef.current[node.id]) {
        // Create new marker
        const markerOptions: maplibregl.MarkerOptions = {};
        if (node.element) {
          markerOptions.element = node.element;
        }

        const marker = new maplibregl.Marker(markerOptions)
          .setLngLat([node.lng, node.lat])
          .addTo(map);

        markersRef.current[node.id] = marker;
      } else {
        // Update existing marker position
        markersRef.current[node.id].setLngLat([node.lng, node.lat]);
      }
    });

    // Remove markers that are no longer in nodes array
    Object.keys(markersRef.current).forEach(id => {
      if (!activeIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

  }, [nodes]);

  // Update routes
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    const updateMapRoutes = () => {
      routes.forEach(route => {
        const sourceId = `route-source-${route.id}`;
        const source = map.getSource(sourceId) as maplibregl.GeoJSONSource;
        
        if (source) {
          source.setData({
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: route.coordinates
            }
          });
        }
      });
    };

    if (map.isStyleLoaded()) {
      updateMapRoutes();
    } else {
      map.once('styledata', updateMapRoutes);
    }
  }, [routes]);

  return (
    <div className={`relative ${className} overflow-hidden rounded-xl bg-[#0c1322]`}>
      <div className="absolute inset-0">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
};
