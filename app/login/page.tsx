"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {getAdmins} from "@/lib/db/drizzle"
import {generateToken} from "@/lib/jwt"
import 'dotenv/config';
export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = async (data: any) => {
    setLoading(true);
    // Mocking an API call
    const response=await getAdmins({email:data.email,password:data.password})
    if(response.length==0){
      alert("Invalid Credentials")
      setLoading(false);
      return;
    }
    const userData=response[0]
    const token=await generateToken({email:userData.email,userId:userData.user_id})
    localStorage.setItem("token",token)
    if(userData.is_admin){
      setTimeout(() => {
        setLoading(false);
        router.push("/admin"); // Navigate to dashboard
      }, 2000);
    }
    else{
      setTimeout(() => {
        setLoading(false);
        router.push("/dashboard"); // Navigate to dashboard
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login to Meta Virtual Tour Dashboard
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
              className={`mt-1 w-full px-4 py-2 border text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {typeof errors.email.message === "string" ? errors.email.message : "An error occurred"}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password", { required: "Password is required" })}
              className={`mt-1 w-full px-4 py-2 border text-black ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {typeof errors.password.message === "string" ? errors.password.message : "An error occurred"}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 text-white bg-blue-600 rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
        {/* Footer */}
        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account? contact{" "}
          <a href="mailto:admin@gmail.com" className="text-blue-500 hover:underline">
            Admin
          </a>
        </p>
      </div>
    </div>
  );
}
