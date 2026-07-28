import { useLocation, Link } from "react-router-dom";

function Success() {

    const { state } = useLocation();

    const booking = state?.booking;

    const paymentMethod = state?.paymentMethod;

    return (

        <div className="flex justify-center items-center h-screen">

            <div className="bg-white shadow-xl rounded-xl p-10 text-center">

                <h1 className="text-5xl">

                    ✅

                </h1>

                <h2 className="text-3xl font-bold mt-4">

                    Payment Successful

                </h2>

                <p className="mt-4">

                    Booking ID :
                    <strong>

                        {booking?._id}

                    </strong>

                </p>

                <p>

                    Payment :
                    <strong>

                        {paymentMethod}

                    </strong>

                </p>

                <Link

                    to="/"

                    className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg"

                >

                    Back To Home

                </Link>

            </div>

        </div>

    );

}

export default Success;