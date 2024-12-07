import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import RoomDetails from "./pages/RoomDetails";
import BookingList from "./pages/BookingList";
import ContractDetails from "./pages/ContractDetails";
import Payment from "./pages/PaymentPage";
import HistoryPage from "./pages/HistoryPage";
import ManageDormitory from "./pages/ManageDormitory";
import ManageContract from "./pages/ManageContract";
import AddDormitory from "./pages/AddDormitory";
import AddRoom from "./pages/AddRoom";
import AddContract from "./pages/AddContract";
import UpdateDormitory from "./pages/UpdateDormitory";
import UpdateContract from "./pages/UpdateContract";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route สำหรับหน้าแรก */}
        <Route path="/" element={<Home />} />

        {/* RoomDetails */}
        <Route path="/room/:id" element={<RoomDetails />} />

        {/* ContractDetails */}
        <Route path="/contract/:id" element={<ContractDetails />} />

        {/* Payment */}
        <Route path="/payment/:id" element={<Payment />} />

        {/* History */}
        <Route path="/history" element={<HistoryPage />} />

        {/* Manage Dormitory */}
        <Route path="/manageDormitory" element={<ManageDormitory />} />

        {/* Add Dormitory */}
        <Route path="/addDormitory" element={<AddDormitory />} />

        {/* Add Room */}
        <Route path="/add-room/:dormitoryId" element={<AddRoom />} />

        {/* Add Contract */}
        <Route path="/add-contract" element={<AddContract />} />

        {/* Manage Contract */}
        <Route path="/manageContract" element={<ManageContract />} />

        {/* Route สำหรับหน้า Login */}
        <Route path="/login" element={<Login />} />

        {/* Route for BookingList page */}
        <Route path="/bookinglist" element={<BookingList />} />

        {/* Route for UpdateDormitory page */}
        <Route path="/update-dormitory/:id" element={<UpdateDormitory />} />

        {/* Route for UpdateContract page */}
        <Route path="/update-contract/:id" element={<UpdateContract />} />
      </Routes>
    </Router>
  );
}

export default App;
