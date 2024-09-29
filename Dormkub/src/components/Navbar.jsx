import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { Link, useNavigate } from 'react-router-dom'; // ใช้สำหรับการนำทาง

const Navbar = () => {
  const [query, setQuery] = useState('');
  const [dormitories, setDormitories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // สำหรับเมนูบนมือถือ
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้หลังจากเข้าสู่ระบบ
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // สำหรับ popup dropdown ของโปรไฟล์
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // สำหรับนำทาง

  // ฟังก์ชันค้นหาหอพัก
  const searchDormitories = debounce(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') {
      setDormitories([]);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/dormitories/search', {
        params: { searchTerm: searchTerm },
      });
      setDormitories(response.data);
      setShowDropdown(true);
    } catch (error) {
      console.error('Error searching dormitories:', error);
      setDormitories([]);
      setShowDropdown(false);
      alert('เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง');
    }
  }, 300);

  // ฟังก์ชันดึงข้อมูลผู้ใช้หลังจากเข้าสู่ระบบ
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          withCredentials: true, // เพื่อส่ง cookie JWT ไปพร้อมกับคำขอ
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  // ฟังก์ชันเพื่อปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setShowProfileDropdown(false); // ปิดโปรไฟล์ dropdown
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    searchDormitories(query);
    return () => {
      searchDormitories.cancel();
    };
  }, [query]);

  // ฟังก์ชัน logout ที่แยกออกมา
  const handleLogout = () => {
    axios
      .post('http://localhost:5000/auth/logout', {}, { withCredentials: true })
      .then((response) => {
        console.log('Logout response:', response.data);
        setUser(null);
        navigate('/'); // นำทางไปหน้าแรก
      })
      .catch((error) => {
        console.error('Logout error:', error); // ตรวจสอบ error ว่าเกิดอะไรขึ้น
      });
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* ลิงก์ Dormkub กลับหน้าแรก */}
        <Link to="/" className="text-white text-2xl font-bold">Dormkub</Link>

        {/* Toggle สำหรับมือถือ */}
        <button
          className="text-white block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>

        {/* ลิงก์และช่องค้นหา */}
        <div className={`lg:flex items-center space-x-4 ${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
          {/* Input สำหรับการค้นหา */}
          <div className="relative" ref={dropdownRef}>
            <input
              type="text"
              placeholder="ค้นหาหอพัก..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => { if (dormitories.length > 0) setShowDropdown(true); }}
              className="w-full lg:w-72 px-4 py-2 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && dormitories.length > 0 && (
              <ul className="absolute top-12 left-0 w-full bg-white shadow-lg rounded-md overflow-hidden max-h-60 overflow-y-auto z-10">
                {dormitories.map((dorm) => (
                  <li key={dorm._id} className="flex items-center p-2 hover:bg-gray-100 cursor-pointer">
                    <img src={dorm.images[0]} alt={dorm.name} className="w-12 h-12 object-cover rounded mr-3" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{dorm.name}</span>
                      <span className="text-sm text-gray-600">ราคา: {dorm.price.toLocaleString()} บาท</span>
                      <span className='text-sm text-gray-600'>ที่อยู่: {dorm.address}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ลิงก์เพิ่มเติม */}
          
          <Link to="/about" className="text-white hover:text-gray-400">ลงประกาศขายสัญญาหอพัก</Link>
          <Link to="/services" className="text-white hover:text-gray-400">ลงประกาศหอพัก</Link>
          <Link to="/contact" className="text-white hover:text-gray-400">การแจ้งเตือน</Link>

          {/* ตรวจสอบว่ามีการล็อกอินแล้วหรือยัง */}
          {user ? (
            <div className="relative">
              <img
                src={user.profileImage || '/default-profile.png'}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการคลิกภายนอกปิด dropdown
                  setShowProfileDropdown((prev) => !prev); // สลับสถานะ dropdown
                }}
              />
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10">
                  <Link to="/account" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">ตั้งค่าบัญชี</Link>
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onMouseDown={handleLogout} // ใช้ onMouseDown แทน
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}

            </div>
          ) : (
            <Link to="/login" className="text-white hover:text-gray-400">เข้าสู่ระบบ</Link>
            
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
