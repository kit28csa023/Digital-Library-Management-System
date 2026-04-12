import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    const [localResults, setLocalResults] = useState([]);
    const [googleResults, setGoogleResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) return;
            setLoading(true);
            
            try {
                // 1. Fetch Local
                const localRes = await axios.get(`http://localhost:5000/api/books/search?q=${encodeURIComponent(query)}`);
                setLocalResults(localRes.data);

                // 2. Fetch Google Books API
                const googleRes = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
                setGoogleResults(googleRes.data.items || []);
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    if (!query) {
        return <div className="page"><p>Please enter a search term.</p></div>;
    }

    return (
        <div className="page">
            <h1 className="page-title">Search Results for "{query}"</h1>
            
            {loading ? (
                <p>Searching...</p>
            ) : (
                <>
                    <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        From Local Library ({localResults.length})
                    </h2>
                    {localResults.length > 0 ? (
                        <div className="book-grid" style={{ marginBottom: '48px' }}>
                            {localResults.map(book => (
                                <BookCard key={`local-${book.id}`} book={book} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ marginBottom: '48px', color: 'var(--text-secondary)' }}>No local books found.</p>
                    )}

                    <h2 style={{ fontSize: '18px', fontWeight: '400', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                        From Google Books ({googleResults.length})
                    </h2>
                    {googleResults.length > 0 ? (
                        <div className="book-grid">
                            {googleResults.map(book => (
                                <BookCard key={`google-${book.id}`} book={book} isGoogleBook={true} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--text-secondary)' }}>No external books found.</p>
                    )}
                </>
            )}
        </div>
    );
};

export default Search;
