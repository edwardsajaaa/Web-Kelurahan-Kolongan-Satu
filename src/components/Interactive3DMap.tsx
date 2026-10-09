'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  KOLONGAN_SATU_BOUNDARY,
  KOLONGAN_SATU_ROADS,
  KOLONGAN_SATU_POIS,
  MapPoiPoint,
} from '@/data/map3dData';
import {
  Layers,
  Compass,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MapPin,
  Eye,
  Info,
} from 'lucide-react';

interface Interactive3DMapProps {
  className?: string;
  onSelectPoi?: (poi: MapPoiPoint) => void;
}

export default function Interactive3DMap({ className = '', onSelectPoi }: Interactive3DMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // State controls
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [mapStyleType, setMapStyleType] = useState<'satellite' | 'streets'>('satellite');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPoi, setSelectedPoi] = useState<MapPoiPoint | null>(KOLONGAN_SATU_POIS[0]);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Pusat tampilan membingkai keseluruhan wilayah yang ada di peta citra satelit
  const defaultCenter: [number, number] = [124.8318, 1.3130];
  const defaultZoom = 15.3;

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Define tile sources
    const satelliteStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'esri-satellite': {
          type: 'raster',
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          ],
          tileSize: 256,
          attribution: 'Esri, Maxar, Earthstar Geographics',
        },
        'carto-labels': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
        },
      },
      layers: [
        {
          id: 'satellite-base',
          type: 'raster',
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: 'labels-layer',
          type: 'raster',
          source: 'carto-labels',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const streetsStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        'carto-voyager': {
          type: 'raster',
          tiles: [
            'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors, © CARTO',
        },
      },
      layers: [
        {
          id: 'streets-base',
          type: 'raster',
          source: 'carto-voyager',
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleType === 'satellite' ? satelliteStyle : streetsStyle,
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? 52 : 0,
      bearing: is3DMode ? -12 : 0,
      maxPitch: 75,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      setIsMapLoaded(true);
      renderBoundary(map);
      renderRoadOverlays(map);
      renderPoiMarkers(map, activeCategory);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [mapStyleType]);

  // Render Boundary Polygon persis seperti garis putus-putus merah-putih Google Maps
  const renderBoundary = (map: maplibregl.Map) => {
    if (map.getSource('kolongan-boundary')) {
      map.removeLayer('kolongan-boundary-fill');
      map.removeLayer('kolongan-boundary-glow');
      map.removeLayer('kolongan-boundary-red-base');
      map.removeLayer('kolongan-boundary-white-dash');
      map.removeSource('kolongan-boundary');
    }

    map.addSource('kolongan-boundary', {
      type: 'geojson',
      data: KOLONGAN_SATU_BOUNDARY,
    });

    // 1. Semi-transparent civic area fill
    map.addLayer({
      id: 'kolongan-boundary-fill',
      type: 'fill',
      source: 'kolongan-boundary',
      paint: {
        'fill-color': '#006194',
        'fill-opacity': 0.12,
      },
    });

    // 2. Soft outer glow
    map.addLayer({
      id: 'kolongan-boundary-glow',
      type: 'line',
      source: 'kolongan-boundary',
      paint: {
        'line-color': '#ef4444',
        'line-width': 8,
        'line-opacity': 0.45,
        'line-blur': 4,
      },
    });

    // 3. Garis dasar merah solid (Red Base)
    map.addLayer({
      id: 'kolongan-boundary-red-base',
      type: 'line',
      source: 'kolongan-boundary',
      paint: {
        'line-color': '#dc2626',
        'line-width': 3.5,
        'line-opacity': 0.95,
      },
    });

    // 4. Garis putih putus-putus di atas merah (Red & White Dashed) persis seperti pada screenshot
    map.addLayer({
      id: 'kolongan-boundary-white-dash',
      type: 'line',
      source: 'kolongan-boundary',
      paint: {
        'line-color': '#ffffff',
        'line-width': 2.8,
        'line-dasharray': [3, 2.5],
        'line-opacity': 1,
      },
    });
  };

  // Render Highlight Jalan-Jalan Utama yang ada di Gambar (Jl. Zanosui, Jl. Wariki, Jl. P.L. Kaunang, dll)
  const renderRoadOverlays = (map: maplibregl.Map) => {
    if (map.getSource('kolongan-roads')) {
      map.removeLayer('kolongan-roads-line');
      map.removeLayer('kolongan-roads-glow');
      map.removeSource('kolongan-roads');
    }

    const roadsGeoJson = {
      type: 'FeatureCollection' as const,
      features: KOLONGAN_SATU_ROADS.map((r) => ({
        type: 'Feature' as const,
        properties: { name: r.name, id: r.id },
        geometry: {
          type: 'LineString' as const,
          coordinates: r.coordinates,
        },
      })),
    };

    map.addSource('kolongan-roads', {
      type: 'geojson',
      data: roadsGeoJson,
    });

    // Soft cyan road casing
    map.addLayer({
      id: 'kolongan-roads-glow',
      type: 'line',
      source: 'kolongan-roads',
      paint: {
        'line-color': '#0ea5e9',
        'line-width': 4.5,
        'line-opacity': 0.35,
        'line-blur': 2,
      },
    });

    // Road track line
    map.addLayer({
      id: 'kolongan-roads-line',
      type: 'line',
      source: 'kolongan-roads',
      paint: {
        'line-color': '#38bdf8',
        'line-width': 2,
        'line-opacity': 0.85,
        'line-dasharray': [2, 1],
      },
    });
  };

  // Render POI Pins dengan style khas persis lokasi gambar
  const renderPoiMarkers = (map: maplibregl.Map, categoryFilter: string) => {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      categoryFilter === 'all'
        ? KOLONGAN_SATU_POIS
        : KOLONGAN_SATU_POIS.filter((p) => p.category === categoryFilter);

    filtered.forEach((poi) => {
      const el = document.createElement('div');
      el.className = 'group cursor-pointer relative';

      const isKantor = poi.id === 'kantor-kelurahan';
      const isGmim = poi.id === 'gmim-elohim';
      const isWalikota = poi.id === 'kantor-walikota';
      const isSpbu = poi.id === 'spbu-pertamina';
      const isGeothermal = poi.id === 'geothermal-lahendong';

      // Render 3D Badges
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${isKantor || isGmim ? `<span class="absolute -top-1 w-9 h-9 rounded-full ${isKantor ? 'bg-amber-400/40' : 'bg-sky-400/40'} animate-ping"></span>` : ''}
          
          <div class="px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 ${
            isKantor
              ? 'bg-[#006194] text-white ring-2 ring-amber-300 ring-offset-1'
              : isGmim
              ? 'bg-[#0284c7] text-white ring-2 ring-sky-300 ring-offset-1'
              : isWalikota
              ? 'bg-[#0369a1] text-white ring-2 ring-cyan-300'
              : isSpbu
              ? 'bg-amber-600 text-white ring-1 ring-amber-300'
              : isGeothermal
              ? 'bg-emerald-700 text-white ring-1 ring-emerald-300'
              : 'bg-white/95 text-[#131b2e] ring-1 ring-slate-300/80 backdrop-blur-md'
          }">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${poi.categoryColor}"></span>
            <span class="text-[11px] font-extrabold whitespace-nowrap tracking-tight ${
              isKantor ? 'text-amber-200' : isGmim || isWalikota || isSpbu || isGeothermal ? 'text-white' : 'text-[#131b2e]'
            }">
              ${isKantor ? '⭐ Kantor Kelurahan' : isGmim ? '⛪ GMIM Elohim 1' : `${poi.name.split(' ')[0]} ${poi.name.split(' ')[1] || ''}`}
            </span>
          </div>

          <div class="w-2.5 h-2.5 -mt-1 rotate-45 ${
            isKantor
              ? 'bg-[#006194]'
              : isGmim
              ? 'bg-[#0284c7]'
              : isWalikota
              ? 'bg-[#0369a1]'
              : isSpbu
              ? 'bg-amber-600'
              : isGeothermal
              ? 'bg-emerald-700'
              : 'bg-white border-r border-b border-slate-300/80'
          }"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedPoi(poi);
        if (onSelectPoi) onSelectPoi(poi);
        map.flyTo({
          center: poi.coordinates,
          zoom: 16.5,
          pitch: is3DMode ? 60 : 0,
          speed: 1.2,
          curve: 1.4,
        });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(poi.coordinates)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  // Re-filter markers when category changes
  useEffect(() => {
    if (mapInstanceRef.current && isMapLoaded) {
      renderPoiMarkers(mapInstanceRef.current, activeCategory);
    }
  }, [activeCategory, isMapLoaded]);

  // Toggle 3D Perspective Tilt
  const handleToggle3D = () => {
    if (!mapInstanceRef.current) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);

    mapInstanceRef.current.easeTo({
      pitch: nextMode ? 52 : 0,
      bearing: nextMode ? -12 : 0,
      duration: 1000,
    });
  };

  // Reset to Full Boundaries View
  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? 52 : 0,
      bearing: is3DMode ? -12 : 0,
      duration: 1000,
    });
    setSelectedPoi(KOLONGAN_SATU_POIS[0]);
  };

  return (
    <div className={`w-full flex flex-col bg-white rounded-3xl border border-[#dae2fd] shadow-md overflow-hidden ${className}`}>
      {/* 1. Header Toolbar */}
      <div className="p-3.5 sm:p-4 bg-[#faf8ff] border-b border-[#dae2fd] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#006194] text-white flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-[#dc2626] bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider border border-red-200">
                Batas Resmi Citra Satelit
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#131b2e] leading-tight">
              Peta 3D Batas &amp; Koridor Jalan Kelurahan Kolongan Satu
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* 3D View Toggle */}
          <button
            type="button"
            onClick={handleToggle3D}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
              is3DMode
                ? 'bg-[#006194] text-white'
                : 'bg-white hover:bg-[#e2e7ff] text-[#006194] border border-[#dae2fd]'
            }`}
            title="Beralih sudut pandang 3D perspektif / 2D datar"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{is3DMode ? 'Mode 3D Perspektif' : 'Mode 2D Datar'}</span>
          </button>

          {/* Layer Style Switcher */}
          <button
            type="button"
            onClick={() => setMapStyleType(mapStyleType === 'satellite' ? 'streets' : 'satellite')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#dae2fd] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Beralih Citra Satelit / Peta Jalan"
          >
            <Layers className="w-3.5 h-3.5 text-[#006194]" />
            <span>{mapStyleType === 'satellite' ? '🛰️ Satelit Asli' : '🗺️ Peta Jalan'}</span>
          </button>

          {/* Reset Center */}
          <button
            type="button"
            onClick={handleResetCenter}
            className="p-1.5 rounded-full bg-white hover:bg-[#e2e7ff] text-[#535f70] hover:text-[#006194] border border-[#dae2fd] transition shadow-xs cursor-pointer"
            title="Pusatkan kembali ke batas penuh"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="px-4 py-2 bg-white border-b border-[#dae2fd]/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-[#535f70] whitespace-nowrap">Filter Lokasi:</span>
        {[
          { id: 'all', label: 'Semua Titik (13)' },
          { id: 'kantor', label: '🏛️ Kantor Kelurahan' },
          { id: 'pemerintahan', label: '🏢 Kantor Walikota' },
          { id: 'ibadah', label: '⛪ GMIM Elohim' },
          { id: 'fasilitas', label: '⛽ SPBU & Geothermal' },
          { id: 'niaga', label: '☕ Curated Coffee' },
          { id: 'pos_jaga', label: '🛡️ Pos Jaga I - V' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-[#006194] text-white shadow-xs'
                : 'bg-[#faf8ff] hover:bg-[#e2e7ff] text-[#535f70] border border-[#dae2fd]/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. The 3D Map Viewport */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md border border-[#dae2fd] rounded-2xl p-3 shadow-lg text-[11px] space-y-1.5 z-10 max-w-[280px]">
          <div className="flex items-center gap-2 font-bold text-[#131b2e]">
            <span className="w-4 h-1 border-t-2 border-dashed border-red-500 bg-red-600"></span>
            <span>Batas Wilayah (Sesuai Citra Peta)</span>
          </div>
          <div className="text-[10px] text-[#535f70] leading-snug">
            Mencakup: Jl. Zanosui, Jl. Wariki, Jl. P.L. Kaunang, Jl. Mitos, Jl. Slanag, Jl. Sreko hingga Area Geothermal Lahendong.
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-200/80 text-[10px] font-semibold text-[#006194]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006194] ring-2 ring-amber-300"></span>
            <span>⭐ Kantor Kelurahan = Tepi Jl. Zanosui (Depan Persimpangan)</span>
          </div>
        </div>

        {/* Street Name Guide Bar at Top Center */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white rounded-full px-3.5 py-1 text-[11px] font-medium shadow-lg hidden md:flex items-center gap-2 z-10">
          <span className="text-cyan-400 font-bold">🛣️ Jalan Utama Terdata:</span>
          <span>Jl. Zanosui • Jl. Wariki • Jl. P.L. Kaunang • Jl. Mitos • Jl. Slanag • Jl. Sreko</span>
        </div>
      </div>

      {/* 4. Selected POI Quick Info Box */}
      {selectedPoi && (
        <div className="p-4 bg-[#f8f9ff] border-t border-[#dae2fd] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-2xl text-white flex items-center justify-center shrink-0 shadow-xs"
              style={{ backgroundColor: selectedPoi.categoryColor }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#006194] bg-[#e2e7ff] px-2 py-0.5 rounded-full">
                  {selectedPoi.categoryLabel}
                </span>
                <span className="text-[11px] font-semibold text-[#535f70]">{selectedPoi.jaga}</span>
              </div>
              <h5 className="text-sm sm:text-base font-bold text-[#131b2e] mt-0.5">
                {selectedPoi.name}
              </h5>
              <p className="text-xs text-[#535f70] mt-0.5">{selectedPoi.alamat}</p>
              <p className="text-xs text-[#3f4850] mt-1 italic">{selectedPoi.deskripsi}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.flyTo({
                    center: selectedPoi.coordinates,
                    zoom: 17,
                    pitch: is3DMode ? 65 : 0,
                    bearing: is3DMode ? 20 : 0,
                    duration: 1200,
                  });
                }
              }}
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#e2e7ff] text-[#006194] border border-[#dae2fd] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Fokus 3D</span>
            </button>
            <a
              href={selectedPoi.gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-full text-xs font-semibold bg-[#006194] hover:bg-[#007bb9] text-white transition flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Google Maps</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
