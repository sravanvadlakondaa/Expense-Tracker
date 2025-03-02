import React from 'react';

const Transaction = (props) => {
  const handleDeleteClick = () => {
    // Call the onDelete function passed from the Tracker component
    props.onDelete(props.id);
  };

  return (
    <li>
      <div>{props.name}</div>
      <div>
        {props.type === 'deposit' ? (
          <span className='deposit'>+₹{props.price}</span>
        ) : (
          <span className='expense'>-₹{props.price}</span>
        )}
      </div>
      <div>Date: {props.date}</div>
      <button onClick={handleDeleteClick} className='delete-button'>
        X
      </button>
    </li>
  );
};

export default Transaction;