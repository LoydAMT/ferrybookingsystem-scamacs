// src/pages/Companies.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';
import './Companies.css';


const Companies = () => {
  const [company, setcompany] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    // Fetch data from Firestore
    const fetchData = async () => {
      try {
        const db = getFirestore();
        const companyData = collection(db, 'companies'); 
        const companySnapshot = await getDocs(companyData);
        const companiesd = companySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(companiesd);
        setcompany(companiesd);
      } catch (error) {
        console.error("Error fetching company data: ", error);
      }
    };
    fetchData();
  }, []);

  const renderStars = () => {
    return (
      <span>
        {[...Array(5)].map((_, i) => (
          <span key={i} className="star-filled">
            ★
          </span>
        ))}
      </span>
    );
  };
  return (
    <div className="ferry-selection">
      <div className="l-container">
        <img src='/images/select ferry.png' alt="Logo" className="logo" />
        <h2>Select Ferry</h2>
      </div>
      {company.map((c) => (
        <div key={c.id} className="ferry">
          <img src={c.logoPath} alt={c.name} className="ferry-image" />
          <div className="f-details">
            <h3>{c.name}</h3>
            <p>Description: {c.description}</p>
            <p>Website: {c.contact.website} </p>
            <p>Phone Number: {c.contact.phoneNumber}</p>
            <p>Email: {c.email}</p>
            <p className="ratings">Ratings: {renderStars()}</p>
            <button className="select-button">Select Ferry</button>
          </div>
        </div>
      ))}
    </div>
  );
};


export default Companies;