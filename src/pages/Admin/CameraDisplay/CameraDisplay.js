import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { db } from './firebase'; // Import Firestore
import { doc, getDoc } from 'firebase/firestore'; // Firestore methods

const CameraDisplay = () => {
  const videoRef = useRef(null);
  const [isModelLoaded, setModelLoaded] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };

    // Load the face-api.js models
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      setModelLoaded(true);
    };

    loadModels();
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureFace = async () => {
    if (isModelLoaded && videoRef.current) {
      const detection = await faceapi
        .detectSingleFace(videoRef.current)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const descriptor = detection.descriptor;
        compareWithStoredAdmin(descriptor);
      } else {
        console.log("No face detected!");
      }
    }
  };

  const compareWithStoredAdmin = async (descriptor) => {
    // Fetch stored embeddings from Firestore
    const docRef = doc(db, 'adminFaces', 'adminUID'); // Replace 'adminUID' with the correct UID
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const storedEmbeddings = docSnap.data().faceEmbeddings;
      const distance = faceapi.euclideanDistance(descriptor, storedEmbeddings);
      if (distance < 0.6) {
        console.log("Face matched. Admin authenticated!");
        // Proceed to grant admin access
      } else {
        console.log("Face does not match. Access denied.");
      }
    } else {
      console.log("No stored face data for this admin.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Face Detection</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-lg" />
      <button 
        onClick={captureFace} 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Verify Face
      </button>
    </div>
  );
};

export default CameraDisplay;
