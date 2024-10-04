import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './companiesAd.css';

import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';

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
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showSelectedModal, setShowSelectedModal] = useState(false);

    // For Adding a Vessel
    const [showVesselModal, setShowVesselModal] = useState(false);
    const [vesselDetails, setVesselDetails] = useState({
        name: '',
        size: { length: '', width: '', draft: '' },
        capacity: { passengers: '', vehicles: '' },
        deckLevels: '',
        schedule: { S: false, M: false, T: false, W: false, Th: false, F: false, Sat: false },
        image: null
    });

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

    // For Vessel
    const handleVesselInputChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVesselSizeChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails(prev => ({
            ...prev,
            size: { ...prev.size, [name]: value }
        }));
    };

    const handleVesselCapacityChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails(prev => ({
            ...prev,
            capacity: { ...prev.capacity, [name]: value }
        }));
    };

    const handleVesselScheduleChange = (day) => {
        setVesselDetails(prev => ({
            ...prev,
            schedule: { ...prev.schedule, [day]: !prev.schedule[day] }
        }));
    };

    const handleVesselImageChange = (e) => {
        setVesselDetails(prev => ({
            ...prev,
            image: e.target.files[0]
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

    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        setShowSelectedModal(true);
    };

    const handleUpdateCompany = async () => {
        if (!selectedCompany) return;

        try {
            const db = getFirestore();
            const companyRef = doc(db, 'companies', selectedCompany.id);
            await updateDoc(companyRef, selectedCompany);

            alert('Company updated successfully!');
            setShowSelectedModal(false);
        } catch (error) {
            console.error('Error updating company:', error);
            alert('Failed to update company.');
        }
    };

    const handleSelectedCompanyChange = (e) => {
        const { name, value } = e.target;
        setSelectedCompany((prevCompany) => ({
            ...prevCompany,
            [name]: value
        }));
    };

    // For Vessel 
    const handleAddVessel = async () => {
        // Implement the logic to add the vessel to the company
        // This would involve updating the Firestore document for the company
        // and potentially uploading the vessel image to Firebase Storage
        console.log("Adding vessel:", vesselDetails);
        // Reset form and close modal after adding
        setVesselDetails({
            name: '',
            size: { length: '', width: '', draft: '' },
            capacity: { passengers: '', vehicles: '' },
            deckLevels: '',
            schedule: { S: false, M: false, T: false, W: false, Th: false, F: false, Sat: false },
            image: null
        });
        setShowVesselModal(false);
    };

    return (
        <div className="companies-container">
            <div className="content-wrapper">
                <h2 className="text-2xl font-bold mb-4">Partnered Companies</h2>
                <div className="logo-container">
                    <img src='/images/select ferry.png' alt="Logo" className="logo" />

                    {/* search bar */}
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

                {/* displays companies */}
                <div className="company-grid">
                    {companies
                        .filter(company => company.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((company, index) => (
                            <div
                                key={index}
                                className="company-logo"
                                onClick={() => handleCompanyClick(company)}
                            >
                                <img src={company.logoPath} alt={company.name} className="company-image" />
                                <span className="ml-2">{company.name}</span>
                            </div>
                        ))}
                </div>

                {/* Delete and Add a Company buttons */}
                <div className="action-buttons">
                    <button className="button button-delete">Delete A Company</button>
                    <button className="button button-add" onClick={() => setShowModal(true)}>Add A Company</button>
                </div>
            </div>

            {/* Add a company modal */}
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
                            <button onClick={handleUpdateCompany}>Update Company</button>
                            <button onClick={() => setShowVesselModal(true)}>Add a Vessel</button>
                            <button onClick={() => setShowSelectedModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Details Modal */}
            {showSelectedModal && selectedCompany && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close-button" onClick={() => setShowSelectedModal(false)}>✖</button>
                        <h3>{selectedCompany.name}</h3>  
                        <input
                            type="text"
                            name="name"
                            placeholder="Company Name"
                            value={selectedCompany.name}
                            onChange={handleSelectedCompanyChange}
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={selectedCompany.description}
                            onChange={handleSelectedCompanyChange}
                        />
                        <h4>Contact Person</h4>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={selectedCompany.contact.firstName}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={selectedCompany.contact.lastName}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="text"
                            name="position"
                            placeholder="Position"
                            value={selectedCompany.contact.position}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={selectedCompany.contact.phoneNumber}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={selectedCompany.contact.email}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={selectedCompany.contact.website}
                            onChange={handleSelectedCompanyChange}
                        />
                        <input
                            type="text"
                            name="otherLinks"
                            placeholder="Other Links"
                            value={selectedCompany.contact.otherLinks}
                            onChange={handleSelectedCompanyChange}
                        />
                        <div className="modal-buttons">
                            <button onClick={handleUpdateCompany}>Update Company</button>
                            <button onClick={() => setShowVesselModal(true)}>Add a Vessel</button>
                            <button onClick={() => setShowSelectedModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Vessel Modal */}
            {showVesselModal && (
                <div className="modal">
                    <div className="vessel-modal-content">
                        <button className="vessel-close-button" onClick={() => setShowVesselModal(false)}>✖</button>
                        <h3 className="ferry-header">Add a Vessel</h3>
                        {/* 
                        */}

                        <div className="ferry-name">
                            <h4 className="vessel-headers">Ferry Name<span className="required">*</span></h4>
                            <input
                                className="vessel-tbox"
                                id="vessel-name"
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={vesselDetails.name}
                                onChange={handleVesselInputChange}
                                min="0"
                                required
                            />

                        </div>
                        

                        <div className="ferry-size">
                            <h4 className="vessel-headers">Ferry Size<span className="required">*</span></h4>
                            <input
                                className="vessel-tbox"
                                id="vessel-length"
                                type="number"
                                name="length"
                                placeholder="Length"
                                value={vesselDetails.size.length}
                                onChange={handleVesselSizeChange}
                                min="0"
                                required
                            />
                            <input
                                className="vessel-tbox"
                                id="vessel-width"
                                type="number"
                                name="width"
                                placeholder="Width"
                                value={vesselDetails.size.width}
                                onChange={handleVesselSizeChange}
                                min="0"
                                required
                            />
                            <input
                                className="vessel-tbox"
                                id="vessel-draft"
                                type="number"
                                name="draft"
                                placeholder="Draft"
                                value={vesselDetails.size.draft}
                                onChange={handleVesselSizeChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="ferry-capacity">
                            <h4 className="vessel-headers">Capacity<span className="required">*</span></h4>
                            <input
                                className="vessel-tbox"
                                id="vessel-passengers"
                                type="number"
                                name="passengers"
                                placeholder="Passengers"
                                value={vesselDetails.capacity.passengers}
                                onChange={handleVesselCapacityChange}
                                min="0"
                                required
                            />
                            <input
                                className="vessel-tbox"
                                id="vessel-vehicles"
                                type="number"
                                name="vehicles"
                                placeholder="Vehicles"
                                value={vesselDetails.capacity.vehicles}
                                onChange={handleVesselCapacityChange}
                                min="0"
                                required
                            />
                        </div>

                        <select
                            id="vessel-deckLevels"
                            name="deckLevels"
                            value={vesselDetails.deckLevels}
                            onChange={handleVesselInputChange}
                            required
                        >
                            <option value="">Select Deck Levels</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            {/* Add more options as needed */}
                        </select>

                        <div className="ferry-schedule">
                            <h4 className="vessel-headers">Schedule<span className="required">*</span></h4>
                                <div className="days-container">
                                {Object.keys(vesselDetails.schedule).map(day => (
                                <button
                                    id="vessel-schedule"
                                    key={day}
                                    className={vesselDetails.schedule[day] ? 'active' : ''}
                                    onClick={() => handleVesselScheduleChange(day)}
                                >
                                {day}
                                </button>
                                ))}
                            </div>
                        </div>

                        <div className="ferry-image-upload">
                            <h4 className="vessel-headers">Ferry Picture<span className="required">*</span></h4>
                            <input
                                id="vessel-fileupload"
                                type="file"
                                accept="image/*"
                                onChange={handleVesselImageChange}
                            />
                        </div>

                        <div className="vessel-modal-buttons">
                            <button id="vessel-save" onClick={handleAddVessel}>Save Changes</button>
                            <button id="vessel-cancel" onClick={() => setShowVesselModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompaniesAd;
