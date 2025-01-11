"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type Company = {
  id: number;
  name: string;
  description: string;
  googleReviewUrl: string;
  contactNumber: string;
  address: string;
  imageUrl: string;
  email: string;
  password: string;
};

type Admin = {
  name: string;
  email: string;
  profilePic: string;
};



const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<string>("addCompany");
  const [newCompany, setNewCompany] = useState<Company>({
    id: 0,
    name: "",
    description: "",
    googleReviewUrl: "",
    contactNumber: "",
    address: "",
    imageUrl: "",
    email: "",
    password: "",
  });

  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: "Company 1", description: "Description 1", googleReviewUrl: "", contactNumber: "", address: "", imageUrl: "", email: "", password: "" },
    { id: 2, name: "Company 2", description: "Description 2", googleReviewUrl: "", contactNumber: "", address: "", imageUrl: "", email: "", password: "" },
    { id: 3, name: "Company 3", description: "Description 3", googleReviewUrl: "", contactNumber: "", address: "", imageUrl: "", email: "", password: "" },
    // More companies for testing pagination...
  ]);
  const [admin, setAdmin] = useState<Admin>({
    name: "John Doe",
    email: "johndoe@example.com",
    profilePic: "/profile.jpg",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const companiesPerPage = 5;

  const router = useRouter();
  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Redirect to the login page
    router.push("/login");
  };
  // Handle Add Company
  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = companies.length + 1;
    setCompanies([
      ...companies,
      {
        ...newCompany,
        id: newId,
      },
    ]);
    setNewCompany({
      id: 0,
      name: "",
      description: "",
      googleReviewUrl: "",
      contactNumber: "",
      address: "",
      imageUrl: "",
      email: "",
      password: "",
    });
  };

  // Handle Profile Edit
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    setAdmin({
      ...admin,
      [field]: e.target.value,
    });
  };

  // Pagination Logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white shadow-md rounded-r-2xl flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-semibold">Admin Panel</h1>
        </div>
        <nav className="space-y-4 flex-1">
          <button
            onClick={() => setActiveTab("addCompany")}
            className={`w-full text-left px-6 py-3 font-semibold ${
              activeTab === "addCompany" ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            Add Company
          </button>
          <button
            onClick={() => setActiveTab("listCompanies")}
            className={`w-full text-left px-6 py-3 font-semibold ${
              activeTab === "listCompanies" ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            List Companies
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full text-left px-6 py-3 font-semibold ${
              activeTab === "profile" ? "bg-blue-500 text-white" : "text-gray-400 hover:bg-gray-700"
            }`}
          >
            Profile
          </button>
        </nav>
        <div className="mt-auto p-6">
          <button className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-red-700 transition-colors"
            onClick={handleLogout}
            >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Add Company Tab */}
        {activeTab === "addCompany" && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Company</h2>
            <form
              onSubmit={handleAddCompany}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter company name"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Description</label>
                <textarea
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter company description"
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Google Review URL</label>
                <input
                  type="url"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter Google review URL"
                  value={newCompany.googleReviewUrl}
                  onChange={(e) => setNewCompany({ ...newCompany, googleReviewUrl: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
                <input
                  type="tel"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter contact number"
                  value={newCompany.contactNumber}
                  onChange={(e) => setNewCompany({ ...newCompany, contactNumber: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter company address"
                  value={newCompany.address}
                  onChange={(e) => setNewCompany({ ...newCompany, address: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter image URL"
                  value={newCompany.imageUrl}
                  onChange={(e) => setNewCompany({ ...newCompany, imageUrl: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email ID</label>
                <input
                  type="email"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter company email"
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter password"
                  value={newCompany.password}
                  onChange={(e) => setNewCompany({ ...newCompany, password: e.target.value })}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Company
              </button>
            </form>
          </div>
        )}

        {/* List Companies Tab */}
        {activeTab === "listCompanies" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">List of Companies</h2>
            {companies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Name</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Email</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-b text-black">{company.name}</td>
                        <td className="px-4 py-2 border-b text-black">{company.email}</td>
                        <td className="px-4 py-2 border-b text-black">{company.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * companiesPerPage >= companies.length}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No companies added yet.</p>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col space-y-4">
            <div className="flex items-center space-x-6">
              <img
                src={admin.profilePic}
                alt="Profile Picture"
                className="w-24 h-24 rounded-full border-2 border-blue-500"
              />
              <div>
                <h3 className="text-2xl font-semibold">{admin.name}</h3>
                <p className="text-gray-600">{admin.email}</p>
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Edit Profile</h4>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={admin.name}
                  onChange={(e) => handleProfileChange(e, "name")}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={admin.email}
                  onChange={(e) => handleProfileChange(e, "email")}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Profile Picture URL</label>
                <input
                  type="url"
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={admin.profilePic}
                  onChange={(e) => handleProfileChange(e, "profilePic")}
                />
              </div>
              <button
                type="button"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
