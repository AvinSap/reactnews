/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const authToken = JSON.parse(localStorage.getItem("auth"));
        console.log(authToken);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/auth/profile`,
          {
            headers: {
              Authorization: `Bearer ${authToken.token}`,
            },
          }
        );
        setUser(response.data.user);
        setFormData(response.data.user);
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch profile");
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = JSON.parse(localStorage.getItem("auth"));
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken.token}`,
          },
        }
      );
      setUser(response.data.user);
      setIsEditing(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError("")}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Profile Settings
          </h1>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {!isEditing ? (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Personal Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center">
                        <img
                          src="/images/avatar.png"
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover shadow-lg pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="border-b pb-4">
                          <label className="block text-sm font-medium text-gray-600">
                            Full Name
                          </label>
                          <div className="mt-1 text-gray-900">
                            {formData.name}
                          </div>
                        </div>

                        <div className="border-b pb-4">
                          <label className="block text-sm font-medium text-gray-600">
                            Email
                          </label>
                          <div className="mt-1 text-gray-900">
                            {formData.email}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600">
                            Member Since
                          </label>
                          <div className="mt-1 text-gray-900">
                            {formData.joinDate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="flex justify-between items-center mb-6 cursor-pointer">
                    <h2 className="text-xl font-bold text-gray-800 cursor-pointer">
                      Edit Profile
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                      <div className="flex flex-col items-center">
                        <img
                          src="/images/avatar.png"
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover shadow-lg pointer-events-none"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setFormData(user);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
