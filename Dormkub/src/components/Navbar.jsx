import { useState, useEffect, useRef } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { Link, useNavigate } from "react-router-dom"; // ใช้สำหรับการนำทาง

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [dormitories, setDormitories] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  // const [isMenuOpen, setIsMenuOpen] = useState(false); // สำหรับเมนูบนมือถือ
  const [user, setUser] = useState(null); // เก็บข้อมูลผู้ใช้หลังจากเข้าสู่ระบบ
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // สำหรับ popup dropdown ของโปรไฟล์
  const dropdownRef = useRef(null);
  const navigate = useNavigate(); // สำหรับนำทาง

  // ฟังก์ชันค้นหาหอพัก
  // ฟังก์ชันค้นหาหอพัก
  const searchDormitories = debounce(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setDormitories([]);
      return;
    }

    

    try {
      const response = await axios.get(
        "http://localhost:5000/api/dormitories/dorm/search",
        {
          params: { searchTerm: searchTerm },
        }
      );

      if (!searchTerm.trim() || response.data.filteredRooms.length === 0) {
        setShowDropdown(false); // ปิด dropdown หากไม่มีข้อมูล
        setDormitories([]); // ล้างข้อมูลใน dropdown 
        return;
      }
      

      // ดึงข้อมูลจาก filteredRooms
      setDormitories(response.data.filteredRooms);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching dormitories:", error);
      setDormitories([]);
      setShowDropdown(false);
      alert("เกิดข้อผิดพลาดในการค้นหา กรุณาลองใหม่อีกครั้ง");
    }
  }, 300);

  // ฟังก์ชันดึงข้อมูลผู้ใช้หลังจากเข้าสู่ระบบ
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          {
            withCredentials: true, // เพื่อส่ง cookie JWT ไปพร้อมกับคำขอ
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
      .post("http://localhost:5000/auth/logout", {}, { withCredentials: true })
      .then((response) => {
        console.log("Logout response:", response.data.filteredRooms);
        setUser(null);
        navigate("/"); // นำทางไปหน้าแรก
      })
      .catch((error) => {
        console.error("Logout error:", error); // ตรวจสอบ error ว่าเกิดอะไรขึ้น
      });
  };

  // click to room detail
  const handleSelectDormitory = (roomId) => {
    setShowDropdown(false); // ปิด dropdown เมื่อเลือกแล้ว
    navigate(`/room/${roomId}`); // นำทางไปยัง RoomDetail โดยใช้ roomId
  };
  

  return (
    <nav className="bg-[#03045E] p-2">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        {/* Logo และ Dormkub Link */}
        <div className="flex items-center space-x-2">
          {/* เพิ่ม logo */}
          <Link to="/" >
            <img src="https://github.com/Nobpanat/Dormkub/blob/main/DormkubImg/Frame%2084@2x.png?raw=true" alt="Logo" 
            className="w-20 h-10 lg:w-24 lg:h-14" />
          </Link>
        </div>

        {/* ลิงก์และช่องค้นหา */}
        <div className="flex flex-wrap items-center space-y-2 lg:space-y-0 lg:space-x-4 w-full lg:w-auto mt-2 lg:mt-0">
          {/* Input สำหรับการค้นหา */}
          <div className="relative flex-grow lg:flex-grow-0 w-full lg:w-64 mb-2 lg:mb-0">
            <input
              type="text"
              placeholder="ค้นหาหอพัก..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (dormitories.length > 0) setShowDropdown(true);
              }}
              className="w-full px-3 py-1 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {showDropdown && dormitories.length > 0 && (
              <ul className="absolute top-10 left-0 w-full bg-white shadow-lg rounded-md overflow-hidden max-h-60 overflow-y-auto z-10">
                {dormitories && dormitories.length > 0 ? (
                  dormitories.map((dorm) => (
                    <li
                      key={dorm._id}
                      className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectDormitory(dorm._id)}
                    >
                      <img
                        src={dorm.roomImage[0] || "/default-dorm.png"}
                        alt={dorm.id_dormitory.name}
                        className="w-10 h-10 object-cover rounded mr-2"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {dorm.id_dormitory.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          ราคา: {dorm.rent.toLocaleString()} บาท
                        </span>
                        <span className="text-sm text-gray-600">
                          ที่อยู่: {dorm.id_dormitory.address}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-600">
                    ไม่พบหอพักที่ตรงกับการค้นหา
                  </li> // แสดงข้อความถ้าไม่พบข้อมูล
                )}
              </ul>
            )}
          </div>

          {/* ลิงก์เพิ่มเติม */}
          <div className="flex flex-wrap justify-center lg:justify-start space-x-2">
            <Link to="/ManageContract" className="text-white hover:text-gray-400 text-sm">
              ลงประกาศ
              <br /> ขายสัญญา
              <br /> จัดการสัญญา
            </Link>
            <Link to="/ManageDormitory" className="text-white hover:text-gray-400 text-sm">
              ลงประกาศ
              <br /> หอพัก
              <br /> จัดการหอพัก
            </Link>
            <Link to="/bookingList" className="text-white hover:text-gray-400 text-sm">
              รายการ <br />
              จองหอพัก
            </Link>
          </div>

          {/* ตรวจสอบว่ามีการล็อกอินแล้วหรือยัง */}
          {user ? (
            <div className="relative flex-shrink-0 ml-auto lg:ml-0">
              <img
                src={user.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation(); // ป้องกันการคลิกภายนอกปิด dropdown
                  setShowProfileDropdown((prev) => !prev); // สลับสถานะ dropdown
                }}
              />
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-10">
                  <Link
                    to="/history"
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                  >
                    ประวัติการจอง
                  </Link>
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
            <Link
              to="/login"
              className="text-white hover:text-gray-400 ml-auto lg:ml-0"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </div>
      </div>
    </nav>

    //     <header className="bg-[#03045E] text-white p-4 flex justify-between items-center">
    //     <div className="flex items-center">
    //         <div className="bg-gray-300 w-12 h-12 mr-2"></div>
    //         <h1 className="text-2xl font-bold">Dormkub</h1>
    //     </div>
    //     <div className="flex items-center">
    //         <input type="text" className="p-2 rounded-l" placeholder="Search..." />
    //         <button className="bg-white text-black p-2 rounded-r">
    //             <i className="fas fa-search"></i>
    //         </button>
    //     </div>
    //     <div className="flex space-x-4">
    //         <a href="#" className="text-white">ลงประกาศหาผู้เช่าหอพัก</a>
    //         <a href="#" className="text-white">ลงประกาศหอพัก</a>
    //         <a href="#" className="text-white">เข้าสู่ระบบ</a>
    //     </div>
    // </header>
  );
};

export default Navbar;
