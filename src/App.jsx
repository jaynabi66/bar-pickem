import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css'
import Home, { HomePage } from './pages/Home/Home';
import Login, { LoginPage } from './pages/Login/Login';
import Results, { ResultsPage } from './pages/Results/Results';
import Scan, { ScanPage } from './pages/Scan/Scan';
import SignUp, { SignUpPage } from './pages/SignUp/SignUp';

function App() {
  return (
    <Router>
      <div className='route'>
        <Routes>
          <Route path={HomePage} element={<Home />}/>
          <Route path={LoginPage} element={<Login />}/>
          <Route path={SignUpPage} element={<SignUp />}/>
          <Route path={ScanPage} element={<Scan />}/>
          <Route path={ResultsPage} element={<Results />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
