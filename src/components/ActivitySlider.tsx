'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface ActivitySlide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  imageUrl: string;
  images?: string[];
  alt: string;
}

export const ACTIVITY_SLIDES: ActivitySlide[] = [
  {
    id: 'slide-1',
    title: 'Pelaksanaan GERAKAN PANGAN MURAH / GPM di Kota Tomohon',
    subtitle: 'Lanjutan Pelaksanaan GERAKAN PANGAN MURAH / GPM di Kota Tomohon (Dinas Pangan Provinsi dan Dinas Pangan Kota Tomohon) dalam Rangka Stabilisasi Pasokan dan Harga Pangan Serta Pengendalian Inflasi',
    category: 'Pemerintahan & Partisipasi Mahasiswa',
    badge: 'Dinas Pangan Provinsi dan Dinas Pangan Kota Tomohon',
    imageUrl: '/images/kegiatan/kegiatan-1.jpg',
    images: ['/images/kegiatan/kegiatan-1.jpg'],
    alt: 'Dokumentasi Gerakan Pangan Murah Kolongan Satu',
  },
  {
    id: 'slide-2',
    title: 'Aksi Gotong Royong & Kerja Bakti Kebersihan Lingkungan',
    subtitle: 'Kerja bakti terpadu pembersihan lingkungan asri bersama Mahasiswa KKT 149',
    category: 'Lingkungan Hidup & Kebersihan',
    badge: 'Kegiatan Swadaya Warga',
    imageUrl: '/images/kegiatan/kegiatan-2.jpg',
    images: ['/images/kegiatan/kegiatan-2.jpg'],
    alt: 'Dokumentasi Kerja Bakti Kebersihan Lingkungan Kolongan Satu',
  },
  {
    id: 'slide-3',
    title: 'Distribusi dan Penyaluran Air Bersih untuk Warga',
    subtitle: 'Dengan disaksikan warga sekitar, seorang mahasiswa mengarahkan aliran air dari selang menuju wadah-wadah penampungan di pelataran rumah tinggal. Potret kepedulian sosial yang memperlihatkan kolaborasi sederhana namun bermakna bagi keseharian masyarakat.',
    category: 'Kesehatan & Kesejahteraan',
    badge: 'Layanan Terpadu Bulanan',
    imageUrl: '/images/kegiatan/kegiatan-3.jpg',
    images: ['/images/kegiatan/kegiatan-3.jpg'],
    alt: 'Dokumentasi Penyaluran Air Bersih untuk Warga',
  },
  {
    id: 'slide-4',
    title: 'Pemutakhiran Data Warga dengan Aplikasi Si Andal Tomohon',
    subtitle: 'Suasana proses pendataan dan pengisian data warga di teras rumah penduduk menggunakan platform digital Si Andal Tomohon. Langkah ini dilakukan untuk mempermudah pemetaan profil keluarga serta verifikasi data kependudukan setempat secara tepat dan efisien.',
    category: 'Inovasi & Digitalisasi Portal',
    badge: 'Pemutahiran Data Masyarakat',
    imageUrl: '/images/kegiatan/kegiatan-4.jpg',
    images: ['/images/kegiatan/kegiatan-4.jpg'],
    alt: 'Dokumentasi Pemutakhiran Data Warga Si Andal',
  },
  {
    id: 'slide-5',
    title: 'Kunjungan Mahasiswa KKT UNSRAT 149 Kolongan 1 Di Sekolah Dasar Inpres',
    subtitle: 'Mahasiswa Kuliah Kerja Terpadu (KKT) Universitas Sam Ratulangi (UNSRAT) Angkatan 149 Posko Kelurahan Kolongan 1 melaksanakan kunjungan silaturahmi sekaligus koordinasi di SD Inpres. Kunjungan yang disambut langsung oleh pihak pimpinan sekolah ini bertujuan untuk merencanakan sosialisasi lanjutan mengenai pengolahan limbah plastik menjadi ecobrick. Melalui inisiatif ini, mahasiswa berupaya menumbuhkan kesadaran peduli lingkungan sejak dini kepada para siswa sekaligus memperkenalkan solusi praktis pengelolaan sampah anorganik di lingkungan sekolah.',
    category: 'Sosial & Pemberdayaan',
    badge: 'Program Kerja Mahasiswa',
    imageUrl: '/images/kegiatan/kegiatan-5.jpg',
    images: ['/images/kegiatan/kegiatan-5.jpg'],
    alt: 'Dokumentasi Kunjungan Mahasiswa KKT UNSRAT di SD Inpres',
  },
];

interface ActivitySliderProps {
  slides?: ActivitySlide[];
}

export default function ActivitySlider({ slides }: ActivitySliderProps) {
  const activeSlides = slides && slides.length > 0 ? slides : ACTIVITY_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSubIndex, setActiveSubIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset active photo index whenever parent slide changes
  useEffect(() => {
    setActiveSubIndex(0);
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  }, [activeSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play timer: if current activity has multiple photos, cycle sub-photos or next slide
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      const slide = activeSlides[currentIndex] || activeSlides[0];
      const images = slide.images && slide.images.length > 0 ? slide.images : [slide.imageUrl];
      if (images.length > 1 && activeSubIndex < images.length - 1) {
        setActiveSubIndex((prev) => prev + 1);
      } else {
        nextSlide();
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, activeSubIndex, nextSlide, activeSlides]);

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

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];
  const currentImages = currentSlide.images && currentSlide.images.length > 0
    ? currentSlide.images
    : [currentSlide.imageUrl];
  const activeImage = currentImages[activeSubIndex] || currentImages[0] || currentSlide.imageUrl;

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
      {activeSlides.map((slide, index) => {
        const isActive = index === currentIndex;
        const slideImg = isActive ? activeImage : slide.imageUrl;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slideImg}
              alt={slide.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              decoding="async"
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

      {/* MULTI-PHOTO INDICATOR BADGE (Top Right) */}
      {currentImages.length > 1 && (
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] sm:text-xs font-semibold border border-white/20 shadow-lg">
          <span className="material-symbols-outlined text-[16px] text-[#93ccff]">photo_library</span>
          <span>Foto {activeSubIndex + 1} dari {currentImages.length}</span>
        </div>
      )}

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

      {/* BOTTOM CONTENT: Active Activity Title, Sub-Photos Gallery Strip & Indicators */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 2xl:bottom-8 2xl:left-8 2xl:right-8 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
        {/* Title, Sub-Thumbnails, and Category */}
        <div className="max-w-2xl 2xl:max-w-3xl text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] sm:text-xs 2xl:text-sm tracking-wider uppercase text-[#93ccff] font-bold">
              {currentSlide.category}
            </span>
            <span className="text-white/40">•</span>
            <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs font-semibold">
              {currentSlide.badge}
            </span>
          </div>

          <h2 className="text-lg sm:text-2xl md:text-3xl 2xl:text-4xl text-white font-bold leading-tight drop-shadow-sm transition-all duration-300">
            {currentSlide.title}
          </h2>

          {/* Sub-Photos Thumbnail Strip (When this activity has multiple photos) */}
          {currentImages.length > 1 && (
            <div className="flex items-center gap-2 mt-3 pt-2">
              {currentImages.map((imgUrl, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSubIndex(pIdx);
                  }}
                  className={`relative h-9 w-14 sm:h-11 sm:w-18 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shadow-md ${
                    pIdx === activeSubIndex
                      ? 'border-brand-400 ring-2 ring-brand-400/60 scale-105 opacity-100'
                      : 'border-white/30 opacity-60 hover:opacity-100 hover:border-white'
                  }`}
                  aria-label={`Pilih foto ${pIdx + 1}`}
                >
                  <img src={imgUrl} alt={`Foto ${pIdx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Indicators for Main Activity Slides */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 bg-black/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/15 self-start md:self-end">
          {activeSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(index)}
                aria-label={`Lihat kegiatan ${index + 1}: ${slide.title}`}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 sm:w-9 bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]'
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
