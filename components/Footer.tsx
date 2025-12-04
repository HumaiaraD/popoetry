import React from "react";

const Footer = () => {
  return (
    <footer className="pattern bg-black relative p-40 text-center ">
      <p className="text-2xl text-gray-500">
        &copy; {new Date().getFullYear()} PoPoetry. All rights reserved.
      </p>
      <p className="text-white text-2xl font-extrabold font-serif italic">A poem begins as a lump in the throat, a sense of wrong, a homesickness, a lovesickness.</p>
      <p className="text-white text-3xl font-bold">— Robert Frost</p>
      <br />
      <br />

      <p className="text-xl text-gray-500">Designed and developed with ❤️ by <strong>Humaiara Diea</strong></p>
      <p className="text-xl text-gray-500">Built with Next.js & Sanity, Shadcn UI, AuthJS Sentry and TailwindCSS.</p>
    </footer>
  );
};

export default Footer;