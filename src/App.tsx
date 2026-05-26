import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MapPin, 
  X, 
  Menu, 
  ArrowRight, 
  Settings, 
  Code, 
  Sliders, 
  Download, 
  Copy, 
  RotateCcw, 
  Check, 
  Map, 
  Play, 
  Pause,
  Compass,
  ArrowUpRight,
  Sparkles,
  Info,
  Layers,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building,
  CheckCircle2,
  Trash2,
  Plus
} from "lucide-react";
import defaultContent from "./data/content.json";
import { LandingContent, TestimonialItem, PressItem } from "./types";

const getFallbackImage = (path: string): string => {
  if (!path) return "";
  const filename = path.split("/").pop() || path;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#f4f6f5"/>
    <rect x="20" y="20" width="560" height="410" rx="8" fill="none" stroke="#d1ded8" stroke-width="1.5" stroke-dasharray="8 6"/>
    <g transform="translate(300, 200)" textAnchor="middle">
      {/* Elegantly styled simple line-art house blueprint */}
      <path d="M-30,20 L-30,-15 L0,-40 L30,-15 L30,20 Z" fill="none" stroke="#154736" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-10,20 L-10,3 L10,3 L10,20" fill="none" stroke="#154736" stroke-width="2"/>
      <circle cx="0" cy="-18" r="4.5" fill="none" stroke="#154736" stroke-width="1.5"/>
      <line x1="-45" y1="20" x2="45" y2="20" stroke="#154736" stroke-width="2"/>
      
      {/* Text labels styled with luxury palette */}
      <text y="65" font-family="'Inter', system-ui, sans-serif" font-size="14" font-weight="600" fill="#154736" letter-spacing="1.5">${filename}</text>
      <text y="90" font-family="'Inter', system-ui, sans-serif" font-size="11" font-weight="500" fill="#708a7e" letter-spacing="0.5">Empty Render Placeholder</text>
      <text y="115" font-family="'Inter', system-ui, sans-serif" font-size="10" fill="#8fa499" letter-spacing="0.2">Place your 3D render at /public/assets/renders/${filename}</text>
    </g>
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

const renderPressLogo = (publicationName: string) => {
  let src = "";
  switch (publicationName) {
    case "Esquire India":
      src = "https://www.logo.wine/a/logo/Esquire_(magazine)/Esquire_(magazine)-Logo.wine.svg";
      break;
    case "The Economic Times":
      src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/The_Economic_Times_logo.svg/3840px-The_Economic_Times_logo.svg.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=thumbnail";
      break;
    case "Times Entertainment":
      src = "https://kitesseniorcare.com/wp-content/uploads/2025/11/Logo-1.png";
      break;
    case "Bazaar":
      src = "https://upload.wikimedia.org/wikipedia/commons/f/f4/Harper%27s_Bazaar_Logo.jpg";
      break;
    case "Financial Express":
      src = "https://upload.wikimedia.org/wikipedia/en/thumb/0/07/The_Financial_Express_%28India%29_Logo.svg/3840px-The_Financial_Express_%28India%29_Logo.svg.png";
      break;
    case "Outlook Luxe":
      src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDN_gFG4xBDvgeIGReQW5awDb4873Fgfir6A&s";
      break;
    case "Architectural Digest":
      src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Architectural_Digest_icon.svg/250px-Architectural_Digest_icon.svg.png";
      break;
    case "Business Standard":
      src = "https://bsmedia.business-standard.com/_media/bs/img/author/thumb/bs-web-team-2105.png";
      break;
    case "The Daily Guardian":
      src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKV_pNd1bTUK09fB2B15pRy--y-XHHBSMJwg&s";
      break;
  }

  if (src) {
    return (
      <img
        id={`press-logo-${publicationName.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}
        src={src}
        alt={`${publicationName} Logo`}
        referrerPolicy="no-referrer"
        className="max-h-[38px] sm:max-h-[44px] max-w-[170px] w-auto h-auto object-contain select-none opacity-85 group-hover:opacity-100 transition-opacity duration-300 mix-blend-multiply"
      />
    );
  }

  return <span className="font-serif font-bold text-xs tracking-widest">{publicationName}</span>;
};

export default function App() {
  // --- Content State initialized with local storage persistence ---
  const [content, setContent] = useState<LandingContent>(() => {
    const saved = localStorage.getItem("la_isla_custom_content");
    const lastDefault = localStorage.getItem("la_isla_last_default_content");
    const currentDefaultStr = JSON.stringify(defaultContent);

    // If defaultContent has changed in the codebase, override the saved local storage state 
    // so developer file edits are immediately visible in the live preview.
    if (lastDefault !== currentDefaultStr) {
      localStorage.setItem("la_isla_last_default_content", currentDefaultStr);
      localStorage.setItem("la_isla_custom_content", currentDefaultStr);
      return defaultContent as LandingContent;
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Force sync renders and testimonials to always match content.json so developer edits aren't cached
        if (parsed.projectInfo) {
          parsed.projectInfo.renders = defaultContent.projectInfo.renders;
        }
        if (parsed.testimonials) {
          parsed.testimonials = defaultContent.testimonials;
        }
        if (parsed.press) {
          parsed.press = defaultContent.press;
        }
        return parsed as LandingContent;
      } catch (e) {
        console.error("Failed to parse saved content, falling back to defaults", e);
      }
    }
    return defaultContent as LandingContent;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem("la_isla_custom_content", JSON.stringify(content));
  }, [content]);

  // Restores standard preset values
  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to reset all contents to the default La Isla design defaults?")) {
      setContent(defaultContent as LandingContent);
      setRawEditorText(JSON.stringify(defaultContent, null, 2));
      localStorage.removeItem("la_isla_custom_content");
    }
  };

  // --- Active Section State ---
  const [activeSection, setActiveSection] = useState("hero");
  const [isNavDark, setIsNavDark] = useState(true);

  // --- UI Interactivity States ---
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [formSource, setFormSource] = useState<"enquire" | "modal" | "footer">("modal");
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    villa: "2 BHK"
  });
  const [formSubmitted, setFormSubmitted] = useState<string | null>(null);

  // Map Interactive Pin Hover state
  const [activeMapPin, setActiveMapPin] = useState<number | null>(null);

  // Active Clubhouse Pillar detail popup
  const [activePillar, setActivePillar] = useState<number | null>(null);

  // Interactive Renders category selector
  const [activeRenderTab, setActiveRenderTab] = useState<string>("2 BHK");
  
  // Custom fullscreen Lightbox for BHK renders
  const [lightboxImage, setLightboxImage] = useState<{ image: string; label: string } | null>(null);

  // Testimonials section slideshow and video player states
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const testimonialVideoRef = useRef<HTMLVideoElement>(null);

  // Press Highlight index state and auto rotation interval of 7.5 seconds
  const [activePressIdx, setActivePressIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (content.press && content.press.items && content.press.items.length > 0) {
        setActivePressIdx((prev) => (prev + 1) % content.press.items.length);
      }
    }, 7500);
    return () => clearInterval(interval);
  }, [content.press?.items?.length]);

  // Video Background Control state
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- AI Studio Dynamic Theme Customizer Panel States ---
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerTab, setCustomizerTab] = useState<"visual" | "json" | "guide">("visual");
  const [rawEditorText, setRawEditorText] = useState(() => JSON.stringify(content, null, 2));
  const [jsonValidationError, setJsonValidationError] = useState<string | null>(null);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [activeEditSection, setActiveEditSection] = useState<string>("general");

  // Track dynamic navigation theme (on-dark vs light) upon scrolling
  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero");
      const aboutEl = document.getElementById("about");
      const loliemEl = document.getElementById("loliem");
      const mapEl = document.getElementById("map");
      const projectEl = document.getElementById("project");
      const testimonialsEl = document.getElementById("testimonials");
      const pressEl = document.getElementById("press");

      const scrollPos = window.scrollY + 200;

      if (heroEl && scrollPos >= heroEl.offsetTop && scrollPos < (aboutEl?.offsetTop || Infinity)) {
        setActiveSection("hero");
        setIsNavDark(true);
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop && scrollPos < (loliemEl?.offsetTop || Infinity)) {
        setActiveSection("about");
        setIsNavDark(false);
      } else if (loliemEl && scrollPos >= loliemEl.offsetTop && scrollPos < (mapEl?.offsetTop || Infinity)) {
        setActiveSection("loliem");
        setIsNavDark(false);
      } else if (mapEl && scrollPos >= mapEl.offsetTop && scrollPos < (projectEl?.offsetTop || Infinity)) {
        setActiveSection("map");
        setIsNavDark(false);
      } else if (projectEl && scrollPos >= projectEl.offsetTop && scrollPos < (testimonialsEl?.offsetTop || Infinity)) {
        setActiveSection("project");
        setIsNavDark(false);
      } else if (testimonialsEl && scrollPos >= testimonialsEl.offsetTop && scrollPos < (pressEl?.offsetTop || Infinity)) {
        setActiveSection("testimonials");
        setIsNavDark(false);
      } else if (pressEl && scrollPos >= pressEl.offsetTop) {
        setActiveSection("press");
        setIsNavDark(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update raw editor text whenever content state updates from visual inputs
  useEffect(() => {
    setRawEditorText(JSON.stringify(content, null, 2));
  }, [content]);

  // Handle Raw JSON updates
  const handleApplyRawJson = () => {
    try {
      const parsed = JSON.parse(rawEditorText);
      setContent(parsed);
      setJsonValidationError(null);
      alert("✅ JSON applied successfully! Visual elements updated.");
    } catch (e: any) {
      setJsonValidationError(e.message || "Invalid JSON syntax");
    }
  };

  // Trigger browser download of customized JSON
  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "content.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy updated JSON text to clipboard
  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  // Play / Pause video background
  const toggleVideoPlayback = () => {
    if (videoRef.current) {
      if (isHeroVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsHeroVideoPlaying(!isHeroVideoPlaying);
    }
  };

  // Handle lead inquiries
  const handleFormSubmit = (e: React.FormEvent, source: "enquire" | "modal" | "footer") => {
    e.preventDefault();
    setFormSubmitted(source);
    console.log(`[Lead Capture - Source: ${source}]`, leadFormData);
    // Auto reset form states after brief view
    setTimeout(() => {
      setFormSubmitted(null);
      setLeadFormData({ name: "", email: "", phone: "", location: "", villa: "2 BHK" });
      if (source === "modal") {
        setIsLeadModalOpen(false);
      }
    }, 4000);
  };

  // Scroll anchor helper
  const scrollToAnchor = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsSideMenuOpen(false);
  };

  // Helper inside visual customizer to update nested content fields
  const updateContentField = (section: string, field: string | number, value: any, nestedField?: string) => {
    setContent(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      if (nestedField) {
        clone[section][field][nestedField] = value;
      } else {
        clone[section][field] = value;
      }
      return clone;
    });
  };  return (
    <div className="relative min-h-screen bg-brand-cream overflow-x-hidden selection:bg-green-brand selection:text-white transition-all duration-300">
      
      {/* ==================== UPPER LOGO HEADER ==================== */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300 ${activeSection !== 'hero' ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-line/30' : 'bg-transparent'}`}>
        <div className="flex items-center gap-3">
          {/* Mobile Menu Trigger (only shown on mobile screens < md) */}
          <button 
            onClick={() => setIsSideMenuOpen(true)}
            className="md:hidden flex w-10 h-10 items-center justify-center -ml-2 text-[#154736] focus:outline-none bg-transparent group cursor-pointer hover:scale-105 transition-transform duration-200"
            aria-label="Open menu"
          >
            <Menu className={`w-6 h-6 stroke-[1.5] transition-all duration-300 ${activeSection === 'hero' ? 'text-white' : 'text-[#154736]'}`} />
          </button>

          <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); scrollToAnchor("hero"); }}>
            <img 
              src={content.site.logo} 
              alt={content.site.logoAlt} 
              className={`h-11 md:h-14 w-auto transition-all duration-300 ${activeSection === 'hero' ? 'brightness-0 invert' : 'brightness-95 contrast-100'}`} 
            />
          </a>
        </div>

        <div>
          <button 
            onClick={() => { setFormSource("enquire"); setIsLeadModalOpen(true); }}
            className={`inline-flex items-center justify-center border px-5 py-2 text-xs font-normal tracking-[2.5px] uppercase transition-all duration-300 rounded-[3px] ${
              activeSection === 'hero' 
                ? 'border-white/60 text-white hover:bg-white/10' 
                : 'border-[#154736]/40 text-[#154736] hover:bg-[#154736]/5'
            }`}
          >
            ENQUIRE
          </button>
        </div>
      </header>
 
      {/* ==================== SIDE NAVIGATION (RAIL & PANEL) ==================== */}
      <div className="fixed left-0 top-0 bottom-0 z-50 flex pointer-events-none" aria-label="Page Sections">
        
        {/* Transparent Left Rail which contains trigger button and the 7 pagination dots (Hidden on mobile < md to prevent overlapping content) */}
        <div className="hidden md:flex w-[100px] flex-col items-center justify-start pt-[120px] pointer-events-auto h-full pr-4">
          
          {/* Menu Toggle Trigger */}
          {!isSideMenuOpen ? (
            <button 
              onClick={() => setIsSideMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center focus:outline-none bg-transparent group cursor-pointer hover:scale-105 transition-transform duration-200"
              aria-label="Open menu"
            >
              <Menu className={`w-5 h-5 stroke-[1.5] transition-all duration-300 ${isNavDark ? 'text-white' : 'text-[#154736]'}`} />
            </button>
          ) : (
            <button 
              onClick={() => setIsSideMenuOpen(false)}
              className="w-10 h-10 flex items-center justify-center text-white/90 hover:text-white transition-all focus:outline-none cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </button>
          )}
 
          {/* Dots column matching all 7 sections */}
          <div className="flex flex-col gap-6 mt-[60px] items-center">
            {[
              { id: "hero", label: "La Isla" },
              { id: "about", label: "About Vianaar" },
              { id: "loliem", label: "Loliem" },
              { id: "map", label: "Our project on the map" },
              { id: "project", label: "About the project" },
              { id: "testimonials", label: "Testimonials" },
              { id: "press", label: "Press Highlights" }
            ].map((item, index) => {
              const isActive = activeSection === item.id;
              const isDarkTheme = isSideMenuOpen || isNavDark;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToAnchor(item.id)}
                  className="group relative flex items-center justify-center p-1"
                  title={item.label}
                >
                  <span 
                    className={`block rounded-full transition-all duration-300 ${
                      isActive 
                        ? 'w-[7px] h-[7px] scale-125 ' + (isDarkTheme ? 'bg-white' : 'bg-[#154736]')
                        : 'w-1 h-1 ' + (isDarkTheme ? 'bg-white/35 hover:bg-white/80' : 'bg-[#154736]/25 hover:bg-[#154736]/60')
                    }`} 
                  />
                  <span className="absolute left-8 scale-0 group-hover:scale-100 bg-[#231F20] text-white font-sans text-[10px] uppercase tracking-widest px-2.5 py-1.5 rounded shadow-lg pointer-events-none transition-all origin-left truncate max-w-[150px] z-50">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
 
        {/* Sliding Side Navigation Panel in Pine Green (exactly as in Image 2) */}
        <div 
          className={`fixed left-0 top-0 bottom-0 w-full max-w-[360px] bg-[#154736] text-white flex flex-col pointer-events-auto shadow-2xl transition-transform duration-500 z-40 ease-out ${
            isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile-only Close Button inside the navigation panel (since left rail and its close button are hidden on mobile) */}
          <button 
            onClick={() => setIsSideMenuOpen(false)}
            className="md:hidden absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white bg-white/5 active:bg-white/10 rounded-full transition-all focus:outline-none cursor-pointer z-50"
            aria-label="Close menu"
          >
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>

          <div className="flex flex-col h-full pt-[120px] pb-12 pr-6 pl-12 justify-between">
            <div>
              {/* Site Eyebrow */}
              <p className="font-sans text-[10px] sm:text-[11px] text-[#8fa499] uppercase tracking-[3px] mb-12">
                La Isla — Loliem, South Goa
              </p>
              
              {/* Ordered Links List with Custom Numbers */}
              <ol className="flex flex-col gap-6">
                {[
                  { num: "01", label: "La Isla", id: "hero" },
                  { num: "02", label: "About Vianaar", id: "about" },
                  { num: "03", label: "Loliem", id: "loliem" },
                  { num: "04", label: "Our project on the map", id: "map" },
                  { num: "05", label: "About the project", id: "project" },
                  { num: "06", label: "Testimonials", id: "testimonials" },
                  { num: "07", label: "Press Highlights", id: "press" }
                ].map((navItem, index) => {
                  const isActive = activeSection === navItem.id;
                  return (
                    <li key={index} className="group">
                      <button 
                        onClick={() => scrollToAnchor(navItem.id)}
                        className="flex items-baseline gap-6 sm:gap-8 font-serif text-left group-hover:translate-x-1.5 transition-all text-white focus:outline-none"
                      >
                        <span className="font-sans text-[10px] sm:text-xs text-[#4D8F75] font-semibold w-6 shrink-0">
                          {navItem.num}
                        </span>
                        <span className={`font-serif text-[24px] sm:text-[28px] font-normal leading-tight tracking-wide transition-colors ${
                          isActive ? 'text-[#ebe7df]' : 'text-white/80 group-hover:text-white'
                        }`}>
                          {navItem.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Side Navigation Footer */}
            <div className="pt-8 border-t border-white/5 text-white/40">
              <p className="font-sans text-[9px] uppercase tracking-widest mb-1">Vianaar Luxury Residences</p>
              <p className="font-serif italic text-xs text-[#8fa499]">"A New Expression of Living"</p>
            </div>
          </div>
        </div>

      </div>

      {/* Backdrop shade overlay active on side drawer (NO BLUR as per instruction) */}
      {isSideMenuOpen && (
        <div 
          onClick={() => setIsSideMenuOpen(false)}
          className="fixed inset-0 bg-black/15 pointer-events-auto z-30 transition-opacity duration-300" 
        />
      )}

      {/* ==================== CORE BANNER / HERO SECTION ==================== */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 md:px-12 bg-[#8ba295] overflow-hidden"
      >
        {/* Dynamic Continuous Video Background */}
        {content.hero.videoSrc ? (
          <video 
            ref={videoRef}
            key={content.hero.videoSrc}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.55] scale-100 transition-all duration-300" 
            autoPlay 
            muted 
            loop 
            playsInline
            poster={content.hero.posterSrc}
          >
            <source src={content.hero.videoSrc} type="video/mp4" />
          </video>
        ) : (
          <img 
            src={content.hero.bgImg} 
            alt="Goa landscape background placeholder" 
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-40" 
          />
        )}
        
        {/* Ambient Subtle Green Shade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#8ba295]/25 via-[#8ba295]/10 to-[#8ba295]/45 z-10" />

        <div className="container mx-auto z-20 w-full relative pl-0 md:pl-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Hero details column exactly matching Image 1 layout style */}
            <div className="lg:col-span-6 text-white text-left max-w-xl flex flex-col justify-center">
              <span className="block font-sans text-[11px] uppercase tracking-[4.5px] text-[#ebe7df] mb-4 font-normal">
                {content.hero.eyebrow}
              </span>
              
              <h1 className="font-serif text-4xl sm:text-7xl md:text-[88px] font-normal leading-[1.05] tracking-tight mb-8 text-white">
                {content.hero.title}
              </h1>

              <div className="space-y-4">
                <p className="font-serif italic text-lg sm:text-xl md:text-[25px] text-white/95 leading-normal">
                  {content.hero.tag}
                </p>
                <p className="font-sans text-[11px] text-[#ebe7df] uppercase tracking-[4px] font-light">
                  {content.hero.location}
                </p>
              </div>

              {/* Minimal video play controls toggle */}
              {content.hero.videoSrc && (
                <button 
                  onClick={toggleVideoPlayback}
                  className="mt-12 self-start inline-flex items-center gap-2 bg-black/15 hover:bg-black/30 border border-white/10 text-[9px] uppercase tracking-[2.5px] font-sans px-3.5 py-1.5 rounded-[3px] transition-all"
                >
                  {isHeroVideoPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-white" />}
                  <span>{isHeroVideoPlaying ? "Pause Video" : "Play Video"}</span>
                </button>
              )}
            </div>

            {/* Premium Frosted glass Inquire form exactly matching Image 1 container look */}
            <div className="lg:col-span-6 flex justify-center lg:justify-end" id="enquire-lead-form">
              <div className="bg-[#8ca89a]/35 backdrop-blur-md border border-white/15 rounded-[12px] p-8 md:p-10 shadow-lg w-full max-w-[450px]">
                
                <AnimatePresence mode="wait">
                  {formSubmitted === "enquire" ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-12 flex flex-col items-center"
                    >
                      <div className="w-16 h-16 bg-white/20 border border-white/40 text-white flex items-center justify-center rounded-full mb-6">
                        <Check className="w-8 h-8" />
                      </div>
                      <h4 className="font-serif text-2xl text-white mb-2">Thank you!</h4>
                      <p className="font-sans text-sm text-white/80 leading-relaxed">
                        We have successfully logged your enquiry. Our relationship manager will reach out within the next 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={(e) => handleFormSubmit(e, "enquire")} className="space-y-4">
                      
                      <div>
                        <label className="block text-[10px] uppercase tracking-[2px] font-sans text-white/90 mb-1.5 font-normal">Name</label>
                        <input
                          type="text"
                          required
                          value={leadFormData.name}
                          onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                          className="w-full bg-[#f2f5f3]/95 text-[#231F20] outline-none px-4 py-3 text-sm rounded-[4px] border border-white/10 focus:bg-white transition-all placeholder:text-[#231F20]/40"
                          placeholder="Your Name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[2px] font-sans text-white/90 mb-1.5 font-normal">Email</label>
                          <input
                            type="email"
                            required
                            value={leadFormData.email}
                            onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                            className="w-full bg-[#f2f5f3]/95 text-[#231F20] outline-none px-4 py-3 text-sm rounded-[4px] border border-white/10 focus:bg-white transition-all placeholder:text-[#231F20]/40"
                            placeholder="Email Address"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[2px] font-sans text-white/90 mb-1.5 font-normal">Phone</label>
                          <input
                            type="tel"
                            required
                            value={leadFormData.phone}
                            onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                            className="w-full bg-[#f2f5f3]/95 text-[#231F20] outline-none px-4 py-3 text-sm rounded-[4px] border border-white/10 focus:bg-white transition-all placeholder:text-[#231F20]/40"
                            placeholder="Phone Number"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-[2px] font-sans text-white/90 mb-1.5 font-normal">Location</label>
                          <input
                            type="text"
                            value={leadFormData.location}
                            onChange={(e) => setLeadFormData({ ...leadFormData, location: e.target.value })}
                            className="w-full bg-[#f2f5f3]/95 text-[#231F20] outline-none px-4 py-3 text-sm rounded-[4px] border border-white/10 focus:bg-white transition-all placeholder:text-[#231F20]/40"
                            placeholder="Your City"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-[2px] font-sans text-white/90 mb-1.5 font-normal">Preferred villa</label>
                          <div className="relative">
                            <select
                              value={leadFormData.villa}
                              onChange={(e) => setLeadFormData({ ...leadFormData, villa: e.target.value })}
                              className="w-full bg-[#f2f5f3]/95 text-[#231F20] outline-none pr-8 pl-4 py-3 text-sm rounded-[4px] border border-white/10 focus:bg-white transition-all appearance-none cursor-pointer"
                            >
                              <option value="2 BHK">2 BHK Villa</option>
                              <option value="3 BHK">3 BHK Villa</option>
                              <option value="4 BHK">4 BHK Villa</option>
                            </select>
                            {/* SVG Arrow icon */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#231F20]">
                              <svg className="w-4 h-4 fill-none stroke-current stroke-1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-4 bg-[#135036] hover:bg-[#0d3c26] text-white text-xs uppercase tracking-[2.5px] py-4 rounded-[4px] font-semibold transition-all flex items-center justify-center shadow"
                      >
                        SUBMIT →
                      </button>
                    </form>
                  )}
                </AnimatePresence>
                
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== ABOUT VIANAAR ==================== */}
      <section id="about" className="py-24 px-6 md:px-12 bg-brand-cream border-b border-brand-line/40">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            
            <span className="font-sans text-xs uppercase tracking-[4px] text-green-brand mb-3">{content.hero.eyebrow}</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-ink">
              {content.about.title}
            </h2>
            
            {/* Visual separator rule */}
            <div className="w-16 h-0.5 bg-green-brand my-6" />

            <div className="space-y-6 max-w-2xl text-brand-muted font-sans text-lg md:text-xl font-light leading-relaxed">
              {content.about.paragraphs.map((p, index) => (
                <p key={index}>{p}</p>
              ))}
            </div>

            {/* Mini Legacy Counter Row */}
            <div className="grid grid-cols-3 gap-6 md:gap-16 mt-16 pt-12 border-t border-brand-line/40 w-full max-w-2xl">
              <div>
                <span className="block font-serif text-4xl md:text-5xl text-green-brand mb-1">15+</span>
                <span className="block font-sans text-[11px] uppercase tracking-wider text-brand-muted">Years Active</span>
              </div>
              <div>
                <span className="block font-serif text-4xl md:text-5xl text-green-brand mb-1">100+</span>
                <span className="block font-sans text-[11px] uppercase tracking-wider text-brand-muted">Bespoke Projects</span>
              </div>
              <div>
                <span className="block font-serif text-4xl md:text-5xl text-green-brand mb-1">1,200+</span>
                <span className="block font-sans text-[11px] uppercase tracking-wider text-brand-muted">Happy Homeowners</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== LOLIEM PROMO BLOCK ==================== */}
      <section id="loliem" className="py-28 px-6 md:px-12 bg-brand-sage text-center text-brand-ink relative overflow-hidden">
        
        {/* Subtle decorative vector backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] border border-green-brand/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-green-brand/10 rounded-full border-dashed pointer-events-none" />

        <div className="container mx-auto max-w-3xl relative z-10 flex flex-col items-center">
          <p className="font-sans text-[11px] uppercase tracking-[4px] text-green-brand mb-4">
            {content.loliem.eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-6xl italic font-normal text-brand-ink leading-tight mb-6">
            {content.loliem.title}
          </h2>
          
          <div className="w-16 h-0.5 bg-green-brand my-6" />

          <div className="space-y-4 max-w-2xl text-brand-muted font-sans text-lg md:text-xl font-light leading-relaxed">
            {content.loliem.paragraphs.map((p, index) => (
              <p key={index}>{p}</p>
            ))}
          </div>

          <div className="mt-12">
            <Compass className="w-10 h-10 text-green-brand/70 animate-spin" style={{ animationDuration: '25s' }} />
          </div>
        </div>
      </section>

      {/* ==================== OUR PROJECT ON THE MAP (GEOGRAPHY) ==================== */}
      <section id="map" className="py-24 px-6 md:px-12 bg-brand-cream border-b border-brand-line/40">
        <div className="container mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-serif text-4xl md:text-[54px] font-normal text-brand-ink tracking-tight mb-4">
              {content.mapSection.title}
            </h2>
            <div className="w-12 h-[2px] bg-green-brand mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
            
            {/* Left Column: Vertical Rounded Map Frame matching pixel-perfect ratio */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative bg-[#F1EBE0] rounded-[10px] overflow-hidden shadow-md w-full max-w-[340px] aspect-[31/55] border border-brand-line/40">
                <img 
                  src={content.mapSection.mapImage} 
                  alt="La Isla — Loliem Neighborhood map" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Column: Distance parameters flat list with solid green circle badges exactly as in screenshot */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-0 border-t border-brand-line/60">
                {content.mapSection.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-5 py-6 border-b border-brand-line/60"
                  >
                    {/* Perfect Solid Green Circle with White Number */}
                    <div 
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#226F56] text-white flex items-center justify-center font-sans text-sm md:text-base font-normal flex-shrink-0 shadow-sm"
                    >
                      {item.id}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-sans font-normal text-[#231F20] text-lg md:text-[20px] tracking-wide leading-tight">
                        {item.place}
                      </h4>
                      <p className="font-sans text-xs md:text-sm text-[#6E7269] font-light mt-1.5">
                        {item.meta}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== THE ESTATE SPECIFICATION & DESIGN HIGHLIGHTS ==================== */}
      <section id="project" className="py-24 px-6 md:px-12 bg-brand-sage relative overflow-hidden">
        
        {/* Subtle decorative bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-brand-line/10 to-transparent pointer-events-none" />

        <div className="container mx-auto">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="font-sans text-xs uppercase tracking-[4px] text-green-brand block mb-2">Sustainable Elegance</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-ink">
              {content.projectInfo.title}
            </h2>
            <div className="w-16 h-0.5 bg-green-brand mx-auto my-5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            {/* Highlights List box */}
            <div className="bg-brand-cream/80 border border-brand-line/45 rounded-2xl p-8 shadow-md">
              <h3 className="font-sans text-xs uppercase tracking-[4px] text-green-brand font-semibold mb-8 border-b border-brand-line/40 pb-4">
                {content.projectInfo.highlights.title}
              </h3>
              
              <ul className="space-y-4">
                {content.projectInfo.highlights.items.map((highlight, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4 items-start"
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-brand flex-shrink-0 mt-0.5" />
                    <span className="font-sans text-brand-ink font-light leading-relaxed">{highlight}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Loom House Pillars Card view */}
            <div className="space-y-6">
              <div className="bg-brand-cream/40 p-6 rounded-2xl border border-brand-line/30 mb-2">
                <span className="font-sans text-[10px] text-green-brand font-semibold uppercase tracking-[3px] block mb-2">Exclusive Clubhouse</span>
                <h3 className="font-serif text-3xl text-brand-ink font-light mb-4">
                  {content.projectInfo.clubhouse.title}
                </h3>
                <p className="font-sans font-light text-brand-muted leading-relaxed text-base">
                  {content.projectInfo.clubhouse.description}
                </p>
              </div>

              {/* 4 Pillars Interactive Layout list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.projectInfo.clubhouse.pillars.map((pillar, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePillar(activePillar === index ? null : index)}
                    className={`text-left p-6 rounded-xl border transition-all duration-300 relative overflow-hidden group cursor-pointer ${activePillar === index ? 'bg-green-brand text-white border-green-brand shadow-lg' : 'bg-brand-cream border-brand-line/50 hover:bg-brand-sand'}`}
                  >
                    {/* Tiny background glow pattern on active/hover */}
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-green-soft/10 rounded-full group-hover:scale-150 transition-all duration-500" />
                    
                    <h4 className={`font-sans font-bold text-sm tracking-widest uppercase mb-2 ${activePillar === index ? 'text-green-soft' : 'text-green-brand'}`}>
                      {pillar.heading}
                    </h4>
                    <p className={`font-sans font-light text-xs leading-relaxed ${activePillar === index ? 'text-white/90' : 'text-brand-muted'}`}>
                      {pillar.description}
                    </p>
                    
                    <div className="mt-4 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest text-green-brand border-t border-brand-line/20 pt-3 group-hover:text-green-dark">
                      <span className={activePillar === index ? 'text-white/60' : 'text-brand-muted'}>
                        {activePillar === index ? "Click to collapse" : "Find out more"}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-300 ${activePillar === index ? 'rotate-90 text-white' : 'text-green-brand group-hover:translate-x-1'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ==================== 3D PROJECT RENDERS CATEGORIES ==================== */}
          <div className="mt-24 pt-16 border-t border-brand-line/40">
            <h3 className="font-serif text-3xl font-light text-brand-ink text-center mb-4">
              {content.projectInfo.renders.title}
            </h3>
            
            {/* Horizontal Tabs selector */}
            <div className="flex items-center justify-center gap-3 mb-12">
              {content.projectInfo.renders.categories.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveRenderTab(tab.name)}
                  className={`px-6 py-2.5 rounded-full font-sans text-xs font-semibold tracking-widest uppercase cursor-pointer transition-all duration-200 ${activeRenderTab === tab.name ? 'bg-green-brand text-white shadow-md' : 'bg-brand-cream border border-brand-line/60 hover:bg-brand-sand text-brand-ink'}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Renders Grid Viewer */}
            <div>
              {content.projectInfo.renders.categories.map((category) => (
                category.name === activeRenderTab && (
                  <motion.div 
                    key={category.name}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                  >
                    {category.items.map((renderItem, rIdx) => (
                      <div 
                        key={rIdx}
                        onClick={() => setLightboxImage({ image: renderItem.image, label: `${category.name} — ${renderItem.label}` })}
                        className="bg-brand-cream border border-brand-line/50 rounded-xl overflow-hidden group cursor-pointer shadow hover:shadow-xl transition-all duration-300"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-brand-sand">
                          <img 
                            src={renderItem.image} 
                            alt={renderItem.label} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={(e) => {
                              const fallback = getFallbackImage(renderItem.image);
                              if (e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-brand-ink/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 backdrop-blur text-brand-ink font-sans text-xs uppercase tracking-widest px-4 py-2 rounded shadow-md flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5" />
                              View Render Large
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-brand-cream border-t border-brand-line/30 flex items-center justify-between">
                          <span className="font-sans font-medium text-brand-ink text-sm uppercase tracking-wider">{renderItem.label}</span>
                          <span className="text-[10px] text-green-brand font-semibold uppercase tracking-widest bg-brand-sage py-1 px-2.5 rounded-full">
                            {category.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* ==================== CLIENT TESTIMONIALS ==================== */}
      {content.testimonials.isVisible && (
        <section id="testimonials" className="py-24 px-6 md:px-12 bg-brand-cream border-b border-brand-line/45">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Testimonial Video Player */}
              <div className="lg:col-span-7 w-full aspect-[16/10] sm:aspect-[16/9] rounded-2xl overflow-hidden relative shadow-xl group bg-[#154736]/10 border border-brand-line/30">
                {isVideoPlaying ? (
                  <video
                    ref={testimonialVideoRef}
                    src="/assets/videos/testimonial_video.mp4"
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    onError={(e) => {
                      // Fallback gracefully to the header video if they haven't uploaded theirs yet
                      console.log("Testimonial video not uploaded yet, playing fallback hero video.");
                      e.currentTarget.src = "/assets/video/header-south-goa.mp4";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200"
                      alt="Vianaar Goa Luxury Life"
                      className="w-full h-full object-cover transition-transform duration-[1.2s] group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {/* Dark contrast gradient */}
                    <div className="absolute inset-0 bg-brand-ink/10 transition-opacity duration-300 group-hover:bg-brand-ink/5" />
                    
                    {/* Semi-transparent Play Button Overlay matching reference image */}
                    <button
                      onClick={() => setIsVideoPlaying(true)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#4D8F75]/80 hover:bg-[#154736]/90 text-white flex items-center justify-center backdrop-blur-[2px] shadow-2xl transition-all duration-300 scale-95 hover:scale-100 cursor-pointer border border-white/20"
                      aria-label="Play Testimonial Video"
                    >
                      <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white translate-x-[2px]" />
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Active Review Slider (Centered vertically) */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full min-h-[320px] lg:pl-4">
                <div>
                  {/* Top line accent matching Vianaar branding in reference image */}
                  <div className="w-full h-[1.5px] bg-[#4D8F75]/35 mb-8" />
                  
                  {/* Text slider using Motion for buttery smooth transitions */}
                  <div className="relative min-h-[160px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTestimonialIdx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                      >
                        <p className="font-serif text-[#154736] text-[18px] sm:text-[21px] leading-relaxed font-light mb-8">
                          “{content.testimonials.items[activeTestimonialIdx]?.quote || ""}”
                        </p>
                        
                        <div className="mt-4">
                          <h4 className="font-sans font-bold text-[#154736] text-[15px] sm:text-[16px] tracking-wide uppercase">
                            {content.testimonials.items[activeTestimonialIdx]?.author || ""}
                          </h4>
                          <p className="font-sans text-[12px] sm:text-[13px] text-brand-muted/80 mt-1 italic tracking-wide">
                            {content.testimonials.items[activeTestimonialIdx]?.designation || ""}
                          </p>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                {/* Pagination Dots at the bottom matching reference screenshot */}
                <div className="flex items-center gap-3.5 mt-8">
                  {content.testimonials.items.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTestimonialIdx(idx);
                        setIsVideoPlaying(false);
                      }}
                      className={`w-[8.5px] h-[8.5px] rounded-full transition-all duration-300 cursor-pointer ${
                        activeTestimonialIdx === idx 
                          ? 'bg-[#154736] scale-115' 
                          : 'bg-[#4D8F75]/35 hover:bg-[#4D8F75]/75'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
                
              </div>

            </div>
          </div>
        </section>
      )}

      {/* ==================== PRESS HIGHLIGHTS ==================== */}
      {content.press.isVisible && (
        <section id="press" className="py-24 px-6 md:px-12 bg-brand-sage overflow-hidden">
          <div className="container mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="font-sans text-xs uppercase tracking-[4px] text-green-brand block mb-2">Featured Press Coverage</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-ink">
                {content.press.title}
              </h2>
              <div className="w-16 h-0.5 bg-green-brand/40 mx-auto my-5" />
            </div>

            {/* Slider Container with Arrows inside a gorgeous, wide frame */}
            <div className="relative max-w-5xl mx-auto px-12 md:px-16">
              
              {/* Manual Nav Arrows overlapping the left and right gutters */}
              <button
                onClick={() => {
                  setActivePressIdx((prev) => (prev === 0 ? content.press.items.length - 1 : prev - 1));
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-brand-cream/90 hover:bg-white text-[#154736] flex items-center justify-center shadow-md border border-brand-line/50 hover:scale-105 transition-all backdrop-blur-[4px] cursor-pointer"
                aria-label="Previous Press Coverage"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2]" />
              </button>

              <button
                onClick={() => {
                  setActivePressIdx((prev) => (prev + 1) % content.press.items.length);
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-brand-cream/90 hover:bg-white text-[#154736] flex items-center justify-center shadow-md border border-brand-line/50 hover:scale-105 transition-all backdrop-blur-[4px] cursor-pointer"
                aria-label="Next Press Coverage"
              >
                <ChevronRight className="w-5 h-5 stroke-[2]" />
              </button>

              {/* Viewport mask */}
              <div className="w-full overflow-hidden py-4">
                {/* Horizontal slider ribbon of logos */}
                <div 
                  className="flex flex-row items-center gap-6 md:gap-8 transition-transform duration-500 ease-out"
                  style={{
                    transform: `translateX(calc(50% - ${activePressIdx * (220 + 24) + (220 / 2)}px))`
                  }}
                >
                  {content.press.items.map((item, idx) => {
                    const isActive = activePressIdx === idx;
                    return (
                      <a
                        href={item.link}
                        key={item.id}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex-shrink-0 w-[220px] h-[76px] md:h-[86px] rounded-xl flex items-center justify-center border transition-all duration-300 group cursor-pointer ${
                          isActive
                            ? 'bg-brand-cream border-[#154736] shadow-md scale-105 text-[#154736]'
                            : 'bg-brand-cream/40 border-brand-line/30 text-[#154736]/35 hover:bg-brand-cream/70 hover:text-[#154736]/70 hover:border-brand-line/60'
                        }`}
                        title={`Read cover article from ${item.publication}`}
                        onClick={(e) => {
                          // Allow direct click navigation only if already centered, else center it
                          if (!isActive) {
                            e.preventDefault();
                            setActivePressIdx(idx);
                          }
                        }}
                      >
                        <div className="px-4 py-2 transition-transform duration-300 group-hover:scale-102 flex items-center justify-center w-full h-full">
                          {renderPressLogo(item.publication)}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Slider Progress Dots showing total 9 items beautifully */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {content.press.items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePressIdx(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      activePressIdx === idx
                        ? 'w-6 bg-[#154736]'
                        : 'bg-[#154736]/20 hover:bg-[#154736]/50'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

            {/* Dynamic Article headline block for the active slide logo button */}
            <div className="relative max-w-2xl mx-auto mt-12 px-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePressIdx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="text-center"
                >
                  <p className="font-serif italic text-brand-ink text-[17px] sm:text-[20px] leading-relaxed font-light mb-5">
                    “{content.press.items[activePressIdx]?.headline || ""}”
                  </p>
                  
                  <a 
                    href={content.press.items[activePressIdx]?.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[2px] text-[#4d8f75] hover:text-[#154736] transition-colors duration-300 select-none cursor-pointer group"
                  >
                    Read coverage article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>
      )}

      {/* ==================== LEAD INTAKE GENERAL FOOTER ==================== */}
      <footer className="bg-brand-ink text-white/80 py-16 px-6 md:px-12 border-t border-brand-line/10">
        <div className="container mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 pb-12 border-b border-white/10">
            
            {/* Logo Column */}
            <div className="lg:col-span-4 space-y-6">
              <img src={content.site.logo} alt="Vianaar bottom logo representation" className="h-14 brightness-0 invert" />
              <p className="font-serif italic text-white/60 text-base max-w-sm">
                Creating luxury residential environments that evolve with you — built for a lifetime lived cleanly.
              </p>
              <div className="pt-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">General Office Line</p>
                <p className="font-sans font-medium text-white/90">info@vianaar.com | +91 98111 60000</p>
              </div>
            </div>

            {/* Offices details list */}
            <div className="lg:col-span-8">
              <h5 className="font-serif text-white text-xl mb-6">
                {content.footer.title}
              </h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {content.footer.offices.map((office, idx) => (
                  <div key={idx} className="border-l-2 border-white/10 pl-4 space-y-2 py-1">
                    <span className="block font-serif text-white font-medium text-sm">
                      {office.city}
                    </span>
                    <p className="font-sans font-light text-white/60 text-xs leading-relaxed">
                      {office.address}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-sans uppercase tracking-widest">
            <span>{content.footer.copyright}</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Charter</a>
              <a href="#" className="hover:text-white transition-colors">Developer Disclaimers</a>
              <a href="#" className="hover:text-white transition-colors">RERA Disclosures</a>
            </div>
          </div>

        </div>
      </footer>

      {/* ==================== GENERAL LEAD INTAKE POPUP MODAL ==================== */}
      <AnimatePresence>
        {isLeadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Modal backdrop blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLeadModalOpen(false)}
              className="absolute inset-0 bg-brand-ink/70 backdrop-blur-sm"
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-brand-cream border border-brand-line/40 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative z-10"
            >
              <button 
                onClick={() => setIsLeadModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-brand-sage text-brand-ink rounded-full transition-all"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-2xl font-light text-brand-ink mb-2">
                Inquire About La Isla
              </h3>
              <p className="font-sans text-xs text-brand-muted uppercase tracking-widest mb-6 border-b border-brand-line/40 pb-3">
                Loliem, South Goa · Direct Developer Access
              </p>

              <AnimatePresence mode="wait">
                {formSubmitted === "modal" ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <Check className="w-12 h-12 text-white bg-green-brand p-2.5 rounded-full mx-auto mb-4 shadow" />
                    <h4 className="font-serif text-xl text-brand-ink mb-2">Request Lodged!</h4>
                    <p className="font-sans text-xs text-brand-muted leading-relaxed max-w-sm mx-auto">
                      Our representative has registered your inquiry for preferred villas. Expect a digital portfolio via email shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={(e) => handleFormSubmit(e, "modal")} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-brand-ink mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                        className="w-full bg-brand-sand/50 border border-brand-line/70 focus:border-green-brand focus:bg-white outline-none px-4 py-2.5 text-sm rounded text-brand-ink transition-all"
                        placeholder="Anjali Sen"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-ink mb-1">Email</label>
                        <input
                          type="email"
                          required
                          value={leadFormData.email}
                          onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                          className="w-full bg-brand-sand/50 border border-brand-line/70 focus:border-green-brand focus:bg-white outline-none px-4 py-2.5 text-sm rounded text-brand-ink transition-all"
                          placeholder="anjali@gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-ink mb-1">Phone</label>
                        <input
                          type="tel"
                          required
                          value={leadFormData.phone}
                          onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                          className="w-full bg-brand-sand/50 border border-brand-line/70 focus:border-green-brand focus:bg-white outline-none px-4 py-2.5 text-sm rounded text-brand-ink transition-all"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-ink mb-1">Your Location</label>
                        <input
                          type="text"
                          value={leadFormData.location}
                          onChange={(e) => setLeadFormData({ ...leadFormData, location: e.target.value })}
                          className="w-full bg-brand-sand/50 border border-brand-line/70 focus:border-green-brand focus:bg-white outline-none px-4 py-2.5 text-sm rounded text-brand-ink transition-all"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-brand-ink mb-1">Preferred Villa</label>
                        <select
                          value={leadFormData.villa}
                          onChange={(e) => setLeadFormData({ ...leadFormData, villa: e.target.value })}
                          className="w-full bg-brand-sand/50 border border-brand-line/70 focus:border-green-brand focus:bg-white outline-none px-4 py-2.5 text-sm rounded text-brand-ink transition-all cursor-pointer"
                        >
                          <option value="2 BHK">2 BHK Villa</option>
                          <option value="3 BHK">3 BHK Villa</option>
                          <option value="4 BHK">4 BHK Villa</option>
                          <option value="Guidance">Guidance Required</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-4 bg-green-brand hover:bg-green-brand/90 active:translate-y-px text-white text-xs uppercase tracking-[3px] py-4 rounded font-medium shadow transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{content.hero.form.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </AnimatePresence>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== GENERAL FULLSCREEN LIGHTBOX VISUAL VIEWER ==================== */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImage(null)}
              className="absolute inset-0 bg-brand-ink/90 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-w-4xl w-full flex flex-col items-center justify-center z-10"
            >
              <button 
                onClick={() => setLightboxImage(null)}
                className="absolute -top-12 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-all shadow"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              
              <img 
                src={lightboxImage.image} 
                alt={lightboxImage.label} 
                className="w-full max-h-[75vh] object-contain border border-white/10 rounded-lg shadow-2xl bg-brand-ink" 
                onError={(e) => {
                  const fallback = getFallbackImage(lightboxImage.image);
                  if (e.currentTarget.src !== fallback) {
                    e.currentTarget.src = fallback;
                  }
                }}
              />
              
              <p className="text-white/90 font-serif text-lg tracking-wide uppercase mt-4 text-center select-all bg-black/40 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md">
                {lightboxImage.label}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ========================================================================= */}
      {/* ==================== AI STUDIO REAL-TIME CUSTOMIZER SIDE PANEL ==================== */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isCustomizerOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 w-[400px] bg-slate-900 border-l border-slate-800 text-slate-100 z-50 flex flex-col shadow-2xl h-full select-none"
          >
            {/* Customizer Drawer Header */}
            <div className="p-5 border-b border-sidebar-divider bg-slate-950 flex items-center justify-between">
              <div>
                <h3 className="font-sans font-bold text-sm tracking-widest text-[#4D8F75] flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  AI STUDIO CUSTOMIZER
                </h3>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">Dynamic Layout Editor & Parser</p>
              </div>
              <button 
                onClick={() => setIsCustomizerOpen(false)}
                className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded transition-colors"
                title="Close Customizer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customizer Navigation Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950 px-2">
              <button 
                onClick={() => setCustomizerTab("visual")}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 ${customizerTab === 'visual' ? 'border-b-2 border-[#4D8F75] text-[#4D8F75] bg-slate-900/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Sliders className="w-3.5 h-3.5" />
                Visual Fields
              </button>
              <button 
                onClick={() => setCustomizerTab("json")}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 ${customizerTab === 'json' ? 'border-b-2 border-[#4D8F75] text-[#4D8F75] bg-slate-900/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Code className="w-3.5 h-3.5" />
                Raw JSON
              </button>
              <button 
                onClick={() => setCustomizerTab("guide")}
                className={`flex-1 py-3 text-xs font-semibold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 ${customizerTab === 'guide' ? 'border-b-2 border-[#4D8F75] text-[#4D8F75] bg-slate-900/40' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Info className="w-3.5 h-3.5" />
                Instructions
              </button>
            </div>

            {/* Customizer Panel Body Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* --- VIEW TAB: VISUAL FORM FIELDS --- */}
              {customizerTab === "visual" && (
                <div className="space-y-6">
                  
                  {/* Select nested section */}
                  <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1.5 rounded-lg border border-slate-850">
                    {["general", "hero", "about_loliem", "map", "highlights", "testimonials"].map((navSec) => (
                      <button
                        key={navSec}
                        onClick={() => setActiveEditSection(navSec)}
                        className={`py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider rounded transition-all text-center ${activeEditSection === navSec ? 'bg-[#226F56] text-white' : 'text-slate-400 hover:text-white bg-transparent'}`}
                      >
                        {navSec.replace('_', ' & ')}
                      </button>
                    ))}
                  </div>

                  {/* General / Brand branding controls */}
                  {activeEditSection === "general" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Branding Logo SVG Image URL</label>
                        <input 
                          type="text" 
                          value={content.site.logo}
                          onChange={(e) => updateContentField("site", "logo", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Logo Alternative description</label>
                        <input 
                          type="text" 
                          value={content.site.logoAlt}
                          onChange={(e) => updateContentField("site", "logoAlt", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Header Button Cta Text</label>
                        <input 
                          type="text" 
                          value={content.header.ctaText}
                          onChange={(e) => updateContentField("header", "ctaText", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Hero section styling controls */}
                  {activeEditSection === "hero" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Hero Top Eyebrow Title</label>
                        <input 
                          type="text" 
                          value={content.hero.eyebrow}
                          onChange={(e) => updateContentField("hero", "eyebrow", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Primary Hero Banner Title</label>
                        <input 
                          type="text" 
                          value={content.hero.title}
                          onChange={(e) => updateContentField("hero", "title", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Residences description Tag</label>
                        <input 
                          type="text" 
                           value={content.hero.tag}
                          onChange={(e) => updateContentField("hero", "tag", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Geographical Location Area</label>
                        <input 
                          type="text" 
                          value={content.hero.location}
                          onChange={(e) => updateContentField("hero", "location", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Goa Video Mp4 Background URL</label>
                        <input 
                          type="text" 
                          value={content.hero.videoSrc}
                          onChange={(e) => updateContentField("hero", "videoSrc", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Leave empty to utilize standard static background image.</p>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Fallbacks Background Cover Image URL</label>
                        <input 
                          type="text" 
                          value={content.hero.bgImg}
                          onChange={(e) => updateContentField("hero", "bgImg", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Inquiry Heading form title</label>
                        <input 
                          type="text" 
                          value={content.hero.form.title}
                          onChange={(e) => updateContentField("hero", "form", e.target.value, "title")}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* About the estate and Loliem info controls */}
                  {activeEditSection === "about_loliem" && (
                    <div className="space-y-4">
                      <div>
                        <span className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">🌿 Section: About Vianaar</span>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Headline Title</label>
                        <input 
                          type="text" 
                          value={content.about.title}
                          onChange={(e) => updateContentField("about", "title", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded mb-3"
                        />
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Core description Paragraphs</label>
                        <textarea 
                          rows={4}
                          value={content.about.paragraphs.join("\n\n")}
                          onChange={(e) => {
                            const split = e.target.value.split("\n\n");
                            setContent(prev => ({ ...prev, about: { ...prev.about, paragraphs: split } }));
                          }}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded font-mono"
                          placeholder="Double empty line separation defines separate paragraphs."
                        />
                      </div>

                      <div className="h-px bg-slate-850 my-4" />

                      <div>
                        <span className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">🌊 Section: Loliem Vibe</span>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Loliem Eyebrow</label>
                        <input 
                          type="text" 
                          value={content.loliem.eyebrow}
                          onChange={(e) => updateContentField("loliem", "eyebrow", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded mb-3"
                        />
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Loliem Title</label>
                        <input 
                          type="text" 
                          value={content.loliem.title}
                          onChange={(e) => updateContentField("loliem", "title", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded mb-3"
                        />
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Paragraph Content</label>
                        <textarea 
                          rows={4}
                          value={content.loliem.paragraphs.join("\n\n")}
                          onChange={(e) => {
                            const split = e.target.value.split("\n\n");
                            setContent(prev => ({ ...prev, loliem: { ...prev.loliem, paragraphs: split } }));
                          }}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded font-mono"
                        />
                      </div>
                    </div>
                  )}

                  {/* Map Pin placements configuration */}
                  {activeEditSection === "map" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Connectivity Map Title</label>
                        <input 
                          type="text" 
                          value={content.mapSection.title}
                          onChange={(e) => updateContentField("mapSection", "title", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 uppercase tracking-widest mb-1.5">Visual Map image background</label>
                        <input 
                          type="text" 
                          value={content.mapSection.mapImage}
                          onChange={(e) => updateContentField("mapSection", "mapImage", e.target.value)}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                      
                      <div>
                        <span className="block text-xs uppercase tracking-wider text-slate-450 mb-2">📍 Milestones Distances</span>
                        <div className="space-y-3">
                          {content.mapSection.items.map((mItem, mIdx) => (
                            <div key={mItem.id} className="bg-slate-950 p-3 rounded border border-slate-850 space-y-2">
                              <span className="text-[10px] text-green-soft uppercase tracking-wider font-bold">Landmark Pin #{mItem.id}</span>
                              <input 
                                type="text"
                                value={mItem.place}
                                onChange={(e) => {
                                  const updatedItems = [...content.mapSection.items];
                                  updatedItems[mIdx].place = e.target.value;
                                  setContent(prev => ({ ...prev, mapSection: { ...prev.mapSection, items: updatedItems } }));
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-white outline-none px-2.5 py-1.5 text-xs rounded"
                                placeholder="Landmark place name"
                              />
                              <input 
                                type="text"
                                value={mItem.meta}
                                onChange={(e) => {
                                  const updatedItems = [...content.mapSection.items];
                                  updatedItems[mIdx].meta = e.target.value;
                                  setContent(prev => ({ ...prev, mapSection: { ...prev.mapSection, items: updatedItems } }));
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-white outline-none px-2.5 py-1.5 text-xs rounded"
                                placeholder="Distance meta info"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Highlights checklist and dynamic renders items */}
                  {activeEditSection === "highlights" && (
                    <div className="space-y-4 font-sans">
                      <div>
                        <span className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2">🌿 Dynamic Highlights checklist</span>
                        <textarea 
                          rows={6}
                          value={content.projectInfo.highlights.items.join("\n")}
                          onChange={(e) => {
                            const split = e.target.value.split("\n").filter(line => line.trim());
                            setContent(prev => {
                              const clone = JSON.parse(JSON.stringify(prev));
                              clone.projectInfo.highlights.items = split;
                              return clone;
                            });
                          }}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2.5 text-xs focus:border-[#4D8F75] rounded font-mono"
                          placeholder="Place each highlight item on a separate line."
                        />
                      </div>

                      <div className="h-px bg-slate-800 my-4" />

                      <div>
                        <span className="block text-slate-350 text-xs font-bold uppercase tracking-wider mb-2 pr-2">Clubhouse Loom House Summary</span>
                        <input 
                          type="text" 
                          value={content.projectInfo.clubhouse.title}
                          onChange={(e) => {
                            setContent(prev => {
                              const clone = JSON.parse(JSON.stringify(prev));
                              clone.projectInfo.clubhouse.title = e.target.value;
                              return clone;
                            });
                          }}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded mb-2"
                        />
                        <textarea 
                          rows={2}
                          value={content.projectInfo.clubhouse.description}
                          onChange={(e) => {
                            setContent(prev => {
                              const clone = JSON.parse(JSON.stringify(prev));
                              clone.projectInfo.clubhouse.description = e.target.value;
                              return clone;
                            });
                          }}
                          className="w-full bg-slate-950 text-slate-100 border border-slate-850 outline-none px-3.5 py-2 text-xs focus:border-[#4D8F75] rounded"
                        />
                      </div>
                    </div>
                  )}

                  {/* Testimonial & press triggers */}
                  {activeEditSection === "testimonials" && (
                    <div className="space-y-5">
                      
                      {/* Testimonials Visibility Toggle */}
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg flex items-center justify-between">
                        <div>
                          <span className="block text-xs font-bold uppercase tracking-wider text-slate-300">Show Client Reviews?</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Render on landing page</span>
                        </div>
                        <button 
                          onClick={() => setContent({ ...content, testimonials: { ...content.testimonials, isVisible: !content.testimonials.isVisible } })}
                          className={`w-14 h-7 rounded-full px-1.5 transition-all flex items-center ${content.testimonials.isVisible ? 'bg-green-brand justify-end' : 'bg-slate-800 justify-start'}`}
                        >
                          <div className="w-4 h-4 rounded-full bg-white shadow" />
                        </button>
                      </div>

                      {/* Testimonial item cards editors */}
                      {content.testimonials.isVisible && (
                        <div className="space-y-4">
                          <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">📝 Testimonial entries</span>
                          {content.testimonials.items.map((t, tIdx) => (
                            <div key={t.id} className="bg-slate-950 p-4 rounded border border-slate-850 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase text-green-soft font-bold">Review #{t.id}</span>
                                <button
                                  onClick={() => {
                                    const updated = content.testimonials.items.filter(item => item.id !== t.id);
                                    setContent({ ...content, testimonials: { ...content.testimonials, items: updated } });
                                  }}
                                  className="text-red-400 hover:text-red-600 transition-colors"
                                  title="Delete testimonial"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <input 
                                type="text"
                                value={t.author}
                                onChange={(e) => {
                                  const updated = [...content.testimonials.items];
                                  updated[tIdx].author = e.target.value;
                                  setContent({ ...content, testimonials: { ...content.testimonials, items: updated } });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-white outline-none px-2.5 py-1.5 text-xs rounded"
                                placeholder="Author name"
                              />
                              <input 
                                type="text"
                                value={t.designation}
                                onChange={(e) => {
                                  const updated = [...content.testimonials.items];
                                  updated[tIdx].designation = e.target.value;
                                  setContent({ ...content, testimonials: { ...content.testimonials, items: updated } });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-white outline-none px-2.5 py-1.5 text-xs rounded"
                                placeholder="Villa designation details"
                              />
                              <textarea
                                rows={2}
                                value={t.quote}
                                onChange={(e) => {
                                  const updated = [...content.testimonials.items];
                                  updated[tIdx].quote = e.target.value;
                                  setContent({ ...content, testimonials: { ...content.testimonials, items: updated } });
                                }}
                                className="w-full bg-slate-900 border border-slate-800 text-white outline-none px-2.5 py-1.5 text-xs rounded"
                                placeholder="Review quotation"
                              />
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              const newId = content.testimonials.items.length ? Math.max(...content.testimonials.items.map(i => i.id)) + 1 : 1;
                              const newItem: TestimonialItem = {
                                id: newId,
                                author: "New Villa Owner",
                                designation: "La Isla Resident",
                                date: "May 2026",
                                quote: "The architectural fidelity and customer support levels by Vianaar are unmatched."
                              };
                              setContent({ ...content, testimonials: { ...content.testimonials, items: [...content.testimonials.items, newItem] } });
                            }}
                            className="w-full py-2.5 border border-dashed border-slate-700 rounded text-xs uppercase tracking-wider text-slate-350 hover:border-[#4D8F75] hover:text-[#4D8F75] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Review Entry
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              )}


              {/* --- VIEW TAB: RAW JSON CODE SYNTAX PARSER --- */}
              {customizerTab === "json" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold">Active JSON block</span>
                    <span className="text-[10px] uppercase text-green-soft bg-green-brand/10 px-2 py-0.5 rounded font-mono font-bold">
                      Editable
                    </span>
                  </div>

                  <textarea
                    rows={16}
                    value={rawEditorText}
                    onChange={(e) => setRawEditorText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 font-mono text-xs p-3.5 outline-none focus:border-[#4D8F75] rounded leading-relaxed text-slate-100"
                  />

                  {jsonValidationError && (
                    <div className="p-3 bg-red-950/80 border border-red-900 rounded text-xs text-red-300">
                      <strong>⚠️ JSON Syntax Error:</strong>
                      <p className="mt-1 font-mono text-[10px] overflow-x-auto whitespace-pre">{jsonValidationError}</p>
                    </div>
                  )}

                  <button
                    onClick={handleApplyRawJson}
                    className="w-full bg-[#226F56] hover:bg-[#154736] text-white text-xs font-semibold py-3 rounded outline-none shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    ⚡ APPLY RAW CHANGES
                  </button>
                </div>
              )}


              {/* --- VIEW TAB: INSTRUCTIONS FOR DEPLOYMENT --- */}
              {customizerTab === "guide" && (
                <div className="space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#4D8F75]" />
                      How to persist modifications
                    </h4>
                    <p className="mb-3">
                      This UI customizer allows you to edit structural details on-the-fly and see them reload immediately in the live canvas iframe.
                    </p>
                    <ol className="list-decimal pl-4 space-y-2 text-slate-400">
                      <li>Use the <strong>Visual Fields</strong> or <strong>Raw JSON</strong> tabs to customize text, beach milestones, image parameters, etc.</li>
                      <li>Review results inside standard render views on the left instantly.</li>
                      <li>Once satisfied, click the button below to copy the structured final layout schema.</li>
                      <li>Open the left panel filesystem in AI Studio, click <strong>src/data/content.json</strong>, replace all text, and commit/push changes to GitHub.</li>
                    </ol>
                  </div>

                  <div className="bg-slate-950 p-4 border border-sidebar-divider/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2 uppercase tracking-wide">💡 Local Cache saved</h4>
                    <p className="text-slate-400">
                      The customized changes are saved instantly inside your local browser cache (`localStorage`). If you refresh or reload, your changes will not be lost.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Customizer footer with quick action triggers */}
            <div className="p-5 border-t border-slate-850 bg-slate-950 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyJson}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs uppercase tracking-wider font-semibold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Copy formatted JSON content"
                >
                  {copyFeedback ? <Check className="w-4 h-4 text-green-soft" /> : <Copy className="w-4 h-4" />}
                  <span>{copyFeedback ? "Copied!" : "Copy JSON"}</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs uppercase tracking-wider font-semibold py-2.5 px-3 rounded flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  title="Download content.json file directly to computer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .json</span>
                </button>
              </div>

              <button
                onClick={handleResetDefaults}
                className="w-full text-[10px] text-slate-400 hover:text-white uppercase tracking-widest flex items-center justify-center gap-1.5 pt-2 cursor-pointer transition-colors"
                title="Restore original brand preset values"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset layout to Default Preset
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Customizer button removed */}

    </div>
  );
}
