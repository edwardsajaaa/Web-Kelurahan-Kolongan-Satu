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
  Compass,
  RotateCcw,
  ExternalLink,
  MapPin,
  Info,
  Building2,
  Landmark,
  Church,
  GraduationCap,
  Heart,
  Fuel,
  Coffee,
  Shield,
  Star,
  Maximize2,
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
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPoi, setSelectedPoi] = useState<MapPoiPoint | null>(KOLONGAN_SATU_POIS[0]);
  const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);

  // Pusat tampilan membingkai keseluruhan wilayah yang ada di peta citra satelit
  const defaultCenter: [number, number] = [124.8318, 1.3130];
  const defaultZoom = 15.3;

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Set local web worker URL to enable GeoJSON polygon & vector layer rendering
    try {
      if (typeof window !== 'undefined' && typeof (maplibregl as any).setWorkerUrl === 'function') {
        (maplibregl as any).setWorkerUrl('/maplibre-gl-worker.mjs');
      }
    } catch (e) {
      console.warn('Worker configuration note:', e);
    }

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

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: satelliteStyle,
      center: defaultCenter,
      zoom: defaultZoom,
      pitch: is3DMode ? 52 : 0,
      bearing: is3DMode ? -12 : 0,
      maxPitch: 75,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right');

    const handleLoadLayers = () => {
      setIsMapLoaded(true);
      renderBoundary(map);
      renderRoadOverlays(map);
      renderPoiMarkers(map, activeCategory);
    };

    map.on('load', handleLoadLayers);
    map.on('style.load', () => {
      renderBoundary(map);
      renderRoadOverlays(map);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Render Boundary Polygon persis seperti garis putus-putus merah-putih Google Maps
  const renderBoundary = (map: maplibregl.Map) => {
    try {
      if (map.getSource('kolongan-boundary')) {
        if (map.getLayer('kolongan-boundary-fill')) map.removeLayer('kolongan-boundary-fill');
        if (map.getLayer('kolongan-boundary-glow')) map.removeLayer('kolongan-boundary-glow');
        if (map.getLayer('kolongan-boundary-red-base')) map.removeLayer('kolongan-boundary-red-base');
        if (map.getLayer('kolongan-boundary-white-dash')) map.removeLayer('kolongan-boundary-white-dash');
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

      // 2. Thick Outer Red Glow
      map.addLayer({
        id: 'kolongan-boundary-glow',
        type: 'line',
        source: 'kolongan-boundary',
        paint: {
          'line-color': '#ef4444',
          'line-width': 12,
          'line-opacity': 0.55,
          'line-blur': 4,
        },
      });

      // 3. Garis dasar merah tebal solid (Red Base)
      map.addLayer({
        id: 'kolongan-boundary-red-base',
        type: 'line',
        source: 'kolongan-boundary',
        paint: {
          'line-color': '#dc2626',
          'line-width': 4.5,
          'line-opacity': 1,
        },
      });

      // 4. Garis putih putus-putus di atas merah (Red & White Dashed) persis seperti pada screenshot
      map.addLayer({
        id: 'kolongan-boundary-white-dash',
        type: 'line',
        source: 'kolongan-boundary',
        paint: {
          'line-color': '#ffffff',
          'line-width': 3,
          'line-dasharray': [3, 2],
          'line-opacity': 1,
        },
      });
    } catch (err) {
      console.error('Error rendering boundary:', err);
    }
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
      const isChristEdel = poi.id === 'christianos-edelweiss';
      const isStPetrus = poi.id === 'aula-st-petrus';
      const isSlb = poi.id === 'slb-kolongan';
      const isPanti = poi.id === 'panti-asuhan-tuna-grahita';
      const isLpka = poi.id === 'lpka-tomohon';
      const isLapas = poi.id === 'lapas-perempuan';
      const isWalikota = poi.id === 'kantor-walikota';
      const isSpbu = poi.id === 'spbu-pertamina';
      const isGeothermal = poi.id === 'geothermal-lahendong';

      // Render 3D Badges
      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          ${isKantor || isGmim || isChristEdel || isLpka || isLapas ? `<span class="absolute -top-1 w-9 h-9 rounded-full ${isKantor ? 'bg-amber-400/40' : isGmim || isChristEdel ? 'bg-sky-400/40' : 'bg-cyan-400/35'} animate-ping"></span>` : ''}
          
          <div class="px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1.5 transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1 ${
            isKantor
              ? 'bg-[#006194] text-white ring-2 ring-amber-300 ring-offset-1'
              : isGmim || isChristEdel
              ? 'bg-[#0284c7] text-white ring-2 ring-sky-300 ring-offset-1'
              : isLpka
              ? 'bg-[#0284c7] text-white ring-2 ring-cyan-200 ring-offset-1'
              : isLapas
              ? 'bg-[#0e7490] text-white ring-2 ring-cyan-200 ring-offset-1'
              : isWalikota
              ? 'bg-[#0369a1] text-white ring-2 ring-cyan-300'
              : isStPetrus
              ? 'bg-[#4338ca] text-white ring-1 ring-indigo-300'
              : isSlb
              ? 'bg-[#0f766e] text-white ring-1 ring-teal-300'
              : isPanti
              ? 'bg-[#be123c] text-white ring-1 ring-rose-300'
              : isSpbu
              ? 'bg-amber-600 text-white ring-1 ring-amber-300'
              : isGeothermal
              ? 'bg-emerald-700 text-white ring-1 ring-emerald-300'
              : 'bg-white/95 text-[#131b2e] ring-1 ring-slate-300/80 backdrop-blur-md'
          }">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${poi.categoryColor}"></span>
            <span class="text-[11px] font-extrabold whitespace-nowrap tracking-tight flex items-center gap-1 ${
              isKantor ? 'text-amber-200' : isGmim || isChristEdel || isLpka || isLapas || isWalikota || isSpbu || isGeothermal || isStPetrus || isSlb || isPanti ? 'text-white' : 'text-[#131b2e]'
            }">
              ${
                isKantor
                  ? '<svg class="w-3 h-3 inline-block fill-amber-300 mr-0.5" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>Kantor Kelurahan'
                  : isGmim
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M18 22V8a2 2 0 00-2-2H8a2 2 0 00-2 2v14m12 0H6m6-18v6m-3-3h6"/></svg>GMIM Elohim 1'
                  : isChristEdel
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M18 22V8a2 2 0 00-2-2H8a2 2 0 00-2 2v14m12 0H6m6-18v6m-3-3h6"/></svg>Christianos (Edelweiss)'
                  : isStPetrus
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M5 10v11m4-11v11m6-11v11m4-11v11M12 3l9 7H3l9-7z"/></svg>Aula St. Petrus'
                  : isSlb
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>SLB Kolongan'
                  : isPanti
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>Panti Tuna Grahita'
                  : isLpka
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>LPKA Tomohon'
                  : isLapas
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>Lapas Perempuan'
                  : isWalikota
                  ? '<svg class="w-3 h-3 inline-block stroke-current fill-none mr-0.5" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M5 10v11m4-11v11m6-11v11m4-11v11M12 3l9 7H3l9-7z"/></svg>Kantor Walikota'
                  : `${poi.name.split(' ')[0]} ${poi.name.split(' ')[1] || ''}`
              }
            </span>
          </div>

          <div class="w-2.5 h-2.5 -mt-1 rotate-45 ${
            isKantor
              ? 'bg-[#006194]'
              : isGmim || isChristEdel
              ? 'bg-[#0284c7]'
              : isLpka
              ? 'bg-[#0284c7]'
              : isLapas
              ? 'bg-[#0e7490]'
              : isWalikota
              ? 'bg-[#0369a1]'
              : isStPetrus
              ? 'bg-[#4338ca]'
              : isSlb
              ? 'bg-[#0f766e]'
              : isPanti
              ? 'bg-[#be123c]'
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

  // Fit to Full Boundaries View
  const handleFitBoundary = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.fitBounds(
      [
        [124.8245, 1.3010],
        [124.8380, 1.3215],
      ],
      {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        pitch: is3DMode ? 48 : 0,
        bearing: is3DMode ? -10 : 0,
        duration: 1200,
      }
    );
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
            <h4 className="text-xs sm:text-sm font-extrabold text-[#131b2e] leading-tight">
              Peta 3D Batas &amp; Koridor Jalan Kelurahan Kolongan Satu
            </h4>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Fit Full Boundary Button */}
          <button
            type="button"
            onClick={handleFitBoundary}
            className="px-3 py-1.5 rounded-full text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            title="Tampilkan seluruh garis batas wilayah poligon"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white" />
            <span>Batas Wilayah Penuh</span>
          </button>

          {/* 3D View Toggle */}
          <button
            type="button"
            onClick={handleToggle3D}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center shadow-xs cursor-pointer ${
              is3DMode
                ? 'bg-[#006194] text-white'
                : 'bg-white hover:bg-[#e2e7ff] text-[#006194] border border-[#dae2fd]'
            }`}
            title="Beralih sudut pandang 3D perspektif / 2D datar"
          >
            <span>{is3DMode ? 'Mode 3D Perspektif' : 'Mode 2D Datar'}</span>
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
          { id: 'all', label: `Semua Titik (${KOLONGAN_SATU_POIS.length})`, icon: MapPin },
          { id: 'kantor', label: 'Kantor Kelurahan', icon: Star },
          { id: 'pemerintahan', label: 'Pemkot, LPKA & Lapas', icon: Building2 },
          { id: 'ibadah', label: 'Gereja & Ibadah', icon: Church },
          { id: 'pendidikan', label: 'SLB & Pendidikan', icon: GraduationCap },
          { id: 'sosial', label: 'Panti Asuhan', icon: Heart },
          { id: 'fasilitas', label: 'Aula & Fasilitas', icon: Fuel },
          { id: 'niaga', label: 'Kuliner & Niaga', icon: Coffee },
          { id: 'pos_jaga', label: 'Pos Jaga I - V', icon: Shield },
        ].map((cat) => {
          const IconComp = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-[#006194] text-white shadow-xs'
                  : 'bg-[#faf8ff] hover:bg-[#e2e7ff] text-[#535f70] border border-[#dae2fd]/70'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. The 3D Map Viewport */}
      <div className="relative w-full h-[400px] sm:h-[480px] lg:h-[520px] bg-slate-900 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />
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
              <h5 className="text-sm sm:text-base font-bold text-[#131b2e] leading-snug">
                {selectedPoi.name}
              </h5>
              <p className="text-xs text-[#535f70] mt-0.5">{selectedPoi.alamat}</p>
              <p className="text-xs text-[#3f4850] mt-1 italic">{selectedPoi.deskripsi}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
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
