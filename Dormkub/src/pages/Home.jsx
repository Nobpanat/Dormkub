// src/pages/Home.jsx
import Navbar from '../components/Navbar';
import Bandner from '../components/Bandner';
import Suggest from '../components/Sugget';
import Footer from '../components/Footer';
const Home = () => {
    return (
       <>
        < Navbar />
        <Bandner />
        <div className='my-8'>

          <Suggest />
        </div>
         <Footer />
       </> 
    );
  };
  
  export default Home;
  