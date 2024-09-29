// src/pages/Loginjsx

import {Link} from 'react-router-dom';

const Login = () => {
    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };


    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <h2 className="text-2xl mb-4">เข้าสู่ระบบด้วย Google</h2>
        <p className="mb-6">คุณสามารถใช้ Google Account เพื่อเข้าสู่ระบบ</p>
        <button
          onClick={handleGoogleLogin}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Login with Google
        </button>
        <Link to="/" className="mt-4 text-blue-500 hover:underline">
          กลับไปหน้าหลัก
        </Link>
      </div> 
    );
};

export default Login;