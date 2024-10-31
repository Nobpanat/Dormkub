import {useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import axios from 'axios';

import ContractInformation from '../components/ContractInformation';    
import ImageCarousel from '../components/ImageCarousel';
import ActionButtons from '../components/ActionButtons';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import DetailContract from '../components/DetailContract';

const ContractDetails = () => {
    const {id} = useParams();
    const [contract, setContract] = useState(null);

    useEffect(() => {
        async function fetchContractDetails() {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/contracts/${id}`
                );
                setContract(response.data);
                // console.log(contract);
            } catch (error) {
                console.error('Error fetching contract details', error);
            }
        }
        fetchContractDetails();
    }, [id]);

    if (!contract) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="p-4">
                <ContractInformation
                    dormName={contract.DormitoryName}
                    address={contract.address}
                    rent={contract.rent}
                    description={contract.description}
                />
                <ImageCarousel images={contract.roomImage} />
                <ActionButtons contractId={contract._id} />
                <DetailContract contract={contract}/>
            </div>
            <Footer />
        </>
    );
};

export default ContractDetails;