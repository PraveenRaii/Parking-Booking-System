function Hero() {
  return (
    <section
      className="h-[80vh] bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600')",
      }}
    >
      <div className="bg-black/60 p-10 rounded-2xl text-center text-white">

        <h1 className="text-5xl font-bold">
          Find Your Perfect Parking Spot
        </h1>

        <p className="mt-5 text-xl">
          Easy, Fast & Secure Parking Booking
        </p>

        <button className="mt-8 bg-blue-600 px-8 py-3 rounded-lg hover:bg-blue-700">
          Find Parking
        </button>

      </div>
    </section>
  );
}

export default Hero;