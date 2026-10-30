function Hero({ onExploreClick }) {
  const handleScroll = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const searchEl = document.getElementById("search-section");
      if (searchEl) {
        searchEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section
      className="relative min-h-[500px] h-[65vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1600')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/50" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <span className="inline-block px-4 py-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 font-bold rounded-full text-xs uppercase tracking-wider mb-4">
          Smart Parking Reservation
        </span>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
          Find Your Perfect Parking Spot in <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">Seconds</span>
        </h1>

        <p className="mt-4 text-base md:text-xl text-slate-300 max-w-2xl mx-auto">
          Reserve verified parking spots in real-time, get turn-by-turn navigation, and pay seamlessly with ParkEase.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleScroll}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition transform duration-200"
          >
            Find Parking Now 🚗
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
