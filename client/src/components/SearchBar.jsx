import { Search } from "lucide-react";

function SearchBar({ search = "", setSearch, placeholder = "Search Parking by name, area, or city..." }) {
    return (
        <div className="relative w-full">
            <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-orange-100 dark:border-slate-700 overflow-hidden focus-within:ring-2 focus-within:ring-orange-500 transition">
                <Search className="text-orange-500 ml-4 shrink-0" size={20} />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch && setSearch(e.target.value)}
                    className="w-full py-3.5 px-4 outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder:text-slate-400 text-sm md:text-base"
                    placeholder={placeholder}
                />
                {search && (
                    <button
                        onClick={() => setSearch && setSearch("")}
                        className="mr-4 text-xs font-bold text-slate-400 hover:text-orange-500"
                    >
                        CLEAR
                    </button>
                )}
            </div>
        </div>
    );
}

export default SearchBar;
