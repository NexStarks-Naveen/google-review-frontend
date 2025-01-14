"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { validateToken } from "@/lib/jwt";
import {getReviews, getCustomerData} from "@/lib/db/drizzle"

type Review = {
  review_id:string;
  name: string;
  review: string;
  rating: number;
};

type User = {
  email: string;
  userId: string;
  profilePic?: string;
  company?: string;
  address?: string;
};

const DashboardPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10); // Number of reviews per page
  const [reviews,setReviews]=useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const validateUser = async () => {
      try {
        const { valid, decoded } = await validateToken(token);
        if (!valid) {
          router.push("/login");
          return;
        }
        const data=await getReviews(decoded.userId);
        setReviews(data)
        const res= await getCustomerData({user_id:decoded.userId,email:decoded.email})
        const customerData=res[0]
        setUser({  email: customerData.email,
          userId: customerData.user_id,
          profilePic: customerData.img_url,
          company: customerData.company_name,
          address: customerData.address})
      } catch (error) {
        console.error("Token validation error:", error);
        router.push("/login");
      }
    };
    validateUser();
    setLoading(false); // Set loading to false once validation is successful
  }, [router]);

  // Prevent rendering the page while loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Redirect to the login page
    router.push("/login");
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
        <button className="text-lg font-semibold text-red-500"
            onClick={handleLogout}
            >
            Logout
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
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Name</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Review</th>
                    <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReviews.map((review) => (
                    <tr key={review.review_id} className={`hover:bg-gray-100 ${review.rating <= 2 ? "bg-red-50" : ""}`}>
                      <td className="px-4 py-2 border-b text-black">{review.name}</td>
                      <td className="px-4 py-2 border-b text-black">{review.review}</td>
                      <td className={`px-4 py-2 border-b text-black ${review.rating <= 2 ? "text-red-500" : "text-yellow-500"}`}>{review.rating} ⭐ </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handlePreviousPage}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center space-x-6">
            <img
              src={user?.profilePic}
              alt="Profile Picture"
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.company}</h2>
              <p className="text-gray-600 mt-1">{user?.address}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
