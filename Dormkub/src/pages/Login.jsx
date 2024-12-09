import { Link } from "react-router-dom";

// import img logo
import logo from "../assets/images/Frame 84@2x.png";

import GoogleSignInButton from "../components/GoogleSignInButton";
import Footer from "../components/Footer";

const LoginPage = () => {
  return (
    <div className="h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#03045E] text-white flex items-center justify-normal px-4 py-2 gap-20">
        <div className="flex items-center space-x-2">
          {/* เพิ่ม logo */}
          <Link to="/">
            <img src={logo} alt="Logo" className="w-20 h-10 lg:w-24 lg:h-14" />
          </Link>
        </div>
        <div className="text-lg">เข้าสู่ระบบ</div>
      </header>

      {/* Main Content */}
      <main className="flex justify-center items-center h-full">
        <div className="border border-gray-300 shadow-md rounded-md w-[600px] h-[300px] flex items-center p-4">
          {/* Left Section */}
          <div className="flex-1 flex flex-col items-center">
          <img src={logo} alt="Logo" className="w-32 h-24" />
            {/* <div className="h-24 w-24 bg-gray-300 mb-4" /> */}
            
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* <h3 className="text-base font-semibold mb-2">เข้าสู่ระบบด้วย</h3> */}
            <GoogleSignInButton />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LoginPage;
