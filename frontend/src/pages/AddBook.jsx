import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddBook = () => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        cover_url: '',
        book_url: ''
    });
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/books/add', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAlert({ type: 'success', message: 'Book added successfully!' });
            setFormData({ title: '', author: '', genre: '', description: '', cover_url: '', book_url: '' });
            setTimeout(() => setAlert(null), 3000);
        } catch (err) {
            setAlert({ type: 'error', message: err.response?.data?.error || 'Failed to add book' });
        }
    };

    return (
        <div className="page">
            <h1 className="page-title">Add a New Book</h1>
            
            <div className="form-card">
                {alert && (
                    <div className={`alert alert-${alert.type}`}>
                        {alert.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Title *</label>
                        <input type="text" name="title" required value={formData.title} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Author *</label>
                        <input type="text" name="author" required value={formData.author} onChange={handleChange} />
                    </div>
                    <div className="form-group" style={{ display: 'flex', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <label>Genre / Topic</label>
                            <input type="text" name="genre" value={formData.genre} onChange={handleChange} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Cover Image URL (optional)</label>
                            <input type="url" name="cover_url" placeholder="https://..." value={formData.cover_url} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Resource URL / PDF Link (optional)</label>
                        <input type="url" name="book_url" placeholder="Link to read or download" value={formData.book_url} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" rows="4" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ marginTop: '16px' }}>Add to Library</button>
                    <button type="button" className="btn-outline" style={{ marginLeft: '12px' }} onClick={() => navigate(-1)}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;
