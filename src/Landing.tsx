import React from "react";
import { Link } from "react-router-dom";

const Landing: React.FC = React.memo(() => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-16 rounded-lg shadow-lg transform transition-transform hover:scale-105">
        <h1 className="text-6xl mb-10 text-center text-white font-bold">
          Landing Page
        </h1>
        <div className="flex justify-around">
          <Link
            to="/signup"
            className="px-10 py-5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Signup
          </Link>
          <Link
            to="/login"
            className="px-10 py-5 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
});

export default Landing;
