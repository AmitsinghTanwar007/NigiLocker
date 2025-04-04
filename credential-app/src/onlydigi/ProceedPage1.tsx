import { useEffect, useState } from "react";
import './Nigi.css';
import credentialsData from "../cred_file.json";

interface ProceedPageProps {
  setPage1: (page: string) => void;
  selectedCred: string;
  setCredId: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

function ProceedPage1({ setPage1, selectedCred, setCredId, isOpen, onClose }: ProceedPageProps) {
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
    const addedCred = JSON.parse(localStorage.getItem("addedCred") || "[]");
    if (credentialsData?.verifiableCredential) {
      const filteredCredentials = credentialsData.verifiableCredential.filter(
        (cred) => addedCred.includes(cred.type[1])
      );
      setCredentials(filteredCredentials);
    }
  }, []);

  // Function to show popup with a message
  const displayPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleNavigate = () => {
    setCredId(selectedCred);
    setPage1("credential-page");
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
            const issuedBy = value.credentialSubject.issuedBy;
            // Create new credential with only age information
            const newCredential = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org"
              ],
              "type": ["VerifiableCredential", "AgeVerification"],
              "issuer": issuedBy,
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
            const issuedBy = value.credentialSubject.issuedBy;
            // Create new credential with only age information
            const newCredential = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org"
              ],
              "type": ["VerifiableCredential", "AgeVerification"],
              "issuer": issuedBy,
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
          } else {
            displayPopup("Age is 60 or younger");
          }
          
          console.log(value.credentialSubject.name);
          break;
      }
      case "place": {
        if (!value.credentialSubject.place) {
            displayPopup("The selected Credential does not contain required information");
            break;
          }
           const city= value.credentialSubject.place;
           const issuedBy = value.credentialSubject.issuedBy;
            // Create new credential with only age information
            const newCredential = {
              "@context": [
                "https://www.w3.org/2018/credentials/v1",
                "https://schema.org"
              ],
              "type": ["VerifiableCredential", "AgeVerification"],
              "issuer": issuedBy,
              "credentialSubject": {
                "place": city,
              },
              "issuanceDate": new Date().toISOString().split('T')[0]
            };
        
            // Store in localStorage
            localStorage.setItem("place", JSON.stringify(newCredential));
            localStorage.setItem("credId", "place");
            displayPopup("Credential created successfully");
            await delay(2000)
          
          console.log(value.credentialSubject.name);
          break;
      }
      
      default: {
        // For other credential types, just proceed
        setPage1("proceed-page");
        break;
      }
    }
  };

  // Custom Popup Component
  const Popup = () => {
    if (!showPopup) return null;
    
    return (
      <div className="absolute inset-0 flex items-center justify-center z-50">
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

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-2xl p-4 mx-2 my-4 shadow-xl z-10 transform transition-all animate-popup w-full max-h-[80%] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-indigo-700">Select source credential for derived credential</h1>
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Selected Credential Display */}
        {selectedCred && (
          <div className="bg-indigo-50 rounded-xl p-3 mb-4">
            <p className="text-indigo-700 font-medium text-sm">Selected verification: {selectedCred}</p>
          </div>
        )}

        {/* Credential Cards */}
        <div className="mb-4">
          {credentials.map((cred, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-md p-4 mb-3 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              onClick={() => handleCardClick(cred)}
            >
              <div className="flex items-start mb-2">
                <div className="h-8 w-8 mr-3 flex-shrink-0 flex items-center justify-center">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-800 font-bold">
                    {Array.isArray(cred.type) ? cred.type[1].charAt(0) : (typeof cred.type === 'string' ? cred.type.charAt(0) : "C")}
                  </div>
                </div>
                <div>
                  <h2 className="text-sm font-medium text-gray-700">
                    {Array.isArray(cred.type) ? cred.type[1] : (typeof cred.type === 'string' ? cred.type : "Credential")}
                  </h2>
                  <p className="text-gray-500 text-xs">{cred.credentialSubject.issuedBy}</p>
                </div>
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">{cred.credentialSubject.name}</h3>
              <p className="text-gray-500 text-xs">Created On</p>
              <p className="text-xs text-gray-800">{cred.issuanceDate}</p>
            </div>
          ))}
        </div>

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

export default ProceedPage1;