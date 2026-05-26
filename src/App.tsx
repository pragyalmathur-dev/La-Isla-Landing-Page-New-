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
  ChevronRight,
  Eye,
  Building,
  CheckCircle2,
  Trash2,
  Plus
} from "lucide-react";
import defaultContent from "./data/content.json";
import { LandingContent, TestimonialItem, PressItem } from "./types";

export default function App() {
  // --- Content State initialized with local storage persistence ---
  const [content, setContent] = useState<LandingContent>(() => {
    const saved = localStorage.getItem("la_isla_custom_content");
    if (saved) {
      try {
        return JSON.parse(saved);
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
      const mapEl = document.getElementById("map");
      const projectEl = document.getElementById("project");
      const testimonialsEl = document.getElementById("testimonials");
      const pressEl = document.getElementById("press");

      const scrollPos = window.scrollY + 200;

      if (heroEl && scrollPos >= heroEl.offsetTop && scrollPos < (aboutEl?.offsetTop || Infinity)) {
        setActiveSection("hero");
        setIsNavDark(true);
      } else if (aboutEl && scrollPos >= aboutEl.offsetTop && scrollPos < (mapEl?.offsetTop || Infinity)) {
        setActiveSection("about");
        setIsNavDark(false);
      } else if (mapEl && scrollPos >= mapEl.offsetTop && scrollPos < (projectEl?.offsetTop || Infinity)) {
        setActiveSection("map");
        setIsNavDark(false);
      } else if (projectEl && scrollPos >= projectEl.offsetTop && scrollPos < (testimonialsEl?.offsetTop || pressEl?.offsetTop || Infinity)) {
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
  };

  return (
    <div className={`relative min-h-screen bg-brand-cream overflow-x-hidden selection:bg-green-brand selection:text-white ${isCustomizerOpen ? "lg:mr-[400px]" : ""} transition-all duration-300`}>
      
      {/* ==================== UPPER LOGO HEADER ==================== */}
      <header className={`fixed top-0 left-0 right-0 z-40 px-6 py-4 md:px-12 flex items-center justify-between transition-all duration-300 ${activeSection !== 'hero' ? 'bg-brand-cream/90 backdrop-blur-md shadow-sm border-b border-brand-line/30' : 'bg-transparent'}`}>
        <a href="#" className="flex items-center gap-2 group" onClick={(e) => { e.preventDefault(); scrollToAnchor("hero"); }}>
          <img 
            src={content.site.logo} 
            alt={content.site.logoAlt} 
            className={`h-11 md:h-14 w-auto transition-all duration-300 ${activeSection === 'hero' ? 'brightness-0 invert' : 'brightness-95 contrast-100'}`} 
          />
        </a>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => { setFormSource("enquire"); setIsLeadModalOpen(true); }}
            className={`hidden md:inline-flex items-center gap-2 border px-6 py-2.5 text-xs font-medium tracking-[2.5px] uppercase transition-all duration-300 rounded ${activeSection === 'hero' ? 'border-white/60 text-white hover:bg-white hover:text-green-dark' : 'border-green-brand text-green-brand hover:bg-green-brand hover:text-white'}`}
          >
            {content.header.ctaText}
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Quick toggle for JSON customizer inside AI Studio */}
          <button
            onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
            className="flex items-center gap-2 bg-green-brand text-white text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-green-dark shadow-md hover:shadow-lg transition-all duration-200"
            id="aistudio-customizer-toggle"
          >
            <Settings className={`w-4 h-4 ${isCustomizerOpen ? 'rotate-90' : ''} transition-transform duration-500`} />
            <span className="hidden sm:inline">Theme Customizer</span>
          </button>
        </div>
      </header>

      {/* ==================== SIDE NAVIGATION (RAIL & PANEL) ==================== */}
      <nav className="fixed left-0 top-0 bottom-0 z-40 hidden md:block pointer-events-none" aria-label="Page Sections">
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8 pointer-events-auto z-10">
          <button 
            onClick={() => setIsSideMenuOpen(true)}
            className="w-10 h-10 bg-brand-cream/80 hover:bg-brand-sage border border-brand-line/40 rounded-full flex flex-col items-center justify-center gap-1.5 shadow-md group transition-all"
            aria-label="Open menu"
          >
            <span className="w-4 h-0.5 bg-brand-ink group-hover:scale-x-110 transition-transform"></span>
            <span className="w-3 h-0.5 bg-brand-ink self-start ml-3 group-hover:w-4 transition-all"></span>
            <span className="w-4 h-0.5 bg-brand-ink group-hover:scale-x-110 transition-transform"></span>
          </button>

          {/* Dot navigation highlighting the intersectional active section */}
          <div className="flex flex-col gap-4 py-6 px-2.5 bg-brand-cream/90 backdrop-blur border border-brand-line/30 rounded-full shadow-lg">
            {[
              { id: "hero", label: "Hero" },
              { id: "about", label: "About" },
              { id: "map", label: "Map" },
              { id: "project", label: "Project & BHKs" },
              { id: "testimonials", label: "Testimonials" },
              { id: "press", label: "Press" }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToAnchor(item.id)}
                className="group relative flex items-center justify-center h-4 w-4"
                title={item.label}
              >
                <span className={`block w-2 h-2 rounded-full transition-all duration-300 ${activeSection === item.id ? 'bg-green-brand scale-150' : 'bg-brand-ink/30 hover:bg-brand-ink group-hover:scale-125'}`} />
                <span className="absolute left-6 scale-0 group-hover:scale-100 bg-brand-ink text-white font-sans text-[11px] uppercase tracking-widest px-2 py-1 rounded shadow-md pointer-events-none transition-all origin-left truncate max-w-[120px]">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Backdrop filter overlay active on side drawer */}
        <div 
          onClick={() => setIsSideMenuOpen(false)}
          className={`fixed inset-0 bg-brand-ink/40 backdrop-blur-sm transition-opacity duration-500 pointer-events-auto ${isSideMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        />

        {/* Inside drawer navigation view */}
        <div className={`fixed left-0 top-0 bottom-0 w-[350px] bg-green-dark p-12 flex flex-col justify-between pointer-events-auto shadow-2xl transition-transform duration-500 z-50 ${isSideMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div>
            <div className="flex items-center justify-between mb-12">
              <img src={content.site.logo} alt={content.site.logoAlt} className="h-10 brightness-0 invert" />
              <button 
                onClick={() => setIsSideMenuOpen(false)}
                className="p-1.5 border border-white/20 rounded-full text-white/70 hover:text-white hover:border-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="font-sans text-[10px] text-white/50 uppercase tracking-[3px] mb-8">{content.hero.eyebrow}</p>
            <ol className="flex flex-col gap-6">
              {[
                { num: "01", label: content.hero.title, id: "hero" },
                { num: "02", label: content.about.title, id: "about" },
                { num: "03", label: content.loliem.eyebrow, id: "hero" },
                { num: "04", label: content.mapSection.title, id: "map" },
                { num: "05", label: content.projectInfo.title, id: "project" },
                { num: "06", label: "Client Testimonials", id: "testimonials" },
                { num: "07", label: "Press Highlights", id: "press" }
              ].map((navItem, index) => (
                <li key={index} className="group">
                  <button 
                    onClick={() => scrollToAnchor(navItem.id)}
                    className="flex items-baseline gap-6 font-serif text-2xl text-white/60 hover:text-white transition-all text-left group-hover:translate-x-2"
                  >
                    <span className="font-sans text-[10px] uppercase tracking-wider text-green-soft font-bold w-6">{navItem.num}</span>
                    <span>{navItem.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="border-t border-white/10 pt-8 text-white/50">
            <p className="font-sans text-[11px] tracking-wide mb-2">Vianaar Luxury Residences</p>
            <p className="font-serif italic text-sm text-white/80">"A New Expression of Living"</p>
          </div>
        </div>
      </nav>

      {/* ==================== CORE BANNER / HERO SECTION ==================== */}
      <section 
        id="hero" 
        className="relative min-h-screen flex items-center justify-center pt-28 pb-16 px-6 md:px-12 bg-green-dark overflow-hidden"
      >
        {/* Dynamic Media Background (Fallback to image if video has issue or customizable) */}
        {content.hero.videoSrc ? (
          <video 
            ref={videoRef}
            key={content.hero.videoSrc}
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 scale-105 transition-all duration-[20rem]" 
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
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-50" 
          />
        )}
        
        {/* Shadow Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-dark/40 via-green-dark/20 to-green-dark/70 z-10" />

        <div className="container mx-auto z-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            
            {/* Hero details column */}
            <div className="lg:col-span-7 text-white text-left max-w-2xl">
              <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-xs uppercase tracking-[3.5px] font-medium mb-6 animate-pulse">
                {content.hero.eyebrow}
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl md:text-8xl font-normal leading-[1.05] tracking-tight mb-4 drop-shadow-md text-white">
                {content.hero.title}
              </h1>
              
              <div className="h-0.5 bg-green-soft w-28 my-6" />

              <p className="font-serif italic text-xl md:text-2xl text-white/95 mb-1 max-w-xl">
                {content.hero.tag}
              </p>
              <div className="flex items-center gap-2 text-white/80 uppercase font-sans text-xs tracking-[4px] font-medium">
                <MapPin className="w-4 h-4 text-green-soft" />
                <span>{content.hero.location}</span>
              </div>

              {/* Video control buttons */}
              {content.hero.videoSrc && (
                <button 
                  onClick={toggleVideoPlayback}
                  className="mt-8 inline-flex items-center gap-2 bg-black/30 hover:bg-black/50 border border-white/20 text-white text-xs uppercase tracking-widest font-sans px-4 py-2 rounded-full transition-all backdrop-blur-md"
                >
                  {isHeroVideoPlaying ? <Pause className="w-3.5 h-3.5 text-white" /> : <Play className="w-3.5 h-3.5 text-white" />}
                  <span>{isHeroVideoPlaying ? "Pause ambiance video" : "Play ambiance video"}</span>
                </button>
              )}
            </div>

            {/* Inquire Frosted Glass Form component */}
            <div className="lg:col-span-5" id="enquire-lead-form">
              <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-xl p-8 shadow-2xl relative overflow-hidden">
                
                {/* Decorative corner glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-green-soft/30 rounded-full blur-2xl" />

                <h3 className="font-sans font-light text-xl text-white tracking-widest text-center uppercase mb-6 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-soft" />
                  {content.hero.form.title}
                </h3>

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
                        <label className="block text-[10px] uppercase tracking-wider text-white/80 mb-1">Your Full Name</label>
                        <input
                          type="text"
                          required
                          value={leadFormData.name}
                          onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                          className="w-full bg-white/15 border border-white/20 hover:border-white/40 focus:border-white focus:bg-white focus:text-brand-ink outline-none px-4 py-2.5 text-sm rounded text-white transition-all"
                          placeholder="Anjali Sen"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/80 mb-1">Email</label>
                          <input
                            type="email"
                            required
                            value={leadFormData.email}
                            onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                            className="w-full bg-white/15 border border-white/20 hover:border-white/40 focus:border-white focus:bg-white focus:text-brand-ink outline-none px-4 py-2.5 text-sm rounded text-white transition-all"
                            placeholder="anjali@domain.com"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/80 mb-1">Phone</label>
                          <input
                            type="tel"
                            required
                            value={leadFormData.phone}
                            onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                            className="w-full bg-white/15 border border-white/20 hover:border-white/40 focus:border-white focus:bg-white focus:text-brand-ink outline-none px-4 py-2.5 text-sm rounded text-white transition-all"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/80 mb-1">Your Location</label>
                          <input
                            type="text"
                            value={leadFormData.location}
                            onChange={(e) => setLeadFormData({ ...leadFormData, location: e.target.value })}
                            className="w-full bg-white/15 border border-white/20 hover:border-white/40 focus:border-white focus:bg-white focus:text-brand-ink outline-none px-4 py-2.5 text-sm rounded text-white transition-all"
                            placeholder="Delhi NCR"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/80 mb-1">Preferred Villa</label>
                          <select
                            value={leadFormData.villa}
                            onChange={(e) => setLeadFormData({ ...leadFormData, villa: e.target.value })}
                            className="w-full bg-slate-800/80 md:bg-white/15 border border-white/20 hover:border-white/40 focus:border-white focus:bg-white focus:text-brand-ink outline-none px-4 py-2.5 text-sm rounded text-white transition-all appearance-none cursor-pointer"
                          >
                            <option value="2 BHK">2 BHK Villa</option>
                            <option value="3 BHK">3 BHK Villa</option>
                            <option value="4 BHK">4 BHK Villa</option>
                            <option value="Needs guidance">Guidance Required</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full mt-2 bg-green-brand hover:bg-green-brand/90 active:translate-y-px text-white text-xs uppercase tracking-[3px] py-4 rounded font-medium shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>{content.hero.form.buttonText}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </AnimatePresence>
                
                <p className="text-[10px] text-white/50 text-center mt-4 uppercase tracking-widest">
                  Secure Site · Direct Developer Desk
                </p>
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
      <section className="py-28 px-6 md:px-12 bg-brand-sage text-center text-brand-ink relative overflow-hidden">
        
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

      {/* ==================== OUR PROJECT ON THE MAP (INTERACTIVE GEOGRAPHY) ==================== */}
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
              <div className="relative bg-[#F1EBE0] rounded-[10px] overflow-hidden shadow-md w-full max-w-[340px] aspect-[31/55] border border-brand-line/40 group">
                
                <img 
                  src={content.mapSection.mapImage} 
                  alt="La Isla — Loliem Neighborhood map" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />

                {/* Hotspot Pin points corresponding to item index */}
                {[
                  { id: 1, x: "28%", y: "74%", name: "Galgibaga Beach" },
                  { id: 2, x: "42%", y: "59%", name: "The Lalit Golf Resort" },
                  { id: 3, x: "55%", y: "50%", name: "Cotiago Wildlife" },
                  { id: 4, x: "58%", y: "65%", name: "NH 66 Expressway" },
                  { id: 5, x: "72%", y: "78%", name: "Rich agricultural belt" }
                ].map(pin => (
                  <button
                    key={pin.id}
                    onClick={() => setActiveMapPin(pin.id)}
                    onMouseEnter={() => setActiveMapPin(pin.id)}
                    className="absolute z-20 transition-transform duration-300 hover:scale-125"
                    style={{ left: pin.x, top: pin.y }}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className={`absolute inline-flex h-8 w-8 rounded-full opacity-30 transition-all ${activeMapPin === pin.id ? 'bg-[#226F56] animate-ping' : 'bg-transparent'}`} />
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-serif text-xs font-semibold shadow-sm transition-all ${activeMapPin === pin.id ? 'bg-[#226F56] text-white' : 'bg-white/95 text-[#226F56] border border-[#226F56]/20'}`}>
                        {pin.id}
                      </div>

                      {/* Floating marker label */}
                      <AnimatePresence>
                        {activeMapPin === pin.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-9 bg-brand-ink text-white font-sans text-[10px] font-semibold px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-40 flex items-center gap-1"
                          >
                            <MapPin className="w-3 h-3 text-green-soft" />
                            {pin.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                ))}

                {/* Sub-label instructions hint */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm border border-brand-line/20 px-2.5 py-1 rounded text-[9px] uppercase tracking-widest text-[#231F20] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  Interactive Distance Map
                </div>

              </div>
            </div>

            {/* Right Column: Distance parameters flat list with solid green circle badges exactly as in screenshot */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="space-y-0 border-t border-brand-line/60">
                {content.mapSection.items.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveMapPin(item.id)}
                    onMouseEnter={() => setActiveMapPin(item.id)}
                    className={`flex items-start gap-5 py-6 border-b border-brand-line/60 transition-all duration-350 cursor-pointer ${activeMapPin === item.id ? 'bg-brand-sage/20 pl-2' : ''}`}
                  >
                    {/* Perfect Solid Green Circle with White Number */}
                    <div 
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-[#226F56] text-white flex items-center justify-center font-sans text-sm md:text-base font-normal flex-shrink-0 shadow-sm transition-transform duration-300 ${activeMapPin === item.id ? 'scale-105 saturate-125' : ''}`}
                    >
                      {item.id}
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-sans font-normal text-[#231F20] text-lg md:text-[20px] tracking-wide leading-tight transition-colors ${activeMapPin === item.id ? 'text-[#226F56] font-medium' : ''}`}>
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
                👑 {content.projectInfo.highlights.title}
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
          <div className="container mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="font-sans text-xs uppercase tracking-[4px] text-green-brand block mb-2">Quality & Experience</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-ink">
                {content.testimonials.title}
              </h2>
              <div className="w-16 h-0.5 bg-green-brand mx-auto my-5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {content.testimonials.items.map((testimonial) => (
                <div 
                  key={testimonial.id} 
                  className="bg-brand-sand/30 border border-brand-line/50 p-8 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    {/* Vector quote symbol */}
                    <span className="block font-serif text-6xl text-green-brand/30 leading-none h-4">“</span>
                    <p className="font-serif italic text-lg leading-relaxed text-brand-ink mb-6 relative z-10 pl-4">
                      {testimonial.quote}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-brand-line/30 pt-4 mt-2">
                    <div className="w-10 h-10 rounded-full bg-green-brand/10 text-green-brand flex items-center justify-center font-serif text-base font-bold">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-sans font-semibold text-brand-ink text-sm">{testimonial.author}</h4>
                      <p className="font-sans text-xs text-brand-muted">{testimonial.designation} · {testimonial.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== PRESS HIGHLIGHTS ==================== */}
      {content.press.isVisible && (
        <section id="press" className="py-24 px-6 md:px-12 bg-brand-sage">
          <div className="container mx-auto">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="font-sans text-xs uppercase tracking-[4px] text-green-brand block mb-2">Featured Publication Press</span>
              <h2 className="font-serif text-3xl md:text-5xl font-light text-brand-ink">
                {content.press.title}
              </h2>
              <div className="w-16 h-0.5 bg-green-brand mx-auto my-5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {content.press.items.map((item) => (
                <a 
                  href={item.link}
                  key={item.id}
                  target="_blank"
                  rel="noreferrer"
                  className="block bg-brand-cream border border-brand-line/45 hover:border-green-brand/30 hover:shadow-lg p-8 rounded-xl transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-serif text-xl font-bold tracking-tight text-green-brand border-l-2 border-green-brand pl-3">
                      {item.publication}
                    </span>
                    <span className="font-sans text-[11px] text-brand-muted uppercase tracking-wider">
                      {item.date}
                    </span>
                  </div>
                  <p className="font-sans font-light text-brand-ink leading-relaxed mb-4 group-hover:text-green-brand transition-colors text-base">
                    "{item.headline}"
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-green-brand font-semibold border-b border-transparent group-hover:border-green-brand transition-all">
                    Read coverage article
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>
              ))}
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

      {/* Small floating hint when Customizer is collapsed to inform user they can edit */}
      {!isCustomizerOpen && (
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-[#226F56] text-white p-3.5 rounded-full shadow-2xl hover:bg-green-dark hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group animate-bounce"
        >
          <Sparkles className="w-5 h-5" />
          <span className="font-sans text-xs font-semibold uppercase tracking-wider max-w-0 overflow-hidden group-hover:max-w-[150px] transition-all duration-300 whitespace-nowrap">
            Content Editor Mode
          </span>
        </button>
      )}

    </div>
  );
}
