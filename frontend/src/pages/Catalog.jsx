import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookCard from '../components/BookCard';

const Catalog = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/books');
                setBooks(res.data);
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
            <h1 className="page-title">Available Books</h1>
            
            {loading ? (
                <p>Loading our collection...</p>
            ) : books.length > 0 ? (
                <div className="book-grid">
                    {books.map(book => (
                        <BookCard key={`local-${book.id}`} book={book} />
                    ))}
                </div>
            ) : (
                <p>No books available.</p>
            )}
        </div>
    );
};

export default Catalog;
