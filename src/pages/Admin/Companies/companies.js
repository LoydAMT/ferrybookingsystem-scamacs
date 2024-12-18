import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './companiesAd.css';

import { v4 as uuidv4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
// import { firestore } from '../../../firebase';

const CompaniesAd = () => {
    const newVesselUid = uuidv4();
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    //for from and to dropdown
    const [locations, setLocations] = useState([]);


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
    const [showVesselModal, setShowVesselModal] = useState(false);

    const [vesselDetails, setVesselDetails] = useState({
        name: '',
        price: { economy: '', business: '' },
        from: '',
        to: '',
        capacity: { passengers: '' },
        vehicle: '',
        vehicleDetails: [],
        vehicleDetail: { type: '', rate: '' },
        // time: '',
        times: [],
        image: null,
        status: 'Active',
        travelTime: {
            hours: '',
            minutes: ''
        },
        formattedTime: ''
    });

    //add time for add vessel
    const isTimeDisabled = !vesselDetails.travelTime.hours || !vesselDetails.travelTime.minutes;

    // const [vesselDetails, setVesselDetails] = useState({
    //     name: '',
    //     size: { length: '', width: '', draft: '' },
    //     capacity: { passengers: '', vehicles: '' },
    //     deckLevels: '',
    //     schedule: { S: false, M: false, T: false, W: false, Th: false, F: false, Sat: false },
    //     image: null
    // });
    // Handle changes to vessel price (economy, business)

    // Fetch companies from Firestore
    useEffect(() => {
        const fetchCompanies = async () => {
            const db = getFirestore();
            const querySnapshot = await getDocs(collection(db, 'companies'));
            const companyData = querySnapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            }));
            setCompanies(companyData);
        };

        fetchCompanies();
    }, []);

    const [logoPreview, setLogoPreview] = useState(null); // State for logo preview
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
        const file = e.target.files[0];
        if (file) {
            setCompanyDetails((prevDetails) => ({
                ...prevDetails,
                logo: e.target.files[0]
            }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result); // Set the logo preview URL
            };
            reader.readAsDataURL(file); // Read the file as a Data URL
        } else {
            setLogoPreview(null); // Reset if no file is selected
        }
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
            showSuccessModal('Company added successfully!');

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

    // Function to show a generic success modal
    const showSuccessModal = (message) => {
        // Create the modal container
        const modal = document.createElement('div');
        modal.classList.add('successModal-overlay');
        modal.innerHTML = `
        <div class="successModal-content">
            <h2>Success</h2>
            <p>${message}</p>
            <button class="successModal-close-btn">OK</button>
        </div>
    `;

        // Append modal to the body
        document.body.appendChild(modal);

        // Add event listener to close the modal
        modal.querySelector('.successModal-close-btn').addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
            }, 300);
        });

        // Activate modal animation
        setTimeout(() => modal.classList.add('active'), 10);
    };



    const handleCompanyClick = (company) => {
        setSelectedCompany(company);
        setShowSelectedModal(true);
    };




    const handleUpdateCompany = async () => {
        if (!selectedCompany) return;

        try {
            const db = getFirestore();
            const companyRef = doc(db, 'companies', selectedCompany.uid);
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

    // For Add A Vessel - this is the start
    const handleVesselInputChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const db = getFirestore();
                const querySnapshot = await getDocs(collection(db, 'Location'));
                const locationData = querySnapshot.docs.map((doc) => doc.id); // Using the document ID as location name
                console.log("Fetched Locations:", locationData); // Verify the structure
                setLocations(locationData);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);
    //console.log("Location Data:", locationData);




    // const handleVesselSizeChange = (e) => {
    //     const { name, value } = e.target;
    //     setVesselDetails(prev => ({
    //         ...prev,
    //         size: { ...prev.size, [name]: value }
    //     }));
    // };

    // const handleVesselScheduleChange = (day) => {
    //     setVesselDetails(prev => ({
    //         ...prev,
    //         schedule: { ...prev.schedule, [day]: !prev.schedule[day] }
    //     }));
    // };

    // const handleVesselImageChange = (e) => {
    //     setVesselDetails(prev => ({
    //         ...prev,
    //         image: e.target.files[0]
    //     }));
    // };

    const handleVesselLogoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result); // Set the preview to the base64 image
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    // For Vessel 
    const handleAddVessel = async () => {
        if (!selectedCompany) {
            console.error("No company selected.");
            return;
        }

        const companyUid = selectedCompany.uid; // Get the selected company's UID


        const vesselData = {
            name: vesselDetails.name,
            status: 'Active',
            price: {
                economy: vesselDetails.price.economy,
                business: vesselDetails.price.business
            },
            from: vesselDetails.from,
            to: vesselDetails.to,
            travelTime: {
                hours: vesselDetails.travelTime.hours,
                minutes: vesselDetails.travelTime.minutes
            },
            capacity: {
                passengers: vesselDetails.capacity.passengers
            },
            vehicle: vesselDetails.vehicle,
            vehicleDetails: vesselDetails.vehicleDetails,
            vehicleDetail: {
                type: vesselDetails.vehicleDetail.type,
                rate: vesselDetails.vehicleDetail.rate
            },

            details: vesselDetails.time,
            time: vesselDetails.formattedTime,
            times: vesselDetails.times,
            image: vesselDetails.image,
        };





        try {
            const db = getFirestore();

            // Add the vessel to Firestore inside the Vessels/{companyUid}/VesselList
            const newVesselRef = await addDoc(
                collection(db, `Vessels/${companyUid}/VesselList`),
                vesselData // auto-ID
            );

            const newVesselUid = newVesselRef.id; // Get the auto-generated ID
            console.log(`Vessel added with ID: ${newVesselUid} to company ${companyUid}`);



            // trial if this works or not, nigana ra
            const companyDoc = await getDoc(doc(db, "companies", companyUid));
            if (!companyDoc.exists()) {
                console.error("Company not found!");
                return;
            }

            const companyName = companyDoc.data().name;


            const adminData = {
                companyUid,
                companyName,
                capacity: {
                    passengers: vesselDetails.capacity.passengers
                },
                from: vesselDetails.from,
                to: vesselDetails.to,
                details: vesselDetails.time,
                image: vesselDetails.image,
                name: vesselDetails.name,
                price: {
                    economy: vesselDetails.price.economy,
                    business: vesselDetails.price.business
                },
                status: 'Active',
                travelTime: {
                    hours: vesselDetails.travelTime.hours,
                    minutes: vesselDetails.travelTime.minutes
                },
                time: vesselDetails.formattedTime,
                times: vesselDetails.times,
                vehicle: vesselDetails.vehicle,
                vehicleDetail: {
                    type: vesselDetails.vehicleDetail.type,
                    rate: vesselDetails.vehicleDetail.rate
                },
                vehicleDetails: vesselDetails.vehicleDetails
            };

            const adminDataRef = await addDoc(
                collection(db, 'adminData'),
                adminData
            );

            showSuccessModal('Vessel added successfully!');


        } catch (error) {
            console.error("Error adding vessel:", error);
        }

        // Reset the form and close the modal
        setVesselDetails({
            name: '',
            status: 'Active',
            price: { economy: '', business: '' },
            from: '',
            to: '',
            travelTime: {
                hours: '',
                minutes: ''
            },
            capacity: { passengers: '' },
            vehicle: '',
            vehicleDetails: [],
            vehicleDetail: { type: '', rate: '' },
            time: '',
            times: [],
            image: null,
        });
        setShowVesselModal(false);
    };


    const handleVesselPriceChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            price: {
                ...prevDetails.price,
                [name]: value,
            },
        }));
    };

    const handleVesselCapacityChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails(prev => ({
            ...prev,
            capacity: { ...prev.capacity, [name]: value }
        }));
    };

    // Handle changes to vehicle selection (yes/no)
    // const handleVehicleChange = (e) => {
    //     const { value } = e.target;
    //     setVesselDetails((prevDetails) => ({
    //         ...prevDetails,
    //         vehicle: value,
    //     }));
    // };
    const handleVehicleChange = (e) => {
        const { value } = e.target;
        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            vehicle: value,
            vehicleDetails: value === 'no' ? [] : prevDetails.vehicleDetails, // Clear list if "No"
        }));
    };


    // Handle changes to vehicle details (type, rate)
    // const handleVehicleDetailsChange = (index, e) => {
    //     const { name, value } = e.target;
    //     setVesselDetails((prevDetails) => {
    //         const updatedVehicles = [...prevDetails.vehicleDetails];
    //         updatedVehicles[index] = { ...updatedVehicles[index], [name]: value };
    //         return {
    //             ...prevDetails,
    //             vehicleDetails: updatedVehicles,
    //         };
    //     });
    // };
    // Handle changes to vehicle details (type, rate)
    const handleVehicleDetailsChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            vehicleDetail: {
                ...prevDetails.vehicleDetail,
                [name]: value,
            }
        }));
    };



    // Add a vehicle to the list of vehicles (if applicable)
    const handleAddVehicle = () => {
        if (vesselDetails.vehicleDetail.type && vesselDetails.vehicleDetail.rate) {
            setVesselDetails((prevDetails) => ({
                ...prevDetails,
                vehicleDetails: [
                    ...prevDetails.vehicleDetails,
                    { ...prevDetails.vehicleDetail }
                ],
                vehicleDetail: { type: '', rate: '' } // Reset vehicle details input after adding
            }));
        }
    };


    // Remove a vehicle from the list of vehicles
    const handleRemoveVehicle = (index) => {
        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            vehicleDetails: prevDetails.vehicleDetails.filter((_, i) => i !== index),
        }));
    };

    // Handle time input change
    const handleTimeInputChange = (e) => {
        const { name, value } = e.target;
        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            travelTime: {
                ...prevDetails.travelTime,
                [name]: value,
            },
        }));
    };
    // Add time to the list of times
    const handleAddTime = () => {
        const { hours, minutes } = vesselDetails.travelTime;
        const { time, from, to, times } = vesselDetails;

        if (hours && minutes && time) {
            // Calculate the travel time in minutes
            const travelTimeInMinutes = parseInt(hours) * 60 + parseInt(minutes);

            // Create a new Date object for the departure time (set it to current Philippine time)
            const departureTime = new Date(`1970-01-01T${time}:00+08:00`);

            // Calculate the return time by adding travel time and 1-hour break
            const returnTime = new Date(departureTime);
            returnTime.setMinutes(returnTime.getMinutes() + travelTimeInMinutes + 60);

            // Format the times as HH:mm AM/PM
            const formattedDepartureTime = departureTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });
            const formattedReturnTime = returnTime.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', hour12: true });

            // Calculate conflict windows
            const departureStartTime = new Date(departureTime);
            departureStartTime.setMinutes(departureStartTime.getMinutes() - travelTimeInMinutes - 59); // 1 hour before departure - travel time
            const returnEndTime = new Date(returnTime);
            returnEndTime.setMinutes(returnEndTime.getMinutes() + travelTimeInMinutes + 59); // 1 hour after return time

            // Check if any of the times in the list conflict with the new time range
            const hasConflict = times.some(({ time: existingTime }) => {
                // Parse existing time correctly into a Date object
                const existingTimeDate = new Date(`1970-01-01T${existingTime}:00+08:00`);

                // Check if the existing time is within the conflict range
                return (existingTimeDate >= departureStartTime && existingTimeDate <= returnEndTime) ||
                    (existingTimeDate >= departureTime && existingTimeDate <= returnTime);
            });

            // If no conflict, add both times to the list
            if (!hasConflict) {
                const newTimes = [
                    `${from} - ${to} - (Travel Time: ${travelTimeInMinutes} minutes) (${formattedDepartureTime})`,
                    `${to} - ${from} - (Travel Time: ${travelTimeInMinutes} minutes) (${formattedReturnTime})`
                ];

                const newEntries = [
                    { from, to },
                    { from: to, to: from }
                ];

                // Save formatted time for vesselDetails.formattedTime
                const formattedTime = newTimes.map(item => {
                    // Extract formatted time like "1:00 AM" or "2:00 PM"
                    const timeMatch = item.match(/\(([^)]+)\)/);
                    return timeMatch ? timeMatch[1] : '';
                });

                // Update vesselDetails with formatted times
                setVesselDetails((prevDetails) => ({
                    ...prevDetails,
                    times: [
                        ...prevDetails.times,
                        { details: newTimes[0], travelTimeInMinutes, time: formattedDepartureTime, from: from, to: to },
                        { details: newTimes[1], travelTimeInMinutes, time: formattedReturnTime, from: to, to: from },
                    ],
                    time: '', // Reset the time input
                    formattedTime: formattedTime.join(', '), // Store formatted times
                }));
            } else {
                console.log("Conflict detected! Cannot add the new times.");
            }
        }
    };








    // Remove time from the list of times
    const handleRemoveTime = (index) => {
        const isEven = index % 2 === 0;

        let updatedTimes;

        if (isEven) {
            // If the index is even, remove both the current time and the next time (pair)
            updatedTimes = vesselDetails.times.filter((_, idx) => idx !== index && idx !== index + 1);
        } else {
            // If the index is odd, remove both the current time and the previous time (pair)
            updatedTimes = vesselDetails.times.filter((_, idx) => idx !== index && idx !== index - 1);
        }

        setVesselDetails((prevDetails) => ({
            ...prevDetails,
            times: updatedTimes,
        }));
    };



    return (
        <div className="companies-container">
            <div className="content-wrapper">
                <h2 className="text-2xl font-bold mb-4">Partnered Companies</h2>
                <div className="logo-container">
                    <img src='/images/select ferry.png' alt="Logo" className="logo1" />

                    {/* search bar */}
                    <div className="search-bar1">
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

                        <div className="modal-header">
                            <img src='/images/SWIFT_SAIL_9.png' alt="Logo" className="logo" />
                            <h3>Add a Company</h3>
                            <button className="close-button" onClick={() => setShowModal(false)}>✖</button>
                        </div>
                        <div className="form-container">
                            <div className="logo-upload" onClick={() => document.getElementById('file-upload').click()}>
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span>Upload Company Logo</span>
                                )}
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                            </div>

                            <div className="company-details">
                                <label htmlFor="company-name">Company Name</label>
                                <input
                                    type="text"
                                    id="company-name"
                                    name="name"
                                    required
                                    value={companyDetails.name}
                                    onChange={handleInputChange}
                                />

                                <label htmlFor="company-description">Description</label>
                                <textarea
                                    id="company-description"
                                    name="description"
                                    required
                                    value={companyDetails.description}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <h4 style={{ color: 'skyblue' }}>Primary Contact Person</h4>
                        <div className="contact-person-row">
                            <div className="contact-input1">
                                <label htmlFor="first-name">First Name</label>
                                <input
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    required
                                    value={companyDetails.contact.firstName}
                                    onChange={handleContactChange}
                                />
                            </div>
                            <div className="contact-input1">
                                <label htmlFor="last-name">Last Name</label>
                                <input
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    required
                                    value={companyDetails.contact.lastName}
                                    onChange={handleContactChange}
                                />
                            </div>
                            <div className="contact-input1">
                                <label htmlFor="position">Position</label>
                                <input
                                    type="text"
                                    id="position"
                                    name="position"
                                    required
                                    value={companyDetails.contact.position}
                                    onChange={handleContactChange}
                                />
                            </div>
                        </div>

                        <div className="contact-person-row2">
                            <div className="contact-input2">
                                <label htmlFor="phone-number">Phone Number</label>
                                <input
                                    type="text"
                                    id="phone-number"
                                    name="phoneNumber"
                                    required
                                    value={companyDetails.contact.phoneNumber}
                                    onChange={handleContactChange}
                                />
                            </div>
                            <div className="contact-input2">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={companyDetails.contact.email}
                                    onChange={handleContactChange}
                                />
                            </div>
                        </div>

                        <div className="contact-input">
                            <label htmlFor="website">Website URL</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                required
                                value={companyDetails.contact.website}
                                onChange={handleContactChange}
                            />
                        </div>
                        <div className="contact-input">
                            <label htmlFor="other-links">Other Links</label>
                            <input
                                type="text"
                                id="other-links"
                                name="otherLinks"
                                value={companyDetails.contact.otherLinks}
                                onChange={handleContactChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleAddCompany}>Add Company</button>
                            {/* <button onClick={() => setShowVesselModal(true)}>Add a Vessel</button> */}
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Company Details Modal */}
            {showSelectedModal && selectedCompany && (
                <div className="modaldetail">
                    <div className="modaldetail-content">
                        <div className="modal-detail">
                            <img src='/images/SWIFT_SAIL_9.png' alt="Logo" className="logo" />
                            <h3>{selectedCompany.name}</h3>
                            <button className="close-button" onClick={() => setShowSelectedModal(false)}>✖</button>
                        </div>

                        <div className="form-row">
                            <div className="logo-detail" >

                                <img
                                    src={selectedCompany.logoPath} // Use the fetched Firebase URL for the image
                                    alt="Company Logo"
                                />

                            </div>

                            <textarea
                                name="description"
                                placeholder="Description"
                                value={selectedCompany.description}
                                onChange={handleSelectedCompanyChange}
                            />
                        </div>
                        <h4 >Contact Person</h4>
                        <div className='add-detail'>
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
                        </div>
                        <div className='add-detail2'>
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
                        </div>
                        <div className='add-detail3'>
                            <input
                                type="text"
                                name="otherLinks"
                                placeholder="Other Links"
                                value={selectedCompany.contact.otherLinks}
                                onChange={handleSelectedCompanyChange}
                            />
                        </div>
                        <div className="modal-buttons">
                            <button onClick={handleUpdateCompany}>Update Company</button>
                            <button onClick={() => setShowVesselModal(true)}>Add a Vessel</button>
                            <button onClick={() => setShowSelectedModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Vessel Modal */}
            {/* Add Vessel Modal */}
            {showVesselModal && (
                <div className="modal">
                    <div className="vessel-modal-content">

                        <div className="modal-header">
                            <img src='/images/SWIFT_SAIL_9.png' alt="Logo" className="logo" />
                            <button className="vessel-close-button" onClick={() => setShowVesselModal(false)}>✖</button>
                            <h3 className="ferry-header">Add a Vessel</h3>
                        </div>

                        <div className="ferry-nameandpicture">
                            {/* Ferry Name */}
                            <div className="ferry-name">
                                <h4 className="vessel-headers">Vessel Name<span className="required">*</span></h4>
                                <input
                                    className="vessel-tbox"
                                    id="vessel-name"
                                    type="text"
                                    name="name"
                                    value={vesselDetails.name}
                                    onChange={handleVesselInputChange}
                                    required
                                />
                            </div>

                            {/* Ferry Image */}
                            <div className="ferry-image-upload">
                                <div className="ferry-image-upload-inputs">
                                    <h4 className="vessel-headers">Ferry Picture<span className="required">*</span></h4>
                                    <div className="vessel-image-upload" onClick={() => document.getElementById('file-upload').click()}>
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Vessel image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <span>Upload Image here</span>
                                        )}
                                    </div>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleVesselLogoChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Travel Time Inputs */}
                        <div className="travel-time-container">
                            <h4 className="vessel-headers">Travel Time</h4>
                            <div className="travel-time-inputs">
                                <div className="travel-time-input-group">
                                    <label className="label">Hour/s<span className="required">*</span></label>
                                    <input
                                        className="travel-time-input"
                                        type="number"
                                        placeholder="Hours"
                                        value={vesselDetails.travelTime.hours}
                                        onChange={(e) => setVesselDetails(prev => ({
                                            ...prev,
                                            travelTime: {
                                                ...prev.travelTime,
                                                hours: e.target.value
                                            }
                                        }))}
                                    />
                                </div>
                                <div className="travel-time-input-group">
                                    <label className="label">Minute/s<span className="required">*</span></label>
                                    <input
                                        className="travel-time-input"
                                        type="number"
                                        placeholder="Minutes"
                                        value={vesselDetails.travelTime.minutes}
                                        onChange={(e) => setVesselDetails(prev => ({
                                            ...prev,
                                            travelTime: {
                                                ...prev.travelTime,
                                                minutes: e.target.value
                                            }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Ferry Prices */}
                        <div className="ferry-price">
                            <h4 className="vessel-headers">Ferry Price</h4>

                            <div className="ferry-price-inputs2">
                                {/* Economy Class */}
                                <div className="ferry-price-input-group">
                                    <label className="ferry-price-label" htmlFor="economyPrice">
                                        Economy Class <span className="required">*</span>
                                    </label>
                                    <input
                                        className="ferry-price-input"
                                        id="economy-price"
                                        type="number"
                                        name="economy"
                                        value={vesselDetails.price.economy}
                                        onChange={handleVesselPriceChange}
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Business Class */}
                                <div className="ferry-price-input-group">
                                    <label className="ferry-price-label" htmlFor="businessPrice">
                                        Business Class <span className="required">*</span>
                                    </label>
                                    <input
                                        className="ferry-price-input"
                                        id="business-price"
                                        type="number"
                                        name="business"
                                        value={vesselDetails.price.business}
                                        onChange={handleVesselPriceChange}
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>


                        {/* From and To Destination */}
                        {/* From and To Destination */}
                        <div className="ferry-destination">
                            <h4 className="vessel-headers">From Destination<span className="required">*</span></h4>
                            <select
                                className="vessel-tbox"
                                id="vessel-from"
                                name="from"
                                value={vesselDetails.from}
                                onChange={handleVesselInputChange}
                                required
                            >
                                <option value="" disabled style={{ color: "black" }}>Select a location</option>
                                {locations.map((location) => (
                                    <option key={location} value={location} style={{ color: "black" }}>
                                        {location}
                                    </option>
                                ))}
                            </select>

                            <h4 className="vessel-headers">To Destination<span className="required">*</span></h4>
                            <select
                                className="vessel-tbox"
                                id="vessel-to"
                                name="to"
                                value={vesselDetails.to}
                                onChange={handleVesselInputChange}
                                required
                            >
                                <option value="" disabled style={{ color: "black" }}>Select a location</option>
                                {locations.length > 0 ? (
                                    locations
                                        .filter((location) => location !== vesselDetails.from) // Exclude the selected "from" value
                                        .map((location) => (
                                            <option key={location} value={location} style={{ color: "black" }}>
                                                {location}
                                            </option>
                                        ))
                                ) : (
                                    <option style={{ color: "black" }} disabled>No data fetched</option>
                                )}
                            </select>

                        </div>


                        {/* Passenger Capacity */}
                        <div className="ferry-capacity">
                            <h4 className="vessel-headers">Passenger Capacity<span className="required">*</span></h4>
                            <input
                                className="vessel-tbox"
                                id="vessel-passengers"
                                type="number"
                                name="passengers"
                                value={vesselDetails.capacity.passengers}
                                onChange={handleVesselCapacityChange}
                                min="0"
                                required
                            />
                        </div>

                        {/* Vehicle Capacity */}
                        <div className="ferry-vehicle">
                            <h4 className="vessel-headers">Vehicle<span className="required">*</span></h4>
                            <div className="select-container">
                                <select className="vessel-tbox" id="vessel-vehicle" name="vehicle" value={vesselDetails.vehicle} onChange={handleVehicleChange} required>
                                    <option value="">Select</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                                <span className="select-arrow">▼</span>
                            </div>


                            {vesselDetails.vehicle === 'yes' && (
                                <div className="vehicle-details">
                                    <div className="vehicle-inputs">
                                        {/* Vehicle Type Input */}
                                        <div className="vehicle-input-group vehicle-type">
                                            <label>Vehicle Type<span className="required">*</span></label>
                                            <input
                                                className="vessel-tbox"
                                                type="text"
                                                name="type"
                                                value={vesselDetails.vehicleDetail.type}
                                                onChange={handleVehicleDetailsChange}
                                                required
                                            />
                                        </div>

                                        {/* Vehicle Rate Input */}
                                        <div className="vehicle-input-group vehicle-rate">
                                            <label>Vehicle Rate<span className="required">*</span></label>
                                            <input
                                                className="vessel-tbox"
                                                type="number"
                                                name="rate"
                                                valu e={vesselDetails.vehicleDetail.rate}
                                                onChange={handleVehicleDetailsChange}
                                                min="0"
                                                required
                                            />
                                        </div>

                                        {/* Add Vehicle Button */}
                                        <button type="button" className="add-vehicle-btn" onClick={handleAddVehicle}>
                                            Add Vehicle
                                        </button>
                                    </div>

                                    {/* List of added vehicles */}
                                    {vesselDetails.vehicleDetails.length > 0 && (
                                        <ul className="vehicle-list">
                                            {vesselDetails.vehicleDetails.map((vehicle, index) => (
                                                <li key={index} onClick={() => handleRemoveVehicle(index)}>
                                                    {vehicle.type} - {vehicle.rate}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>


                        {/* Time Input */}
                        <div className="ferry-time">
                            <h4 className="vessel-headers">Departure Time<span className="required">*</span></h4>
                            <div className="ferry-time-inputs">
                                <input
                                    className="vessel-tbox"
                                    id="vessel-time"
                                    type="time"
                                    name="time"
                                    value={vesselDetails.time}
                                    onChange={(e) => setVesselDetails({ ...vesselDetails, time: e.target.value })}
                                    required
                                />
                                <button
                                    id="add-time"
                                    onClick={handleAddTime}
                                    disabled={isTimeDisabled}
                                >
                                    Add Time
                                </button>
                            </div>

                            {/* {vesselDetails.times.length > 0 && (
                                <ul className="time-list">
                                    {vesselDetails.times.map((item, index) => (
                                        <li key={index}>
                                            {item.time} (Travel Time: {item.travelTimeInMinutes} minutes)
                                        </li>
                                    ))}
                                </ul>
                            )} */}
                        </div>



                        {/* Times List */}
                        {/* Times List */}
                        {vesselDetails.times.length > 0 && (
                            <div className="time-list-container">
                                <h4>Time List</h4>
                                <ul className="time-list">
                                    {vesselDetails.times.map((item, index) => (
                                        <li key={index} onClick={() => handleRemoveTime(index)}>
                                            {item.details}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}



                        <div className="vessel-modal-buttons">
                            <button id="vessel-save" onClick={handleAddVessel}>Add Vessel</button>
                            <button id="vessel-cancel" onClick={() => setShowVesselModal(false)}>Cancel</button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default CompaniesAd;
