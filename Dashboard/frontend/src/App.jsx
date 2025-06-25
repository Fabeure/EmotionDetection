import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Sessions from './pages/sessions/Sessions';
import Navbar from './components/navbar/Navbar';


  const isLoggedIn = localStorage.getItem('token');
  console.log(isLoggedIn)
function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/sessions" 
              element={
                  <Sessions />
              } 
            />
            <Route 
              path="/" 
              element={
                isLoggedIn ? (
                  <Home />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
