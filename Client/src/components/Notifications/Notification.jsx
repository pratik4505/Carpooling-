// Notification.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './notification.scss';

export default function Notification(props) {
  // Format date without using external packages
  const formattedDate = new Date(props.data.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="notification-container">
      {props.data.type === 'endorsement' ? (
        <Link to={`/Profile/${props.data.userId}`} className="notification-link">
          <h3>{props.data.title}</h3>
          <p>{props.data.description}</p>
          <p>{formattedDate}</p>
        </Link>
      ) : props.data.type === 'newRequest' ? (
        <Link to="/Requests" className="notification-link">
          <h3>{props.data.title}</h3>
          <p>{props.data.description}</p>
          <p>{formattedDate}</p>
        </Link>
      ) : props.data.type === 'acceptRequest' ? (
        <Link to={`/Profile/${props.data.byId}`} className="notification-link">
          <h3>{props.data.title}</h3>
          <p>{props.data.description}</p>
          <p>{formattedDate}</p>
        </Link>
      ) : (
        <div>
          <h3>{props.data.title}</h3>
          <p>{props.data.description}</p>
          <p>{formattedDate}</p>
        </div>
      )}
    </div>
  );
}
