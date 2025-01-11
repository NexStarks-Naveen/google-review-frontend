"use client";

import React, { useState } from "react";

type Review = {
  id: number;
  title: string;
  content: string;
  rating: number;
};

type User = {
  name: string;
  company: string;
  profilePic: string;
};

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");

  const reviews: Review[] = [
    { id: 1, title: "Amazing Service!", content: "Loved the service provided!", rating: 5 },
    { id: 2, title: "Great Product", content: "The product quality was top-notch.", rating: 4 },
    { id: 3, title: "Quick Delivery", content: "Fast and efficient delivery.", rating: 5 },
  ];

  const user: User = {
    name: "John Doe",
    company: "Tech Solutions Inc.",
    profilePic: "https://via.placeholder.com/150",
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="flex justify-center space-x-8 py-4 bg-white shadow-md">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`text-lg font-semibold ${
            activeTab === "dashboard" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("profile")}
          className={`text-lg font-semibold ${
            activeTab === "profile" ? "text-blue-500 border-b-2 border-blue-500" : "text-gray-600"
          }`}
        >
          Profile
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            {/* Modal */}
            <div className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">Total Reviews</h2>
              <span className="text-xl font-semibold text-blue-600">{reviews.length}</span>
            </div>

            {/* Reviews Table */}
            <h2 className="mt-8 text-2xl font-bold text-gray-800">Reviews</h2>
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Title</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Content</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr key={review.id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border-b text-black">{review.title}</td>
                      <td className="px-4 py-2 border-b text-black">{review.content}</td>
                      <td className="px-4 py-2 border-b text-black text-yellow-500">{review.rating} ⭐</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
            <img
              src={user.profilePic}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 mt-1">{user.company}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
