'use client';

import { useState } from 'react';

export default function AdminHeroPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file');
      return;
    }

    setMessage('Upload feature coming soon...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Hero Images Admin
        </h1>
        <p className="text-gray-400 mb-8">
          Simple upload panel - Testing
        </p>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Upload Form */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Upload Image</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer bg-white/5 border border-white/10 rounded-lg"
              />
            </div>

            {selectedFile && (
              <div className="text-gray-400 text-sm">
                Selected: {selectedFile.name}
              </div>
            )}

            <button
              onClick={handleUpload}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:scale-105 transition-all duration-300"
            >
              Upload
            </button>
          </div>
        </div>

        {/* Simple Info */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-2">Admin Panel Status</h3>
          <p className="text-gray-400">
            ✅ Page is loading correctly
            <br />
            ✅ Basic form is functional
            <br />
            ⏳ Upload functionality will be added next
          </p>
        </div>
      </div>
    </div>
  );
}
