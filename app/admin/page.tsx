"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {getCustomers,addCustomer} from "@/lib/db/drizzle"
import {generateQRCode} from "@/lib/helper"

type Company = {
  user_id:string
  company_name: string;
  google_review_url: string;
  address:string;
  description:string;
  img_url:string;
  phone_number:string;
  email:string;
  user_password:string;
  review_page_url:string;
};



const AdminPage = () => {
    const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("addCompany");
  const [newCompany, setNewCompany] = useState<Company>({
    user_id:"",
    company_name: "",
    description: "",
    google_review_url: "",
    phone_number: "",
    address: "",
    img_url: "",
    email: "",
    user_password: "",
    review_page_url:""
  });

  const [companies, setCompanies] = useState<Company[]>([]);

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
  const handleAddCompany = async(data: React.FormEvent) => {
    data.preventDefault();
    console.log(newCompany);
    setLoading(true)
    const {message,response}:any=await addCustomer(newCompany)
    alert(message)
    console.log("Testing res",response)
    setLoading(false)
  };

  const handleListCompany=async()=>{
    setLoading(true)
    setActiveTab("listCompanies")
    console.log("Testing list company")
    const data=await getCustomers()
    console.log(data)
    setCompanies(data)
    setLoading(false)
  }

  // Pagination Logic
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = companies.slice(indexOfFirstCompany, indexOfLastCompany);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handlerQR=async(url:string,name:string)=>{
    try {
      const qrCodeDataURL = await generateQRCode(url); 
  
      // Create a link element for download
      const link = document.createElement('a');
      link.href = qrCodeDataURL; 
      link.download = `${name}.png`; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
  
      console.log('QR code successfully generated and ready for download.');
    } catch (err) {
      console.error('Error generating QR Code:', err);
    }
  }

  const viewReviewPage=(url:string)=>{
    window.open(url, '_blank');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-gray-800 text-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold">Admin Panel</h1>
          <div className="flex flex-wrap space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveTab("addCompany")}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-lg ${
                activeTab === "addCompany" ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              Add Company
            </button>
            <button
              onClick={handleListCompany}
              className={`px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-lg ${
                activeTab === "listCompanies" ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              {loading==false?"List Companies":"Listing..."}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold bg-red-600 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
  
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add Company Tab */}
        {activeTab === "addCompany" && (
          <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 lg:p-10 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-6 text-center">
              Add Company
            </h2>
            <form
              onSubmit={handleAddCompany}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-black font-medium mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter company name"
                    value={newCompany.company_name}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, company_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Google Review URL
                  </label>
                  <input
                    type="url"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter Google review URL"
                    value={newCompany.google_review_url}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, google_review_url: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter contact number"
                    value={newCompany.phone_number}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, phone_number: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter company description"
                    value={newCompany.description}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, description: e.target.value })
                    }
                    required
                  ></textarea>
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter company address"
                    value={newCompany.address}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, address: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter image URL"
                    value={newCompany.img_url}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, img_url: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter company email"
                    value={newCompany.email}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-black font-medium mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
                    placeholder="Enter password"
                    value={newCompany.user_password}
                    onChange={(e) =>
                      setNewCompany({ ...newCompany, user_password: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mt-6"
              >
                {loading?"Submitting":"Add Company"}
              </button>
            </form>
          </div>
        )}


  
        {/* List Companies Tab */}
        {activeTab === "listCompanies" && (
          <div>
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-800 mb-4">List of Companies</h2>
            {companies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white rounded-lg">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Name</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Email</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Contact number</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">Page</th>
                      <th className="px-4 py-2 text-left text-gray-700 font-bold border-b">QR code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCompanies.map((company) => (
                      <tr key={company.user_id} className="hover:bg-gray-100">
                        <td className="px-4 py-2 border-b text-black">{company.company_name}</td>
                        <td className="px-4 py-2 border-b text-black">{company.email}</td>
                        <td className="px-4 py-2 border-b text-black">{company.phone_number}</td>
                        <td className="px-4 py-2 border-b text-black"><button   onClick={()=>viewReviewPage(company.review_page_url)}className="text-blue-500 border-b-2 border-blue-500">
                          View
                          </button></td>
                        <td className="px-4 py-2 border-b text-black"><button   onClick={async()=>handlerQR(company.review_page_url,company.company_name)}className="text-blue-500 border-b-2 border-blue-500">
                          Download
                          </button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-4 flex flex-wrap justify-center space-x-4">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage * companiesPerPage >= companies.length}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
      </main>
    </div>
  );
  
  
};

export default AdminPage;
