import React from 'react'
import Register from '../src/components/Register'
import './App.css'
import forest from './assets/forest.jpeg'


function App() {
  return (
   <main className ="App position-relative bg-white" style ={{height: "100vh", maxWidth: "100vw" }}>
    <img src={forest} className ="position-asbolute top-0" width="100%" height="50%" alt="header"></img>
    <div className ="d-flex justify-content-center align-items-center" style={{marginTop: "8%"}}>
  <Register/>
  </div>
   </main>
  );
}

export default App;
