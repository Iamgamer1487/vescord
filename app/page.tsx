'use client'
import Image from "next/image";


export default function Home() {


  return (
    <div className="flex justify-center  min-h-screen bg-gray-100">
      <div className="space-x-4">
        <a
          href="/api/auth/login"
          className="px-8 py-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
        >
          Login
        </a>

      </div>
    </div>
  );
}
