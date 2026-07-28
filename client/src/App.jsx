import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ParkingDetails from "./pages/ParkingDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Booking from "./pages/Booking";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import ManageParking from "./pages/ManageParking";
import AddParking from "./pages/AddParking";
import EditParking from "./pages/EditParking";
import ManageUsers from "./pages/ManageUsers";
import ManageBookings from "./pages/ManageBookings";
import AdminRoute from "./components/AdminRoute";
import HelpCenter from "./pages/HelpCenter";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
    <Routes>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parking/:id"
        element={
          <ProtectedRoute>
            <ParkingDetails />
          </ProtectedRoute>
        }
      />
<Route path="/booking" element={<Booking />} />
<Route path="/payment" element={<Payment />} />
<Route path="/success" element={<Success />} />
      <Route path="/login" element={<Login />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route
    path="/help"
    element={<HelpCenter />}
/>
      <Route

    path="/admin"

    element={

        <AdminRoute>

            <AdminDashboard/>

        </AdminRoute>

    }

/>
<Route
path="/admin/parking"
element={
<AdminRoute>
<ManageParking/>
</AdminRoute>
}
/>
<Route
path="/admin/add-parking"
element={
<AdminRoute>
<AddParking/>
</AdminRoute>
}
/>
<Route
path="/admin/edit/:id"
element={
<AdminRoute>
<EditParking/>
</AdminRoute>
}
/>
<Route
path="/admin/users"
element={
<AdminRoute>
<ManageUsers/>
</AdminRoute>
}
/>
<Route
path="/admin/bookings"
element={
<AdminRoute>
<ManageBookings/>
</AdminRoute>
}
/>


      <Route path="/signup" element={<Signup />} />

      <Route path="/profile" element={<Profile />} />

    </Routes>
    </div>
  );
}

export default App;