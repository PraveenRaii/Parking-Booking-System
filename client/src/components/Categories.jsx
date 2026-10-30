const categories = [
    "All",
    "Car",
    "Bike",
    "EV",
    "Bicycle",
    "Bus"
];

function Categories({ selectedCategory = "All", onSelectCategory }) {
    return (
        <div className="max-w-7xl mx-auto py-6 px-6">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
                Vehicle Categories
            </h2>

            <div className="flex flex-wrap gap-3">
                {categories.map((item) => (
                    <button
                        key={item}
                        onClick={() => onSelectCategory && onSelectCategory(item)}
                        className={`px-5 py-2.5 rounded-full font-semibold text-sm transition shadow-sm ${
                            selectedCategory === item
                                ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-orange-500/30 shadow-md"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:text-orange-600"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Categories;
