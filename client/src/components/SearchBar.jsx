import { Search } from "lucide-react";

function SearchBar() {

    return (

        <div className="max-w-5xl mx-auto -mt-8">

            <div className="bg-white rounded-xl shadow-lg p-4 flex">

                <Search className="text-gray-500 mt-3 ml-2"/>

                <input

                    className="w-full outline-none px-4"

                    placeholder="Search Parking..."

                />

            </div>

        </div>

    )

}

export default SearchBar;