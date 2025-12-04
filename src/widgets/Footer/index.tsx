import React from 'react';
import { FaMobileAlt, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="mx-8 mt-3 py-6 border-t border-gray-300">
      <div className="container mx-auto px-4 mb-2">
        <p className="text-center">
          <FaMobileAlt className="inline mr-1" />
          <a
            href="tel:+79057212749"
            className="text-black hover:underline"
          >
            8-905-721-27-49
          </a>
          <br />
          <FaEnvelope className="inline mr-1" />
          <a
            href="mailto:duczuyvu12@gmail.com"
            className="text-black hover:underline"
          >
            duczuyvu12@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;