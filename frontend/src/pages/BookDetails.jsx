import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ExternalLink, ArrowLeft } from 'lucide-react';

const BookDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const isGoogleBook = id.startsWith('google-') || location.state?.isGoogleBook;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                if (isGoogleBook) {
                    // Try to get from state first to save API call
                    if (location.state?.book) {
                        setBook(location.state.book);
                    } else {
                        // Fetch from API if refreshed
                        const googleId = id.replace('google-', '');
                        const res = await axios.get(`https://www.googleapis.com/books/v1/volumes/${googleId}`);
                        setBook(res.data);
                    }
                } else {
                    const res = await axios.get(`http://localhost:5000/api/books/${id}`);
                    setBook(res.data);
                }
            } catch (err) {
                setError("Failed to load book details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id, isGoogleBook, location.state]);

    if (loading) return <div className="page"><p>Loading...</p></div>;
    if (error || !book) return <div className="page"><p>{error || "Book not found"}</p></div>;

    // Normalize data
    const title = isGoogleBook ? book.volumeInfo?.title : book.title;
    const author = isGoogleBook ? book.volumeInfo?.authors?.join(', ') : book.author;
    const cover = isGoogleBook ? (book.volumeInfo?.imageLinks?.extraLarge || book.volumeInfo?.imageLinks?.thumbnail) : book.cover_url;
    const description = isGoogleBook ? book.volumeInfo?.description : book.description;
    const genre = isGoogleBook ? book.volumeInfo?.categories?.join(', ') : book.genre;
    const externalLink = isGoogleBook ? book.volumeInfo?.previewLink : book.book_url;
    
    // Using a simple regex to strip basic tag from google books descriptions
    const cleanDescription = isGoogleBook && description ? description.replace(/<[^>]+>/g, '') : description;

    return (
        <div className="page">
            <button className="btn-outline" onClick={() => navigate(-1)} style={{ marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <ArrowLeft size={16} /> Back
            </button>
            
            <div className="book-details-page">
                <div className="book-details-cover">
                    {cover ? (
                        <img src={cover} alt={title} />
                    ) : (
                        <div className="book-placeholder" style={{ height: '375px' }}>No Cover Available</div>
                    )}
                </div>
                
                <div className="book-details-info">
                    {isGoogleBook ? (
                        <span className="badge google">Google Books</span>
                    ) : (
                        <span className="badge local">Local Library</span>
                    )}
                    
                    <h1>{title}</h1>
                    <h2>by {author || 'Unknown Author'}</h2>
                    
                    {genre && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Genre:</strong> {genre}
                        </p>
                    )}
                    
                    {!isGoogleBook && book.added_by && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                            <strong>Added by:</strong> {book.added_by}
                        </p>
                    )}
                    
                    <div className="book-details-description">
                        {cleanDescription || "No description available for this book."}
                    </div>

                    <div className="book-actions">
                        {externalLink && (
                            <a href={externalLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                <ExternalLink size={18} /> Access / Read Book
                            </a>
                        )}
                        {!externalLink && (
                            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '16px' }}>No external link or resource provided.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;
