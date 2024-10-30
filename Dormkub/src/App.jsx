import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Home from './pages/Home';
import RoomDetails from './pages/RoomDetails';
import BookingList from './pages/BookingList';

function App() {
  return (
    <Router>
      
      <Routes>
        {/* Route สำหรับหน้าแรก */}
        <Route path="/" element={<Home />} />

        {/* RoomDetails */}
        <Route path="/room/:id" element={<RoomDetails />} />

        {/* Route สำหรับหน้า Login */}
        <Route path="/login" element={<Login />} />

        {/* Route for BookingList page */}
        <Route path="/bookinglist" element={<BookingList />} />
      </Routes>
    </Router>
  );
}

export default App;
