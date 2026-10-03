'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface ActivitySlide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  alt: string;
}

export const ACTIVITY_SLIDES: ActivitySlide[] = [
  {
    id: 'slide-1',
    title: 'Musyawarah Perencanaan Pembangunan (Musrenbang) Kelurahan',
    subtitle: 'Forum rembuk bersama aparat kelurahan, kepala lingkungan, dan tokoh masyarakat untuk menetapkan program prioritas.',
    category: 'Pemerintahan & Partisipasi Warga',
    badge: 'Agenda Tahunan Kelurahan',
    imageUrl: 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Musrenbang Kelurahan Kolongan Satu',
  },
  {
    id: 'slide-2',
    title: 'Aksi Gotong Royong & Kerja Bakti Kebersihan Lingkungan',
    subtitle: 'Kerja bakti terpadu pembersihan drainase, sanitasi lorong, dan penataan lingkungan asri bersama warga 5 Jaga.',
    category: 'Lingkungan Hidup & Kebersihan',
    badge: 'Kegiatan Swadaya Warga',
    imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Gotong Royong Kebersihan Lingkungan Kolongan Satu',
  },
  {
    id: 'slide-3',
    title: 'Pelayanan Kesehatan Posyandu Terpadu Balita & Lansia',
    subtitle: 'Pemeriksaan kesehatan berkala, imunisasi rutin balita, penimbangan nutrisi, dan pengecekan tensi lansia.',
    category: 'Kesehatan & Kesejahteraan',
    badge: 'Layanan Terpadu Bulanan',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Layanan Posyandu Kolongan Satu',
  },
  {
    id: 'slide-4',
    title: 'Sosialisasi Digitalisasi Monografi & Pemetaan Potensi Wilayah',
    subtitle: 'Pendataan statistik mutakhir, pemetaan demografi digital, dan sosialisasi portal data terbuka kelurahan.',
    category: 'Inovasi & Digitalisasi Portal',
    badge: 'Pengembangan Berkelanjutan',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Sosialisasi Digitalisasi Monografi',
  },
  {
    id: 'slide-5',
    title: 'Penyaluran Bantuan Pangan & Penguatan Ekonomi Masyarakat',
    subtitle: 'Distribusi bantuan langsung bagi keluarga penerima manfaat dan pendampingan kelompok usaha mandiri.',
    category: 'Sosial & Pemberdayaan Warga',
    badge: 'Program Kesejahteraan Sosial',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=80',
    alt: 'Dokumentasi Penyaluran Bantuan Sosial Kolongan Satu',
  },
];

export default function ActivitySlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % ACTIVITY_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + ACTIVITY_SLIDES.length) % ACTIVITY_SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer (5 seconds) with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentSlide = ACTIVITY_SLIDES[currentIndex];

  return (
    <div
      className="relative w-full rounded-2xl 2xl:rounded-3xl overflow-hidden shadow-xl bg-[#131b2e] aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.3/1] max-h-[500px] lg:max-h-[560px] 2xl:max-h-[680px] 3xl:max-h-[760px] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Dokumentasi Kegiatan Kelurahan Kolongan Satu"
    >
      {/* Background Slides with smooth fade transition */}
      {ACTIVITY_SLIDES.map((slide, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.imageUrl}
              alt={slide.alt}
              className={`w-full h-full object-cover transition-transform duration-7000 ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
            {/* Elegant multi-layer overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#131b2e] via-[#131b2e]/60 to-[#131b2e]/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#131b2e]/80 via-transparent to-black/20" />
          </div>
        );
      })}



      {/* NAVIGATION ARROWS (Left & Right) */}
      <button
        onClick={prevSlide}
        aria-label="Slide sebelumnya"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
      >
        <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
          chevron_left
        </span>
      </button>

      <button
        onClick={nextSlide}
        aria-label="Slide berikutnya"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
      >
        <span className="material-symbols-outlined text-[22px] sm:text-[26px]">
          chevron_right
        </span>
      </button>

      {/* BOTTOM CONTENT: Active Activity Title, Description & Progress Dots */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 2xl:bottom-8 2xl:left-8 2xl:right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Title and Description */}
        <div className="max-w-2xl 2xl:max-w-3xl text-white">
          <span className="text-[11px] sm:text-xs 2xl:text-sm tracking-wider uppercase text-[#93ccff] font-bold block mb-1">
            {currentSlide.category}
          </span>
          <h2 className="text-lg sm:text-2xl md:text-3xl 2xl:text-4xl text-white font-bold leading-tight drop-shadow-sm transition-all duration-300">
            {currentSlide.title}
          </h2>
          <p className="mt-1 sm:mt-2 text-xs sm:text-sm 2xl:text-base text-white/85 leading-relaxed line-clamp-2 drop-shadow-sm font-normal">
            {currentSlide.subtitle}
          </p>
        </div>

        {/* Indicators & Thumbnails */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/15 self-start md:self-end">
          {ACTIVITY_SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                aria-label={`Lihat kegiatan ${index + 1}: ${slide.title}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-9 bg-[#6cf8bb] shadow-[0_0_8px_rgba(108,248,187,0.7)]'
                    : 'w-2 sm:w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
