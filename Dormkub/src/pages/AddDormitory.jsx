// AddDormitory.js
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DormitoryForm from "../components/DormitoryForm";

const AddDormitory = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">เพิ่มหอพัก</h1>
          <DormitoryForm />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default AddDormitory;
