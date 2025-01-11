"use client"; // Mark the file as a client-side component

import { useState, useEffect, use } from "react";
import { FaStar } from "react-icons/fa"; // For star rating icons
import { useRouter, useParams } from "next/navigation"; // For redirecting
import { useForm } from "react-hook-form"; // Import react-hook-form
import {getCustomerForReview,insertReview} from "@/lib/db/drizzle"

const ReviewPage = () => {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewUrl,setReviewUrl]=useState("/")
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const params=useParams()
  useEffect(() => {
    const validateUser=async()=>{
      try{
      const userId=params.userId
      const response=await getCustomerForReview(userId)
      const customerData=response[0]
      setReviewUrl(customerData.google_review_url)
    }
    catch(error){
      console.log(error)
    }
  }

    validateUser()
  }, []);

  const onSubmit = async (data: any) => {
    // Handle form submission
  try{
    setLoading(true);
    const response=await insertReview({name:data.name,review:data.description,rating:rating,user_id:params.userId,phone_number:data.contactNumber})
    alert(`Thanks, ${data.name}! Your review means a lot to us.`)
    window.location.reload();
  }
  catch(error){
    console.log(error)
    router.push(`/review/${params.userId}`)
  }

  };

  const handleStarClick = (star: number) => {
    if (star >= 4) {
        // Redirect if rating is 4 or higher
        router.push(reviewUrl);
      }
    setRating(star);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex justify-center items-center">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 relative">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Submit Your Review</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Star Rating */}
          <div>
            <label className="block text-black font-semibold mb-2">Rating</label>
            <div className="flex space-x-2 justify-center items-center">
              {[...Array(5)].map((_, index) => (
                <FaStar
                  key={index}
                  className={`cursor-pointer text-2xl ${
                    index < rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(index + 1)}
                />
              ))}
            </div>
            {errors.rating && <span className="text-red-500 text-sm">Rating is required</span>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-black font-semibold mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {typeof errors.name.message === "string" ? errors.name.message : "An error occurred"}
              </p>
            )}
          </div>

          {/* Review Description */}
          <div>
            <label className="block text-black font-semibold mb-2">Description</label>
            <textarea
              placeholder="Write your review here"
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {typeof errors.description.message === "string" ? errors.description.message : "An error occurred"}
              </p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-black font-semibold mb-2">Contact Number</label>
            <input
                type="tel"
                placeholder="Enter your Indian contact number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter a valid Indian contact number"
                  }
                })}
              />
              {errors.contactNumber && (
                <p className="text-red-500 text-sm mt-1">
                  {typeof errors.contactNumber.message=="string"?errors.contactNumber.message : "An error occurred"}
                </p>
              )}

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors mt-6"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;

