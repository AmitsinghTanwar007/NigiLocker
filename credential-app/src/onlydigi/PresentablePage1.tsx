import React, { useState } from 'react';
import credentialsData from "../cred_file.json";

interface PresentablePageProps {
  setPage1: (page: string) => void;
  cred: string;
  setCredId: (id: string) => void;
}

function PresentablePage1({ setPage1, cred,setCredId }: PresentablePageProps) {
  const handleBackClick = () => {
    setPage1("verifiable-credential");
  };

  const selectedCredential = credentialsData.verifiableCredential.find(
    (credItem) => credItem.type[1] === cred
  );

  if (!selectedCredential) {
    return (
      <div className="bg-gradient-to-b from-blue-100 to-white overflow-y-auto relative">
        <div className="mx-auto max-w-full p-4 pb-24">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">No Credential Found</h1>
        </div>
      </div>
    );
  }

  const [selectedFields, setSelectedFields] = useState<Record<string, boolean>>(
    Object.keys(selectedCredential.credentialSubject).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleField = (key: string): void => {
    setSelectedFields((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCredential = {
    ...selectedCredential,
    credentialSubject: Object.keys(selectedCredential.credentialSubject)
      .filter((key) => selectedFields[key])
      .reduce((acc: Record<string, any>, key) => {
        acc[key] = selectedCredential.credentialSubject[key as keyof typeof selectedCredential.credentialSubject];
        return acc;
      }, {} as Record<string, any>),
  };

  const handlePresentCredential = () => {
    const uniqueId = `cred-${Date.now()}`;
    localStorage.setItem(uniqueId, JSON.stringify(filteredCredential));
    localStorage.setItem("credId", uniqueId);
    setCredId(uniqueId);
    console.log(uniqueId);
    setPage1("credential-page");
    // const queryParams = new URLSearchParams(filteredCredential.credentialSubject).toString();
    // window.location.href = `https://same-dqlpvohc2ei-latest.netlify.app/?${queryParams}`;
  };

  return (
    <div className="bg-gradient-to-b from-blue-100 to-white overflow-y-auto relative">
      <div className="mx-auto max-w-full p-4 pb-24">
        <div className="flex justify-between items-center mb-8">
          <button className="text-gray-700" onClick={handleBackClick}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
        </div>

        <h1 className="text-3xl font-bold text-blue-700 mb-6">Presentable Credentials</h1>

        <div className="bg-white rounded-3xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{selectedCredential.credentialSubject.name}</h3>
          <p className="text-gray-500 text-xs">Created On</p>
          <p className="text-lg text-gray-800">{selectedCredential.issuanceDate}</p>
          <div className="mt-4">
            {Object.keys(selectedCredential.credentialSubject).map((key) => (
              key !== "name" && key !== "issuedBy" && (
                <div key={key} className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedFields[key]}
                    onChange={() => toggleField(key)}
                    className="mr-2"
                  />
                  <div>
                    <p className="text-gray-500 text-xs capitalize">{key}:</p>
                    {key in selectedCredential.credentialSubject && (
                      <p className="text-lg text-gray-800">{selectedCredential.credentialSubject[key as keyof typeof selectedCredential.credentialSubject]}</p>
                    )}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center px-4">
        <button
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-6 rounded-full w-full max-w-xs text-lg font-medium"
          onClick={handlePresentCredential}
        >
          Present Credential
        </button>
      </div>
    </div>
  );
}

export default PresentablePage1;