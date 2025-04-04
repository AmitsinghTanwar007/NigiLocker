import './App.css';
import BengaluruZooApp from './zooTodigi/BengaluruZooApp';
import DerivedCredential from './zooTodigi/DerivedCredential';
import NigiLocker from './zooTodigi/NigiLocker';
import PresentablePage from './zooTodigi/PresentablePage';
import { useState } from 'react';
import ProceedPage from './zooTodigi/ProceedPage';
import HomePage from './zooTodigi/HomePage';
import IntentFlow from './zooTodigi/IntentFlow';
import CredentialPage from './zooTodigi/CredentialPage';
import Redirecting from './zooTodigi/Redirecting';
import CombineDerived from './zooTodigi/CombineDeirved';
import NigiLocker1 from './onlydigi/NigiLocker1';
import PresentablePage1 from './onlydigi/PresentablePage1';
import DerivedCredential1 from './onlydigi/DerivedCredential1';
import ProceedPage1 from './onlydigi/ProceedPage1';
import HomePage1 from './onlydigi/HomePage1';
import CredentialPage1 from './onlydigi/CredentialPage1';
import CombineDerived1 from './onlydigi/CombineDeirved1';

function App() {
  const [page, setPage] = useState("bengaluru-zoo");
  const [cred, setCred] = useState("Null");
  const [page1, setPage1] = useState("verifiable-credential");
  const [credId,setCredId] = useState("Null");
  const [selectedCred, setSelectedCred] = useState<string>('');//only for proceed and deirved page
  
  return (
    <div className="w-full flex justify-center items-center h-screen bg-gray-100 p-8">
      {/* Container for mobile devices */}
      <div className="flex flex-wrap justify-center gap-40">
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
                <NigiLocker setPage={setPage} setSelectedCred={setSelectedCred} setCred={setCred} setCredId={setCredId} />
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
                <CombineDerived setPage={setPage}  setCredId={setCredId}  />
              ) :(
                <NigiLocker setPage={setPage} setSelectedCred={setSelectedCred} setCred={setCred} setCredId={setCredId}/>
              )}
            </div>
          </div>
        </div>

        <div className="relative w-[480px] h-[980px] bg-black rounded-3xl shadow-xl overflow-hidden">
          {/* Phone bezel/frame */}
          <div className="absolute top-0 w-full h-6 bg-black z-10 flex justify-center">
            <div className="w-32 h-5 bg-black rounded-b-xl"></div>
          </div>
          {/* Phone screen */}
          <div className="w-full h-full pt-6 pb-4 px-2">
            <div className="w-full h-full rounded-2xl overflow-auto bg-white relative">
              {page1 === "verifiable-credential" ? (
                <NigiLocker1 setPage1={setPage1} setCred={setCred} setSelectedCred={setSelectedCred} setCredId={setCredId} />
              ) : page1 === "presentable-page" ? (
                <PresentablePage1 setPage1={setPage1} cred={cred} setCredId={setCredId}/>
              ) : page1 === "derived-cred" ? (
                <DerivedCredential1  setPage1={setPage1} setSelectedCred={setSelectedCred} selectedCred={selectedCred} setCredId={setCredId} />
              ) : page1 === "proceed-page" ? (
                <ProceedPage1  setPage1={setPage1} selectedCred={selectedCred} setCredId={setCredId} isOpen={false} onClose={function (): void {
                        throw new Error('Function not implemented.');
                      } } />
              ) : page1 === "home-page1" ? (
                <HomePage1  setPage1={setPage1}  />
              ) :page1 === "credential-page" ? (
                <CredentialPage1  setPage1={setPage1}  />
              ) :page1 === "combine-derived" ? (
                <CombineDerived1 setPage1={setPage1}  setCredId={setCredId} />
              ) :(
                <NigiLocker1 setPage1={setPage1} setCred={setCred} setSelectedCred={setSelectedCred} setCredId={function (credId: string): void {
                                throw new Error('Function not implemented.');
                              } } />
              )}
            </div>
          </div>
        </div>
      </div>
      <button className='relative bg-blue-500 text-white rounded-xl px-2 py-3 -right-[100px] shadow-md hover:shadow-black border-black cursor-pointer hover:shadow-lg transition-shadow duration-200 ' onClick={()=>{
        localStorage.clear()
        window.location.reload();
      }}>
        refresh the page
      </button>
    </div>
  );
}

export default App;