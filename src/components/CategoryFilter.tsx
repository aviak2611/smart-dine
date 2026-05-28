type CategoryFilterProps = {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
};

export default function CategoryFilter({
  activeCategory,
  setActiveCategory,
}: CategoryFilterProps) {

  const categories = [
    "All",
    "Burger",
    "Pizza",
    "Pasta",
    "Cold Drinks",
    "Dessert",
  ];

  return (

    <section className="px-6 py-10 bg-gray-100">

      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        Categories
      </h1>

      <div className="flex flex-wrap justify-center gap-4">

        {categories.map((item, index) => (

          <button
            key={index}
            onClick={() => setActiveCategory(item)}
            className={`px-6 py-3 rounded-full shadow-md font-medium duration-300
              
              ${activeCategory === item
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white"
              }
            `}
          >
            {item}
          </button>

        ))}

      </div>

    </section>

  );
}