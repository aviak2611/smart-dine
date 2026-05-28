export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">

      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between">

        {/* BRAND */}
        <h1 className="text-2xl font-bold text-orange-500">
          SmartDine
        </h1>

        {/* LINKS */}
        <div className="flex gap-6 mt-4 md:mt-0 text-gray-300">
          <a href="#" className="hover:text-orange-500">Home</a>
          <a href="#foods" className="hover:text-orange-500">Menu</a>
          <a href="/login" className="hover:text-orange-500">Login</a>
        </div>

        {/* COPYRIGHT */}
        <p className="text-sm text-gray-400 mt-4 md:mt-0">
          © {new Date().getFullYear()} SmartDine. All rights reserved.
        </p>

      </div>

    </footer>
  );
}