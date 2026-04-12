import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const [recentBooks, setRecentBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                // Just take top 4 for recent
                setRecentBooks(res.data.slice(0, 4));
            } catch (err) {
                console.error("Failed to fetch books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="page">
            <h1 className="page-title">Welcome to your Library</h1>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', marginTop: '32px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '400' }}>Recently Added</h2>
                <Link to="/catalog" style={{ color: 'var(--primary)', fontWeight: '500', fontSize: '14px' }}>View All</Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : recentBooks.length > 0 ? (
                <div className="book-grid">
                    {recentBooks.map(book => (
                        <BookCard key={`local-${book.id}`} book={book} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Your library is currently empty.</p>
                    <Link to="/add-book" className="btn-primary">Add your first book</Link>
                </div>
            )}
        </div>
    );
};

export default Home;
