import React, { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, runTransaction } from 'firebase/firestore';
import { db } from '../../firebase';  // Make sure you import Firestore from your firebase config
import { auth } from '../../firebase'; // To get the current user ID (if needed for metadata)

const SecurityPanel = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing the camera:', err);
        alert(`Failed to access camera: ${err.message}`);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const imageDataURL = canvasRef.current.toDataURL('image/png');
      setCapturedImage(imageDataURL);
    }
  };

  const compressImage = async (imageDataURL, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = imageDataURL;
    });
  };

  const uploadToFirebase = async () => {
    if (!capturedImage) {
      alert('Please capture an image first');
      return;
    }

    if (!auth.currentUser) {
      alert('You must be logged in to upload face data');
      return;
    }

    if (!db) {
      console.error('Firestore is not initialized');
      alert('Database connection error. Please try again later.');
      return;
    }

    setIsUploading(true);

    try {
      // Compress the image
      const compressedImage = await compressImage(capturedImage);

      const storage = getStorage();
      const storageRef = ref(storage, `admin_faces/${Date.now()}.jpg`);

      // Convert base64 to a Blob
      const blob = await (await fetch(compressedImage)).blob();

      // Upload the image to Firebase Storage
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Use a transaction to ensure atomicity
      await runTransaction(db, async (transaction) => {
        const newFaceRef = collection(db, 'adminFaces');
        await transaction.set(newFaceRef, {
          adminId: auth.currentUser.uid,
          faceURL: downloadURL,
          timestamp: new Date(),
        });
      });

      alert('Face data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert(`Failed to upload face data: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Admin Face Scan</h2>
      <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg shadow-lg" />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
          onClick={captureImage}
        >
          Capture Face
        </button>
        <button
          className={`bg-green-500 text-white px-4 py-2 rounded ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={uploadToFirebase}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Save Face'}
        </button>
      </div>

      {capturedImage && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Captured Face Preview</h3>
          <img src={capturedImage} alt="Captured" className="w-full rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default SecurityPanel;