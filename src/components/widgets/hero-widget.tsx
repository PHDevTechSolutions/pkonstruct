import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export interface PageSection {
  id: string;
  title?: string;
  image?: string;
  content?: string | any;
}

interface SlideData {
  id: string;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  buttonPosition: string;
}

interface HeroWidgetProps {
  section: PageSection;
}

export function HeroWidget({ section }: HeroWidgetProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  // Parse content safely
  let content: any = {};
  try {
    if (typeof section.content === "string") {
      content = JSON.parse(section.content || "{}");
    } else {
      content = section.content || {};
    }
  } catch {
    content = {};
  }

  const {
    autoPlay = true,
    autoPlayDelay = 6,
    showDots = true,
    showArrows = true,
    slides = [],
    secondaryButtonText = "",
    secondaryButtonLink = "",
    showScrollIndicator = true,
    overlayOpacity = 40,
  } = content;

  const headline = content.headline || section.title || "Modern Excellence";
  const subheadline = content.subheadline || content.subtitle || "Innovation Driven";
  const ctaText = content.ctaText || content.buttonText || "Get Started";
  const ctaLink = content.ctaLink || content.buttonLink || "#";
  const backgroundImage = content.backgroundImage || section.image || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2000";

  const heroSlides: SlideData[] = slides.length > 0 ? slides : [{
    id: "default",
    image: backgroundImage,
    title: headline,
    description: content.description || "We build high-performance digital ecosystems that scale with your ambition.",
    buttonText: ctaText,
    buttonLink: ctaLink,
    buttonPosition: "center",
  }];

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentSlide((prev) => (prev + newDirection + heroSlides.length) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    if (!autoPlay || heroSlides.length <= 1) return;
    const interval = setInterval(() => paginate(1), autoPlayDelay * 1000);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayDelay, heroSlides.length, paginate]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 1.05,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.6 },
        scale: { duration: 0.8 },
      },
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.95,
      transition: {
        x: { type: "spring" as const, stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  const getPositionClasses = (pos: string) => {
    const map: Record<string, string> = {
      "center": "items-center text-center",
      "center-left": "items-start text-left",
      "center-right": "items-end text-right",
    };
    return map[pos] || "items-center text-center";
  };

  return (
    <section className="relative h-[85vh] md:h-screen w-full overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          {/* Background with Parallax-like Zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.img
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: "linear" }}
              src={heroSlides[currentSlide].image}
              alt={heroSlides[currentSlide].title}
              className="h-full w-full object-cover"
              style={{ opacity: (100 - overlayOpacity) / 100 }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </div>

          {/* Content Layer */}
          <div className="relative h-full container mx-auto px-6 flex flex-col justify-center">
            <div className={`flex flex-col max-w-4xl mx-auto ${getPositionClasses(heroSlides[currentSlide].buttonPosition)}`}>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-block text-white font-mono text-sm tracking-[0.3em] uppercase mb-6 bg-primary/10 px-4 py-1 rounded-full backdrop-blur-sm border border-primary/20"
              >
                {subheadline}
              </motion.span>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight"
              >
                {heroSlides[currentSlide].title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl leading-relaxed font-light"
              >
                {heroSlides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-5 justify-center"
              >
                <a
                  href={heroSlides[currentSlide].buttonLink}
                  className="group bg-white text-black px-10 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-300 shadow-2xl shadow-white/10"
                >
                  {heroSlides[currentSlide].buttonText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                {secondaryButtonText && (
                  <a
                    href={secondaryButtonLink}
                    className="px-10 py-4 rounded-full font-bold text-white border border-white/20 hover:bg-white/10 transition-all backdrop-blur-sm"
                  >
                    {secondaryButtonText}
                  </a>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {showArrows && heroSlides.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-20 pointer-events-none">
          <button
            onClick={() => paginate(-1)}
            className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md pointer-events-auto"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => paginate(1)}
            className="p-4 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all backdrop-blur-md pointer-events-auto"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Dots & Progress */}
      {showDots && heroSlides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3 items-center">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className="group relative py-2"
            >
              <div className={`h-1.5 transition-all duration-500 rounded-full ${
                idx === currentSlide ? 'w-12 bg-primary' : 'w-4 bg-white/20 group-hover:bg-white/40'
              }`} />
            </button>
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      {showScrollIndicator && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-2 opacity-40"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </motion.div>
      )}
    </section>
  );
}