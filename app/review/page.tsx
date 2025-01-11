"use client"; // Mark the file as a client-side component

import { useState } from "react";
import { FaStar } from "react-icons/fa"; // For star rating icons
import { useRouter } from "next/navigation"; // For redirecting
import { useForm } from "react-hook-form"; // Import react-hook-form

const ReviewPage = () => {
  const router = useRouter();
  const [profilePic, setProfilePic] = useState<string | null>("https://img.rolandberger.com/content_assets/content_images/captions/Roland_Berger-24_2195_Humanoid_robots-IT_image_caption_w768.jpg");
  const [rating, setRating] = useState(0);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    // Handle form submission
    console.log(data);

  };

  const handleStarClick = (star: number) => {
    if (star >= 4) {
        // Redirect if rating is 4 or higher
        router.push("https://www.w3schools.com");
      }
    setRating(star);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex justify-center items-center">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-6 relative">
        <h1 className="text-2xl font-bold text-center text-black mb-6">Submit Your Review</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Picture Upload */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500">
              <img
                src={profilePic ?? "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label className="block text-black font-semibold mb-2">Rating</label>
            <div className="flex space-x-2">
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
            <label className="block text-black font-semibold mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
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
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-black font-semibold mb-2">Contact Number</label>
            <input
              type="tel"
              placeholder="Enter your contact number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              {...register("contactNumber")}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg shadow-md hover:bg-blue-700 transition-colors mt-6"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
