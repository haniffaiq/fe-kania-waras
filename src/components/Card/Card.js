import React from 'react';

const Card = ({ title, content }) => {
  return (
    <div className="bg-grey shadow-md rounded-lg p-4 m-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2">{content}</p>
    </div>
  );
};

export default Card;
