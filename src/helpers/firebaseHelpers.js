import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Adjust the path to your Firebase config file

/**
 * Fetch trips from Firestore based on the criteria.
 * @param {string} from - The origin location.
 * @param {string} to - The destination location.
 * @param {string} date - The date for the trip.
 * @returns {Promise<Array>} - A promise resolving to an array of trips.
 */
export const fetchTrips = async (from, to, date) => {
    const tripsRef = collection(db, 'Trips'); // Adjust the collection name as needed
    const q = query(tripsRef, where('from', '==', from), where('to', '==', to), where('date', '==', date));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

export const fetchTripsFromFirebase = async (companyUID, from, to, date) => {
    try {
      const tripsRef = collection(db, `vessels/${companyUID}/VesselList`);
      const tripsQuery = query(tripsRef, where('from', '==', from), where('to', '==', to), where('date', '==', date));
      const tripDocs = await getDocs(tripsQuery);
  
      return tripDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching trips from Firebase:', error);
      throw error;
    }
  };