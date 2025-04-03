import './App.css';
import BengaluruZooApp from './BengaluruZooApp';
import DerivedCredential from './DerivedCredential';
import NigiLocker from './NigiLocker';
import PresentablePage from './PresentablePage';
import { useState } from 'react';
import ProceedPage from './ProceedPage';
import HomePage from './HomePage';
import IntentFlow from './IntentFlow';
import CredentialPage from './CredentialPage';
import Redirecting from './Redirecting';
import CombineDerived from './CombineDeirved';

function App() {
  const [page, setPage] = useState("bengaluru-zoo");
  const [cred, setCred] = useState("Null");
  const [credId,setCredId] = useState("Null");
  const [selectedCred, setSelectedCred] = useState<string>('');//only for proceed and deirved page
  
  return (
    <div className="w-full flex justify-center items-center h-screen bg-gray-100 p-8">
      {/* Container for mobile devices */}
      <div className="flex flex-wrap justify-center gap-8">
        {/* First mobile device frame */}
        <div className="relative w-[480px] h-[980px] bg-black rounded-3xl shadow-xl overflow-hidden">
          {/* Phone bezel/frame */}
          <div className="absolute top-0 w-full h-6 bg-black z-10 flex justify-center">
            <div className="w-32 h-5 bg-black rounded-b-xl"></div>
          </div>
          {/* Phone screen */}
          <div className="w-full h-full pt-6 pb-4 px-2">
            <div className="w-full h-full rounded-2xl overflow-auto bg-white relative">
              {page === "verifiable-credential" ? (
                <NigiLocker setPage={setPage} setCred={setCred} />
              ) : page === "presentable-page" ? (
                <PresentablePage setPage={setPage} cred={cred} setCredId={setCredId}/>
              ) : page === "bengaluru-zoo" ? (
                <BengaluruZooApp  setPage={setPage} credId={credId}/>
              ) : page === "derived-cred" ? (
                <DerivedCredential  setPage={setPage} setSelectedCred={setSelectedCred} selectedCred={selectedCred} setCredId={setCredId} />
              ) : page === "proceed-page" ? (
                <ProceedPage  setPage={setPage} selectedCred={selectedCred} setCredId={setCredId} />
              ) : page === "home-page" ? (
                <HomePage  setPage={setPage}  />
              ) :page === "intent-flow" ? (
                <IntentFlow  setPage={setPage}  />
              ) :page === "credential-page" ? (
                <CredentialPage  setPage={setPage}  />
              ) :page === "redirect-page" ? (
                <Redirecting  setPage={setPage}  />
              ) :page === "combine-derived" ? (
                <CombineDerived setPage={setPage}  setCredId={setCredId} />
              ) :(
                <NigiLocker setPage={setPage} setCred={setCred} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;