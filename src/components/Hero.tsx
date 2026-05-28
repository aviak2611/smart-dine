export default function Hero() {
  return (
    <section
     id="hero" className="min-h-[90vh] flex items-center justify-center px-6 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* CONTENT */}
      <div className="text-center relative z-10 text-white">

        <h1 className="text-5xl md:text-7xl font-bold">
          Delicious Food,
          <br />
          Delivered Fast
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200">
          Order your favorite meals anytime with SmartDine
        </p>

        <button
          onClick={() => {
            document.getElementById("foods")?.scrollIntoView({
              behavior: "smooth",
            });
          }}
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl text-lg transition"
        >
          Explore Menu
        </button>

      </div>
    </section>
  );
}