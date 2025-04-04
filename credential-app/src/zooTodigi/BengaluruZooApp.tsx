import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from "react-icons/fa"; // Import green tick icon
import { ImCross } from "react-icons/im";
interface BengaluruZooAppProps {
  setPage: (page: string) => void;
  verificationStatus?: boolean; // Add this prop to receive verification status from parent
  credId?: string; // Add this prop to pass credential ID
}

const BengaluruZooApp: React.FC<BengaluruZooAppProps> = ({ setPage, verificationStatus , credId}) => {
  // State variables
  const [currentPage, setCurrentPage] = useState<'start' | 'details' | 'confirmation'>('start');
  const [isBengaluruResident, setIsBengaluruResident] = useState<boolean>(false);
  const [age, setAge] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false);
  const [pendingVerification, setPendingVerification] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');

  // Calculate if user is eligible for discount
  const isDiscountEligible = () => {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && (ageNum < 15 || ageNum > 60);
  };

  // Get ticket price based on residency, age, and verification
  const getTicketPrice = () => {
    if (isBengaluruResident && isVerified) {
      return 150;
    }
    return 300;
  };

  // Handle payment process
  const handlePayment = () => {
    setPaymentComplete(true);
  };

  // Reset and go back to start
  const handleReset = () => {
    setCurrentPage('start');
    setIsBengaluruResident(false);
    setAge('');
    setIsVerified(false);
    setPaymentComplete(false);
    setPendingVerification(true);
    localStorage.removeItem('bengaluruZooState');
    localStorage.removeItem('credId');
  };
  
interface CredentialSubject {
    place: any;
    age: boolean;
    City: string;
    dob: string;
}

interface Credential {
    credentialSubject: CredentialSubject;
}

const checkverify = (cred: string): void => {   
    const credentialData = localStorage.getItem(cred);
    console.log("the cred data is", credentialData);
    if (credentialData) {
        try {
            // Parse the credential data
            const credential: Credential = JSON.parse(credentialData);
            // Ensure credentialSubject is an array
            const subjects = Array.isArray(credential.credentialSubject) ? credential.credentialSubject : [credential.credentialSubject];

            // Find age and city inside the array
            const ageObj = subjects.find(obj => 'age' in obj);
            const cityObj = subjects.find(obj => 'place' in obj);

            if (ageObj && cityObj) {
                setIsVerified(true);
                setPendingVerification(false);
                setIsBengaluruResident(true);
                setCurrentPage('details');    
                return;
            }
            
            // Extract relevant information
            const credentialSubject = credential.credentialSubject;

            let city = "Not Available";
            let dob = "Not Available";

            // Check if credentialSubject is an array
            if (Array.isArray(credentialSubject)) {
                const cityObj = credentialSubject.find(obj => 'place' in obj);
                if (cityObj) city = cityObj.place;

                const dobObj = credentialSubject.find(obj => 'dob' in obj);
                if (dobObj) dob = dobObj.dob;
            } else {
                // If credentialSubject is a single object
                if (credentialSubject.place) city = credentialSubject.place;
                if (credentialSubject.dob) dob = credentialSubject.dob;
            }

            // Now `city` and `dob` can be used anywhere in this scope
            console.log("City:", city);
            console.log("DOB:", dob);

            // Calculate age based on DOB
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            console.log("the city is ",city);
            // Check if the person is eligible for a discount
            // 1. Check if they're from Bengaluru (case insensitive comparison)
            const isBengaluruResident = city.toLowerCase() === "bengaluru" || city.toLowerCase() === "bangalore";
            
            // 2. Check if they're under 15 or over 60
            const isAgeEligible = age < 15 || age > 60;
            
            // If both conditions are met, set isVerified to true
            if (isBengaluruResident && isAgeEligible) {
                console.log("verified");
                setIsVerified(true);
                // No need to navigate away since we can verify directly

                setPendingVerification(false);
                setIsBengaluruResident(true);
                setCurrentPage('details');
                return;
            }
            else{
                console.log("not verified");
                setIsVerified(false);
                // No need to navigate away since we can verify directly

                setPendingVerification(false);
                setIsBengaluruResident(true);
                setCurrentPage('details');
                setAge('12');
            }
        } catch (error) {
            console.error("Error parsing credential data:", error);
            setIsVerified(false);
            setPendingVerification(false);
            setIsBengaluruResident(true);
            setCurrentPage('details');
            setAge('12');
        }
    }
    else{
            setIsVerified(false);
            setPendingVerification(false);
            setIsBengaluruResident(true);
            setCurrentPage('details');
            setAge('12');
    }
};
 
  const checkVerification = () => {
    saveStateToStorage();
    setPendingVerification(true);
    setPage("intent-flow");
  };

  // Save state to localStorage
  const saveStateToStorage = () => {
    const stateToSave = {
      currentPage,
      isBengaluruResident,
      age,
      isVerified,
      pendingVerification: true
    };
    localStorage.setItem('bengaluruZooState', JSON.stringify(stateToSave));
  };

//   // Handle verification status changes
//   useEffect(() => {
//     // Check if we're returning from verification page
//     if (pendingVerification && verificationStatus !== undefined) {
//       setIsVerified(verificationStatus);
//       setPendingVerification(false);
//       // Clear saved state as we've now restored it
//       localStorage.removeItem('bengaluruZooState');
//     }
//   }, [verificationStatus, pendingVerification]);

  // Load saved state on component mount
  useEffect(() => {
    // const savedState = localStorage.getItem('bengaluruZooState');
    const cred_id = localStorage.getItem('credId');
    console.log("the cred id is",cred_id);
    if (cred_id) {
        checkverify(cred_id);
    }
  }, []);

  // Render start page
  const renderStartPage = () => (
    <div className="bg-green-50 h-[940px] p-6 flex flex-col">
      
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Bannerghatta  Zoo</h1>
        <p className="text-green-600 text-lg">
          Discover the amazing wildlife and get your tickets online for a seamless experience.
        </p>
      </header>

      <div className="bg-white rounded-lg p-6 border-2 border-green-500 max-w-md mx-auto w-full shadow-md mt-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-500 rounded-full p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">Bannerghatta  Zoo</h2>
        <p className="text-center text-green-600 mb-4">Experience Wildlife Up Close</p>
        <hr className="border-dashed border-gray-300 my-4" />

        <div className="price-info text-center mb-4">
          <p><span className="font-bold">Adult:</span> ₹300 <span className="font-bold">Child/Senior:</span> ₹150</p>
          <p className="text-sm text-gray-500">*Discounts only for Bengaluru residents</p>
        </div>

        <button
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md font-medium hover:bg-green-600 transition"
          onClick={() => setCurrentPage('details')}
        >
          Buy Tickets
        </button>

        <hr className="border-dashed border-gray-300 my-4" />
        <div className="text-sm text-gray-500 flex justify-between">
          <p>Ticket ID: ZOO-23456</p>
          <p>Valid: All days 9:00 AM - 5:00 PM</p>
        </div>
      </div>

      <footer className="mt-auto text-center text-green-800 text-sm pt-8">
        <p>© 2025 Bannerghatta  Zoo. All rights reserved.</p>
        <p>Open daily from 9:00 AM to 5:00 PM</p>
      </footer>
    </div>
  );

  // Render details page
  const renderDetailsPage = () => (
    <div className="bg-green-50 h-[940px] p-6 flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <button 
          className="text-gray-700"
          onClick={() => setCurrentPage("start")}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      <header className="text-center mb-3">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Bannerghatta  Zoo</h1>
        <p className="text-green-600 text-lg">
          Discover the amazing wildlife and get your tickets online for a seamless experience.
        </p>
      </header>

      <div className="bg-white rounded-lg p-6 border-2 border-green-500 max-w-md mx-auto w-full shadow-md mt-5">
        <div className="flex justify-center mb-2">
          <div className="bg-green-500 rounded-full p-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-green-800 mb-2">Bannerghatta  Zoo</h2>
        <p className="text-center text-green-600 mb-4">Experience Wildlife Up Close</p>
        <hr className="border-dashed border-gray-300 my-4" />

        <div className="mb-4 bg-green-50 p-4 rounded-md">
          <div className="flex items-center mb-4">
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id="resident" 
              className="hidden" 
              checked={isBengaluruResident} 
              onChange={() => setIsBengaluruResident(!isBengaluruResident)} 
            />
          </div>

          <div
              className="mt-4 text-green-900 py-2 px-4 text-center rounded-md transition"
            >
            Discount is only for age below 15 or above 60 and must be resident of Bengaluru
            </div>

            {!isVerified && <button
              className="mt-2 bg-blue-500 ml-20 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition  shadow-sm shadow-black"
              onClick={() => checkVerification()}
            >
              Verify for Discount 
            </button>}

            {isBengaluruResident && isVerified && (
        <div className="mt-4 text-green-600 font-bold text-xl text-center flex flex-col items-center justify-center ">
            <FaCheckCircle className="mr-2 text-5xl" />
         Verification successful! You are eligible for a discount.
        </div>
      )}

            {isBengaluruResident  && !isVerified && !pendingVerification && (
                <div className="mt-4 text-red-600 font-bold text-xl flex justify-center items-center flex-col text-center">
                    <ImCross className="mr-2 text-5xl" />
                Verification not successful! You are not eligible for a discount.
                </div>
            )}
        </div>

        <button
          className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-600 transition shadow-sm shadow-black"
          onClick={() => setCurrentPage('confirmation')}
        >
          Pay ₹{getTicketPrice()}
        </button>

        <hr className="border-dashed border-gray-300 my-1" />
        <div className="text-sm text-gray-500 flex justify-between">
          <p>Ticket ID: ZOO-23456</p>
          <p>Valid: All days 9:00 AM - 5:00 PM</p>
        </div>
      </div>

      <footer className="mt-1 text-center text-green-800 text-sm pt-8">
        <p>© 2025 Bannerghatta  Zoo. All rights reserved.</p>
        <p>Open daily from 9:00 AM to 5:00 PM</p>
      </footer>
    </div>
  );

  // Render confirmation page
  const renderConfirmationPage = () => (
    <div className="bg-green-50 h-[940px] p-6 flex flex-col">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">Bannerghatta  Zoo</h1>
        <p className="text-green-600 text-lg">
          Discover the amazing wildlife and get your tickets online for a seamless experience.
        </p>
      </header>

      <div className="bg-white rounded-lg p-8 border-2 border-green-500 max-w-md mx-auto w-full shadow-md mt-8 text-center">
        {!paymentComplete ? (
          <>
            <h2 className="text-2xl font-bold text-green-800 mb-6">Confirm Payment</h2>
            <p className="mb-6">You are about to pay <span className="font-bold">₹{getTicketPrice()}</span> for your zoo ticket.</p>
            <div className="flex space-x-4">
              <button 
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-400 transition"
                onClick={() => setCurrentPage('details')}
              >
                Back
              </button>
              <button
                className="flex-1 bg-orange-500 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-600 transition"
                onClick={handlePayment}
              >
                Confirm Payment
              </button>
            </div>
          </>
        ) : (
          <div className="py-8">
            <div className="mx-auto bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mb-6">
              <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">Done!</h2>
            <p className="text-lg mb-8">Your payment of ₹{getTicketPrice()} has been processed successfully.</p>
            <button
              className="bg-green-500 text-white py-3 px-6 rounded-md font-medium hover:bg-green-600 transition"
              onClick={handleReset}
            >
              Book Another Ticket
            </button>
          </div>
        )}
      </div>

      <footer className="mt-auto text-center text-green-800 text-sm pt-8">
        <p>© 2025 Bannerghatta  Zoo. All rights reserved.</p>
        <p>Open daily from 9:00 AM to 5:00 PM</p>
      </footer>
    </div>
  );

  // Render the current page based on state
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'start':
        return renderStartPage();
      case 'details':
        return renderDetailsPage();
      case 'confirmation':
        return renderConfirmationPage();
      default:
        return renderStartPage();
    }
  };

  return (
    <div className="app-container">
      {renderCurrentPage()}
    </div>
  );
};

export default BengaluruZooApp;