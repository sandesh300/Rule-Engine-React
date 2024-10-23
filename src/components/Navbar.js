import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold">Rule Engine</Link>
          <div className="flex space-x-4">
            <Link to="/create" className="hover:bg-blue-700 px-3 py-2 rounded">Create Rule</Link>
            <Link to="/combine" className="hover:bg-blue-700 px-3 py-2 rounded">Combine Rules</Link>
            <Link to="/evaluate" className="hover:bg-blue-700 px-3 py-2 rounded">Evaluate Rule</Link>
            <Link to="/modify" className="hover:bg-blue-700 px-3 py-2 rounded">Modify Rules</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;