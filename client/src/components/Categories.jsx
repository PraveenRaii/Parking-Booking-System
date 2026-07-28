const categories = [

    "Car",

    "Bike",

    "EV",

    "Bicycle",

    "Bus"

];

function Categories() {

    return (

        <div className="max-w-7xl mx-auto py-12">

            <h2 className="text-3xl font-bold mb-6">

                Categories

            </h2>

            <div className="flex flex-wrap gap-5">

                {

                    categories.map((item,index)=>(

                        <button

                        key={index}

                        className="px-6 py-3 rounded-full bg-blue-100 hover:bg-blue-600 hover:text-white transition">

                            {item}

                        </button>

                    ))

                }

            </div>

        </div>

    )

}

export default Categories;