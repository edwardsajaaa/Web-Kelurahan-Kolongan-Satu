'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  KOLONGAN_SATU_BOUNDARY,
  KOLONGAN_SATU_POIS,
  MapPoiPoint,
} from '@/data/map3dData';
import {
  Layers,
  Compass,
  Maximize2,
  Navigation,
  Building2,
  ExternalLink,
  MapPin,
  Eye,
  RotateCcw,
  Sparkles,
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

    // Center on Kantor Kelurahan Kolongan Satu (Jl. Zanosui)
    const centerLngLat: [number, number] = [124.8329, 1.3136];

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyleType === 'satellite' ? satelliteStyle : streetsStyle,
      center: centerLngLat,
      zoom: 16.2,
      pitch: is3DMode ? 55 : 0,
      bearing: is3DMode ? -15 : 0,
      maxPitch: 75,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    map.on('load', () => {
      setIsMapLoaded(true);
      renderBoundary(map);
      renderPoiMarkers(map, activeCategory);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, [mapStyleType]);

  // Render Boundary Polygon & Glow Outline
  const renderBoundary = (map: maplibregl.Map) => {
    if (map.getSource('kolongan-boundary')) {
      map.removeLayer('kolongan-boundary-fill');
      map.removeLayer('kolongan-boundary-line');
      map.removeLayer('kolongan-boundary-glow');
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
        'fill-opacity': 0.15,
      },
    });

    // 2. Soft outer glow
    map.addLayer({
      id: 'kolongan-boundary-glow',
      type: 'line',
      source: 'kolongan-boundary',
      paint: {
        'line-color': '#00d4ff',
        'line-width': 8,
        'line-opacity': 0.45,
        'line-blur': 4,
      },
    });

    // 3. Crisp boundary stroke
    map.addLayer({
      id: 'kolongan-boundary-line',
      type: 'line',
      source: 'kolongan-boundary',
      paint: {
        'line-color': '#ffffff',
        'line-width': 2.5,
        'line-dasharray': [2, 1.5],
      },
    });
  };

  // Render POI Pins with interactive elements
  const renderPoiMarkers = (map: maplibregl.Map, categoryFilter: string) => {
    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = categoryFilter === 'all'
      ? KOLONGAN_SATU_POIS
      : KOLONGAN_SATU_POIS.filter((p) => p.category === categoryFilter);

    filtered.forEach((poi) => {
      // Create custom 3D HTML Pin
      const el = document.createElement('div');
      el.className = 'group cursor-pointer relative';

      const isKantor = poi.id === 'kantor-kelurahan';

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <!-- Pulse animation for important places -->
          ${isKantor ? `<span class="absolute -top-1 w-9 h-9 rounded-full bg-amber-400/40 animate-ping"></span>` : ''}
          
          <!-- Pin Head Badge -->
          <div class="px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 ${
            isKantor
              ? 'bg-[#006194] text-white ring-2 ring-amber-300 ring-offset-1'
              : 'bg-white/95 text-[#131b2e] ring-1 ring-slate-300/80 backdrop-blur-md'
          }">
            <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${poi.categoryColor}"></span>
            <span class="text-[11px] font-extrabold whitespace-nowrap tracking-tight ${isKantor ? 'text-amber-200' : 'text-[#131b2e]'}">
              ${isKantor ? '⭐ ' : ''}${poi.name.split(' ')[0]} ${poi.name.split(' ')[1] || ''}
            </span>
          </div>

          <!-- Pin Tail Arrow -->
          <div class="w-2.5 h-2.5 -mt-1 rotate-45 ${isKantor ? 'bg-[#006194]' : 'bg-white border-r border-b border-slate-300/80'}"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        setSelectedPoi(poi);
        if (onSelectPoi) onSelectPoi(poi);
        map.flyTo({
          center: poi.coordinates,
          zoom: 16.8,
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
      pitch: nextMode ? 55 : 0,
      bearing: nextMode ? -15 : 0,
      duration: 1000,
    });
  };

  // Reset to Center
  const handleResetCenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: [124.8329, 1.3136],
      zoom: 16.2,
      pitch: is3DMode ? 55 : 0,
      bearing: is3DMode ? -15 : 0,
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
              <span className="text-[10px] font-bold text-[#006194] bg-[#e2e7ff] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Peta Geospasial 3D Resmi
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h4 className="text-xs sm:text-sm font-extrabold text-[#131b2e] leading-tight">
              Batas Wilayah &amp; Titik Lokasi Kelurahan Kolongan Satu
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
            title="Beralih sudut pandang 3D / 2D datar"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{is3DMode ? 'Mode 3D Aktif (55°)' : 'Mode 2D Datar'}</span>
          </button>

          {/* Layer Style Switcher */}
          <button
            type="button"
            onClick={() => setMapStyleType(mapStyleType === 'satellite' ? 'streets' : 'satellite')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-[#e2e7ff] text-[#131b2e] border border-[#dae2fd] transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Beralih Satelit / Peta Jalan"
          >
            <Layers className="w-3.5 h-3.5 text-[#006194]" />
            <span>{mapStyleType === 'satellite' ? '🛰️ Satelit' : '🗺️ Peta Jalan'}</span>
          </button>

          {/* Reset Center */}
          <button
            type="button"
            onClick={handleResetCenter}
            className="p-1.5 rounded-full bg-white hover:bg-[#e2e7ff] text-[#535f70] hover:text-[#006194] border border-[#dae2fd] transition shadow-xs cursor-pointer"
            title="Pusatkan kembali ke Kantor Kelurahan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="px-4 py-2 bg-white border-b border-[#dae2fd]/60 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-[#535f70] whitespace-nowrap">Filter Titik:</span>
        {[
          { id: 'all', label: 'Semua Titik (12)' },
          { id: 'kantor', label: '🏛️ Kantor Kelurahan' },
          { id: 'ibadah', label: '⛪ Sarana Ibadah' },
          { id: 'pos_jaga', label: '🛡️ Pos Jaga I - V' },
          { id: 'pendidikan', label: '🎓 Pendidikan' },
          { id: 'ekonomi', label: '🌸 Florikultura & Tani' },
          { id: 'sejarah', label: '🗿 Cagar Budaya Waruga' },
          { id: 'alam', label: '💧 Mata Air Swadaya' },
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
      <div className="relative w-full h-[380px] sm:h-[450px] lg:h-[480px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Legend Overlay at Bottom Left */}
        <div className="absolute bottom-3 left-3 bg-white/92 backdrop-blur-md border border-[#dae2fd] rounded-2xl p-2.5 shadow-lg text-[11px] space-y-1.5 z-10 pointer-events-none sm:pointer-events-auto">
          <div className="flex items-center gap-2 font-bold text-[#131b2e]">
            <span className="w-3.5 h-1 border-t-2 border-dashed border-cyan-400 bg-cyan-200"></span>
            <span>Batas Wilayah Kolongan Satu (48 Ha)</span>
          </div>
          <div className="flex items-center gap-3 text-[#535f70] text-[10px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#006194]"></span> Kantor
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4f46e5]"></span> Pos Jaga
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0284c7]"></span> Ibadah
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#854d0e]"></span> Sejarah
            </span>
          </div>
        </div>

        {/* Compass / 3D Attitude Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md border border-[#dae2fd] px-2.5 py-1 rounded-full shadow-md text-[11px] font-bold text-[#006194] flex items-center gap-1.5 z-10">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>{is3DMode ? 'Sudut 3D: 55° Miring' : 'Sudut 2D Datar'}</span>
        </div>
      </div>

      {/* 4. Active Location Detail Card */}
      {selectedPoi && (
        <div className="p-4 sm:p-5 bg-white border-t border-[#dae2fd] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
              style={{ backgroundColor: selectedPoi.categoryColor }}
            >
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#e2e7ff] text-[#006194]">
                  {selectedPoi.categoryLabel}
                </span>
                <span className="text-xs font-semibold text-[#006c49] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {selectedPoi.jaga}
                </span>
              </div>
              <h5 className="text-sm sm:text-base font-bold text-[#131b2e] truncate">
                {selectedPoi.name}
              </h5>
              <p className="text-xs text-[#535f70] leading-relaxed line-clamp-2 mt-0.5">
                {selectedPoi.deskripsi}
              </p>
              <p className="text-[11px] text-[#707881] font-medium mt-1">
                📍 {selectedPoi.alamat}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <a
              href={selectedPoi.gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-[#006194] hover:bg-[#007bb9] text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <span>Petunjuk Arah Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
