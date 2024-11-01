// src/pages/Home.jsx
import Navbar from "../components/Navbar";
import Bandner from "../components/Bandner";
import Suggest from "../components/Suggest";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Bandner />
      <div className="min-h-screen bg-gray-100">
        <main className="my-4 px-2 w-full max-w-screen-xl mx-auto">
          <Suggest />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default Home;
