// import React from 'react'
import { useState } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import DescriptionIcon from "@mui/icons-material/Description";

const Achievements = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    certificate: null,
  });

  const handleOnChange = (e) => {
    if (e.target.type === "file") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.files[0],
      });
    } else {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div>
      <div className="p-4">
        <div className="w-full md:w-lg bg-white rounded-lg shadow-md p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Achievements</h2>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus-border-blue-500"
                  placeholder="Achievement"
                  id="title"
                  value={formData.title}
                  onChange={handleOnChange}
                />
                <span className="absolute left-3 top-2 text-gray-400">
                  <EmojiEventsIcon />
                </span>
              </div>
              <div className="relative">
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus-border-blue-500"
                  placeholder="Description"
                  id="description"
                  value={formData.description}
                  onChange={handleOnChange}
                />
                <span className="absolute left-3 top-2 text-gray-400">
                  <DescriptionIcon />
                </span>
              </div>
              <div className="relative">
                <label className="bg-blue-500 text-white rounded-md p-2 px-4 cursor-pointer hover:bg-blue-600 focus:outline-none">
                  Upload Certificate
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    className="hidden"
                    id="certificate"
                    onChange={handleOnChange}
                  />
                </label>
              </div>
            </div>
            <div className="mt-6">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none">
                Save Achievement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
