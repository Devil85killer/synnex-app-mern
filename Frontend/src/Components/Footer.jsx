import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-100 text-black p-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold">Synnex</h2>
          <p className="text-sm">Connecting alumni worldwide</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaFacebook className="text-xl" />import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-slate-100 text-black p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold">SYNNEX</h2>
          <p className="text-sm">Connecting alumni worldwide</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
            <FaFacebook className="text-xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
            <FaTwitter className="text-xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-pink-600 transition-colors">
            <FaInstagram className="text-xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-blue-700 transition-colors">
            <FaLinkedin className="text-xl" />
          </a>
        </div>
      </div>
      
      <hr className="my-4 border-gray-300" />
      
      {/* Team Members Section */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Developed by</h3>
        <div className="flex flex-wrap justify-center items-center gap-2 text-sm font-medium text-gray-600">
          <span>Jogesh</span>
          <span className="hidden sm:inline">•</span>
          <span>Karan</span>
          <span className="hidden sm:inline">•</span>
          <span>Rakesh</span>
          <span className="hidden sm:inline">•</span>
          <span>Sourav</span>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>&copy; 2026 SYNNEX. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaTwitter className="text-xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="text-xl" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer">
            <FaLinkedin className="text-xl" />
          </a>
        </div>
      </div>
      <hr className="my-4 border-gray-200" />
      <div className="text-center text-sm">
        <p>&copy; 2024 Synnex. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
