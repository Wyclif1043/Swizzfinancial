

// // src/pages/Login.jsx
// import React from "react";
// import { FaGoogle, FaApple } from "react-icons/fa";

// export default function Login() {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Left Section */}
//       <div className="w-1/2 bg-indigo-600 text-white flex flex-col justify-center items-center p-10">
//         <div className="max-w-md">
//           {/* Logo */}
//           <div className="flex items-center mb-6">
//             <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
//               <span className="text-[#6B4EFF] font-bold text-lg">S</span>
//             </div>
//           </div>

//           {/* Headline */}
//           <h1 className="text-3xl font-bold leading-snug mb-4">
//             Start closing more deals <br /> with Swift Financial
//           </h1>
//           <p className="text-gray-200 mb-6">
//             Create a free account and get full access to all features for 30-days. 
//             No credit card needed.
//           </p>

//           {/* Web App Skeleton */}
//           <div className="rounded-lg overflow-hidden shadow-2xl border border-white/20 bg-white/90">
//             <div className="flex">
//               {/* Sidebar */}
//               <div className="w-16 bg-gray-100 p-2 flex flex-col space-y-3">
//                 <div className="w-8 h-8 rounded-full bg-gray-300"></div>
//                 <div className="w-8 h-8 rounded-full bg-gray-200"></div>
//                 <div className="w-8 h-8 rounded-full bg-gray-200"></div>
//                 <div className="w-8 h-8 rounded-full bg-gray-200"></div>
//                 <div className="w-8 h-8 rounded-full bg-gray-200"></div>
//                 <div className="w-8 h-8 rounded-full bg-gray-200"></div>
//               </div>

//               {/* Main Content */}
//               <div className="flex-1 p-4">
//                 {/* Top Bar */}
//                 <div className="flex space-x-4 mb-4">
//                   <div className="w-32 h-6 bg-gray-300 rounded"></div>
//                   <div className="w-20 h-6 bg-gray-200 rounded"></div>
//                 </div>

//                 {/* List skeleton */}
//                 <div className="space-y-3">
//                   <div className="w-full h-10 bg-gray-200 rounded"></div>
//                   <div className="w-full h-10 bg-gray-100 rounded"></div>
//                   <div className="w-full h-10 bg-gray-200 rounded"></div>
//                   <div className="w-full h-10 bg-gray-100 rounded"></div>
//                   <div className="w-full h-10 bg-gray-200 rounded"></div>
//                   <div className="w-full h-10 bg-gray-100 rounded"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Right Section */}
//       <div className="w-1/2 bg-white flex justify-center items-center">
//         <div className="w-full max-w-md px-10">
//           <h2 className="text-2xl font-semibold text-gray-900 mb-8">
//             Create your account
//           </h2>

//           <form className="space-y-5">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Name
//               </label>
//               <input
//                 type="text"
//                 placeholder="Enter your name"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 placeholder="Create password"
//                 className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Must be at least 8 characters.
//               </p>
//             </div>

//             {/* Sign Up Button */}
//             <button
//               type="submit"
//               className="w-full bg-[#6B4EFF] hover:bg-[#5b3cd8] text-white py-2 rounded-md font-medium"
//             >
//               Sign Up
//             </button>
//           </form>

//           {/* Or continue with */}
//           <div className="my-6 flex items-center justify-center">
//             <div className="border-t w-full"></div>
//             <span className="px-2 text-gray-500 text-sm">or continue with</span>
//             <div className="border-t w-full"></div>
//           </div>

//           {/* Social Buttons */}
//           <div className="flex space-x-4">
//             <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
//               <FaGoogle className="mr-2 text-red-500" />
//               Google
//             </button>
//             <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
//               <FaApple className="mr-2 text-black" />
//               Apple
//             </button>
//           </div>

//           {/* Sign In Link */}
//           <p className="text-center text-gray-600 mt-6 text-sm">
//             Already have an account?{" "}
//             <a href="#" className="text-[#6B4EFF] font-medium hover:underline">
//               Sign in
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }




// src/pages/Login.jsx
import React from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Section */}
      <div className="w-1/2 bg-[#3E1FB6] text-white flex flex-col justify-center items-end relative overflow-hidden">
        {/* Shimmer background animation */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-[#3E1FB6] via-[#5A3FE3] to-[#3E1FB6] animate-pulse opacity-40"></div> */}

        <div className="relative z-10 w-full">
          {/* Logo */}
          <div className="flex items-center mb-6 ml-50">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
              <span className="text-[#3E1FB6] font-bold text-lg">S</span>
            </div>
            <h2 className="ml-3 font-semibold text-xl">Swift Financial</h2>
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-bold leading-snug mb-4 ml-50">
            Simplify your finance <br /> with Swift Financial
          </h1>
          <p className="text-gray-200 mb-6 ml-50">
            Manage accounts, journals, and payments — all in one place.
          </p>

          {/* Web App Skeleton */}
          <div className="rounded-l-xl overflow-hidden shadow-2xl border border-white bg-[#2B1B8C] backdrop-blur-sm max-[300px] ml-40">
            <div className="flex">
              {/* Sidebar */}
              <div className="w-14 bg-[#2B1B8C] p-3 flex flex-col space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-md ${i === 1
                      ? "bg-[#6B4EFF] animate-pulse"
                      : "bg-[#4B38C3] animate-pulse"
                      }`}
                  ></div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex flex-col w-full">

                <div className=" flex-1 bg-[#2B1B8C] shimmer justify-items-end">
                  <div className="bg-gray-200 rounded-md h-5 w-1/2 m-3 shimmer"></div>
                </div>

                <div className="flex rounded-tl-2xl bg-white/95">

                  <div className="flex-1 bg-indigo-800 rounded-tl-2xl h-full w-1/3 p-4">
                    <div className=" flex flex-col space-y-3">
                      {[...Array(10)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-full h-6 rounded-md ${i === 1
                            ? "bg-[#6B4EFF] animate-pulse"
                            : "bg-[#4B38C3] animate-pulse"
                            }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 w-2/3">
                    {/* Header Bar */}
                    <div className="bg-indigo-800 rounded-md h-8 w-full mb-4 shimmer flex justify-end items-center">
                      <div className="h-5 w-1/3 bg-gray-300 rounded-md shimmer mr-3"></div>
                    </div>



                    {/* Form Section */}
                    <div className="space-y-3 mb-3">
                      <div className="space-x-2 flex">
                        <div className="h-5 w-1/4 bg-gray-300 rounded shimmer"></div>
                        <div className="h-5 w-1/4 bg-gray-300 rounded shimmer"></div>
                        <div className="h-5 w-1/4 bg-gray-300 rounded shimmer"></div>
                        <div className="h-5 w-1/4 bg-gray-300 rounded shimmer"></div>
                      </div>
                      <div className="h-8 w-full bg-gray-300 rounded shimmer"></div>
                      <div className="h-5 w-1/2 bg-[#6B4EFF] rounded shimmer"></div>
                      <div className="h-8 w-full bg-gray-200 rounded shimmer"></div>
                    </div>

                    {/* Table-like Rows */}
                    <div className="space-y-2 animate-pulse bg-gray-200 p-2 rounded-md">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded"
                        >
                          {Array.from({ length: 3 }).map((_, j) => (
                            <div key={j} className="h-4 bg-gray-300 rounded"></div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Bottom Buttons */}
                    <div className="flex justify-end mt-5 space-x-2">
                      <div className="h-6 w-20 bg-gray-300 rounded shimmer"></div>
                      <div className="h-6 w-20 bg-[#6B4EFF] rounded shimmer"></div>
                    </div>
                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section (Sign up form) */}
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div className="w-full max-w-md px-3">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">
            Create your account
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create password"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#6B4EFF]"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-[#6B4EFF] hover:bg-[#5b3cd8] text-white py-2 rounded-md font-medium"
            //onClick={() => navigate("/")}
            >
              Login
            </button>


          </form>

          <div className="my-6 flex items-center justify-center">
            <div className="border-t w-full"></div>
            <span className="px-2 text-gray-500 text-sm">or continue with</span>
            <div className="border-t w-full"></div>
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <FaGoogle className="mr-2 text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center w-1/2 border rounded-md py-2 hover:bg-gray-50">
              <FaApple className="mr-2 text-black" /> Apple
            </button>
          </div>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <a href="#" className="text-[#6B4EFF] font-medium hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Add this shimmer animation to your global CSS (e.g. index.css or tailwind.css):
------------------------------------------------------ */
