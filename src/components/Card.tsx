import React from 'react';

interface CardProps {
  title: string;
  value: number;
}

const Card: React.FC<CardProps> = ({ title, value }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-3xl font-semibold text-green-500">{value}</p>
    </div>
  );
};

export default Card;