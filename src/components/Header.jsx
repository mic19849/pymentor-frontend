import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-indigo-600 text-white p-4 shadow-md flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">PythonLearn</Link>
      <nav className="space-x-4">
        <Link to="/lessons">Lessons</Link>
        <Link to="/quiz">Quiz</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </header>
  );
};

export default Header;
