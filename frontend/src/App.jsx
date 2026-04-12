import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AddBook from './pages/AddBook';
import Search from './pages/Search';
import BookDetails from './pages/BookDetails';

const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><AppLayout><Home /></AppLayout></ProtectedRoute>} />
        <Route path="/catalog" element={<ProtectedRoute><AppLayout><Catalog /></AppLayout></ProtectedRoute>} />
        <Route path="/add-book" element={<ProtectedRoute><AppLayout><AddBook /></AppLayout></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute><AppLayout><Search /></AppLayout></ProtectedRoute>} />
        <Route path="/book/:id" element={<ProtectedRoute><AppLayout><BookDetails /></AppLayout></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
