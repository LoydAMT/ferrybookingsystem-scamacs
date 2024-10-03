import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './companiesAd.css';

import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';


const CompaniesAd = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [companyDetails, setCompanyDetails] = useState({
        name: '',
        logo: null,
        description: '',
        contact: {
            firstName: '',
            lastName: '',
            position: '',
            phoneNumber: '',
            email: '',
            website: '',
            otherLinks: ''
        }
    });
    const [companies, setCompanies] = useState([]);

    // Fetch companies from Firestore
    useEffect(() => {
        const fetchCompanies = async () => {
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, 'companies'));
            const companyData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCompanies(companyData);
        };

        fetchCompanies();
    }, []);

    // const companyLogos = [
    //     { name: 'SuperCat', logo: '🚢' },
    //     { name: 'OceanJet', logo: '⛵' },
    //     { name: 'FastCat', logo: '🛥️' },
    //     { name: '2GO', logo: '🚢' },
    //     { name: 'Lite Shipping', logo: '⛴️' },
    //     { name: 'Starlite Ferries', logo: '🚤' },
    //     { name: 'Weesam Express', logo: '⛴️' },
    //     { name: 'Trans-Asia Shipping', logo: '🚢' },
    //     { name: 'Montenegro Shipping', logo: '🛳️' },
    //     { name: 'Cokaliong Shipping', logo: '🚤' },
    //     { name: 'Philippine Fast Ferry', logo: '🚤' },
    //     { name: 'Negros Navigation', logo: '🚢' },
    //     { name: 'Aleson Shipping', logo: '⛴️' },
    //     { name: 'Archipelago Ferries', logo: '🛳️' },
    //     { name: 'Batangas Star Ferry', logo: '🛥️' },
    // ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleContactChange = (e) => {
        const { name, value } = e.target;
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            contact: {
                ...prevDetails.contact,
                [name]: value
            }
        }));
    };

    const handleLogoChange = (e) => {
        setCompanyDetails((prevDetails) => ({
            ...prevDetails,
            logo: e.target.files[0]
        }));
    };

    const handleAddCompany = async () => {
        const { name, logo, description, contact } = companyDetails;
    
        if (!logo) {
            alert('Please upload a company logo');
            return;
        }
    
        // Create a unique folder for the company
        const companyId = uuidv4();
        const storage = getStorage();
        const storageRef = ref(storage, `admin_companies/${companyId}/logo.png`);
    
        try {
            // Upload logo
            await uploadBytes(storageRef, logo);
            const downloadURL = await getDownloadURL(storageRef); 
    
            // Save company data to Firestore
            const db = getFirestore();
            const companyData = {
                name,
                description,
                logoPath: downloadURL,
                contact: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    position: contact.position,
                    phoneNumber: contact.phoneNumber,
                    email: contact.email,
                    website: contact.website,
                    otherLinks: contact.otherLinks || 'N/A', 
                },
                timestamp: new Date(),
            };
    
            const docRef = await addDoc(collection(db, 'companies'), companyData);
            console.log('Company Document written with ID: ', docRef.id);
            alert('Company added successfully!');
        } catch (error) {
            console.error('Error uploading company data:', error);
            alert(`Failed to add company: ${error.message}`);
        } finally {
            setCompanyDetails({
                name: '',
                logo: null,
                description: '',
                contact: {
                    firstName: '',
                    lastName: '',
                    position: '',
                    phoneNumber: '',
                    email: '',
                    website: '',
                    otherLinks: ''
                }
            });
            setShowModal(false);
        }
    };
    
    return (
        <div className="companies-container">
            <div className="content-wrapper">
                <h2 className="text-2xl font-bold mb-4">Partnered Companies</h2>
                <div className="logo-container">
                <img src='/images/select ferry.png' alt="Logo" className="logo" />
       
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                </div>
                <div className="company-grid">
                    {/* {companyLogos.map((company, index) => (
                        <div key={index} className="company-logo">
                            <span className="text-4xl">{company.logo}</span>
                            <span className="ml-2">{company.name}</span>
                        </div>
                    ))} */}
                    {companies
                        .filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase())) 
                        .map((company, index) => (
                            <div key={index} className="company-logo">
                                <img src={company.logoPath} alt={company.name} className="company-image" />
                                <span className="ml-2">{company.name}</span>
                            </div>
                        ))}
                </div>

                <div className="action-buttons">
                    <button className="button button-delete">Delete A Company</button>
                    <button className="button button-add" onClick={() => setShowModal(true)}>Add A Company</button>

                </div>
            </div>

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
                        <h3>Add a Company</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Company Name"
                            value={companyDetails.name}
                            onChange={handleInputChange}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={companyDetails.description}
                            onChange={handleInputChange}
                        />
                        <h4>Contact Person</h4>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={companyDetails.contact.firstName}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={companyDetails.contact.lastName}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="position"
                            placeholder="Position"
                            value={companyDetails.contact.position}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={companyDetails.contact.phoneNumber}
                            onChange={handleContactChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={companyDetails.contact.email}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="website"
                            placeholder="Website URL"
                            value={companyDetails.contact.website}
                            onChange={handleContactChange}
                        />
                        <input
                            type="text"
                            name="otherLinks"
                            placeholder="Other Links"
                            value={companyDetails.contact.otherLinks}
                            onChange={handleContactChange}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleAddCompany}>Add Company</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CompaniesAd;
