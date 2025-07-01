import React from 'react';
import { Link } from 'react-router-dom';

const LessonCard = ({ lesson }) => (
  <Link to={`/lessons/${lesson.id}`} className="bg-white shadow-md p-4 rounded-xl hover:shadow-xl transition-all">
    <h3 className="text-lg font-semibold">{lesson.title}</h3>
    <p className="text-gray-600">{lesson.description}</p>
  </Link>
);

export default LessonCard;
