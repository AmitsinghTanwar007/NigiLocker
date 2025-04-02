import { useEffect, useState } from "react";
import './Nigi.css';
import credentialsData from "./cred_file.json";

interface ProceedPageProps {
  setPage: (page: string) => void;
  selectedCred: string;
  setCredId: (id: string) => void;
}

function ProceedPage({ setPage, selectedCred, setCredId}: ProceedPageProps) {
    interface Credential {
        "@context": string | string[];
        type: string | string[];
        issuer: string;
        credentialSubject: {
          name?: string;
          identifier?: string;
          issuedBy?: string;
          [key: string]: any;
        };
        issuanceDate: string;
    }
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    if (credentialsData?.verifiableCredential) {
      setCredentials(credentialsData.verifiableCredential);
    }
  }, []);

  // Function to show popup with a message
  const displayPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleNavigate = () => {
        setCredId(selectedCred);
        setPage("bengaluru-zoo");
      };

  const handleCardClick = async (value: Credential) => {
    switch (selectedCred) {
      case "age less than 15": {
        if (!value.credentialSubject.dob) {
            displayPopup("The selected Credential does not contain required information");
            break;
          }
        
          // Parse the date of birth
          const dobDate = new Date(value.credentialSubject.dob);
          const today = new Date();
          
          // Calculate age
          let age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          
          // Adjust age if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
          }
        
          // Check if age is less than 15
          if (age < 15) {
            console.log("Age is less than 15");
            
            // Create new credential with only age information
            const newCredential = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org"
              ],
              "type": ["VerifiableCredential", "AgeVerification"],
              "issuer": "https://yourapplication.com",
              "credentialSubject": {
                "age": "less than 15"
              },
              "issuanceDate": new Date().toISOString().split('T')[0]
            };
        
            // Store in localStorage
            localStorage.setItem("age less than 15", JSON.stringify(newCredential));
            localStorage.setItem("credId", "age less than 15");
            displayPopup("Credential created successfully");
            await delay(2000)
            // Navigate
            handleNavigate();
          } else {
            displayPopup("Age is 15 or older");
          }
          
          console.log(value.credentialSubject.name);
          break;
      }

      case "age Greater than 60": {
        if (!value.credentialSubject.dob) {
            displayPopup("The selected Credential does not contain required information");
            break;
          }
        
          // Parse the date of birth
          const dobDate = new Date(value.credentialSubject.dob);
          const today = new Date();
          
          // Calculate age
          let age = today.getFullYear() - dobDate.getFullYear();
          const monthDiff = today.getMonth() - dobDate.getMonth();
          
          // Adjust age if birthday hasn't occurred yet this year
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
            age--;
          }
        
          // Check if age is greater than 60
          if (age > 60) {
            console.log("Age is greater than 60");
            
            // Create new credential with only age information
            const newCredential = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org"
              ],
              "type": ["VerifiableCredential", "AgeVerification"],
              "issuer": "https://yourapplication.com",
              "credentialSubject": {
                "age": "greater than 60"
              },
              "issuanceDate": new Date().toISOString().split('T')[0]
            };
        
            // Store in localStorage
            localStorage.setItem("age greater than 60", JSON.stringify(newCredential));
            localStorage.setItem("credId", "age greater than 60");
            displayPopup("Credential created successfully");
            // Navigate
            await delay(2000);
            handleNavigate();
          } else {
            displayPopup("Age is 60 or younger");
          }
          
          console.log(value.credentialSubject.name);
          break;
      }
      
      default: {
        // For other credential types, just proceed
        setPage("proceed-page");
        break;
      }
    }
  };

  // Custom Popup Component
  const Popup = () => {
    if (!showPopup) return null;
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setShowPopup(false)}></div>
        <div className="bg-white rounded-2xl p-5 m-4 shadow-lg z-10 transform transition-all animate-popup">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-center text-gray-800 mb-4">{popupMessage}</p>
            <button 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-purple-100 to-white overflow-y-auto relative min-h-screen">
      <div className="mx-auto max-w-full p-4 pb-24">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            className="text-gray-700"
            onClick={() => setPage("derived-cred")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <button className="text-gray-700 rounded-full h-8 w-8 flex items-center justify-center border border-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Verifiable Credential</h1>

        {/* Selected Credential Display */}
        {selectedCred && (
          <div className="bg-indigo-50 rounded-xl p-4 mb-6">
            <p className="text-indigo-700 font-medium">Selected verification: {selectedCred}</p>
          </div>
        )}

        {/* Credential Cards */}
        {credentials.map((cred, index) => (
          <div 
            key={index} 
            className="bg-white rounded-3xl shadow-md p-6 mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => handleCardClick(cred)}
          >
            <div className="flex items-start mb-5">
              <div className="h-12 w-12 mr-4 flex-shrink-0 flex items-center justify-center">
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-800 font-bold">
                  {Array.isArray(cred.type) ? cred.type[1] : (typeof cred.type === 'string' ? cred.type : "Credential")}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-medium text-gray-700">
                  {Array.isArray(cred.type) ? cred.type[1] : (typeof cred.type === 'string' ? cred.type : "Credential")}
                </h2>
                <p className="text-gray-500 text-sm">{cred.credentialSubject.issuedBy}</p>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">{cred.credentialSubject.name}</h3>
            <p className="text-gray-500 text-xs">Created On</p>
            <p className="text-lg text-gray-800">{cred.issuanceDate}</p>
          </div>
        ))}
      </div>

      {/* Custom Popup */}
      <Popup />
      
      {/* Add this to your CSS */}
      <style>{`
        @keyframes popup {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-popup {
          animation: popup 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ProceedPage;