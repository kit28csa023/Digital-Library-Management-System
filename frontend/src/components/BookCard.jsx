import React from 'react';
import { useNavigate } from 'react-router-dom';

const BookCard = ({ book, isGoogleBook = false }) => {
    const navigate = useNavigate();

    // Normalizing data from DB vs Google Books API
    const title = isGoogleBook ? book.volumeInfo?.title : book.title;
    const author = isGoogleBook ? book.volumeInfo?.authors?.join(', ') : book.author;
    const cover = isGoogleBook ? book.volumeInfo?.imageLinks?.thumbnail : book.cover_url;
    const description = isGoogleBook ? book.volumeInfo?.description : book.description;

    const handleClick = () => {
        if (isGoogleBook) {
            // Encode the entire object state or pass ID 
            navigate(`/book/google-${book.id}`, { state: { book, isGoogleBook: true } });
        } else {
            navigate(`/book/${book.id}`);
        }
    };

    return (
        <div className="book-card" onClick={handleClick}>
            {cover ? (
                <img src={cover} alt={title} className="book-cover" />
            ) : (
                <div className="book-placeholder">No Cover</div>
            )}
            
            <div className="book-info">
                {isGoogleBook ? (
                    <span className="badge google">Google Books</span>
                ) : (
                    <span className="badge local">Local Library</span>
                )}
                <h3>{title || 'Unknown Title'}</h3>
                <p>{author || 'Unknown Author'}</p>
            </div>
        </div>
    );
};

export default BookCard;
