import React from 'react'

const Footer = () => {
  return (
    <div>
      {/* Footer CTA Section */}
<div className="bg-black text-white py-20 text-center">
  {/* Heading */}
  <h1 className="text-3xl font-[kapler] font-bold mb-4">
    The Realm Awaits Your Mark
  </h1>

  {/* Paragraph */}
  <p className="text-gray-300 max-w-2xl mx-auto mb-10">
    Your story in <span className="text-[#f4c76b] font-semibold">SpellGrave</span> begins now.
    Will you test your skill in battle, support the creators forging this realm, or simply
    buy us a coffee to keep the fires burning?
  </p>

  {/* Buttons */}
  <div className="flex justify-center gap-4">
    <button className="px-6 py-3 font-bold text-white rounded-md border border-[#846a3e] bg-gradient-to-br from-[#1b0e2d] to-[#1f122f] hover:opacity-90 transition">
      Playtest the Game
    </button>
    <button className="px-6 py-3 font-bold text-white rounded-md border border-[#846a3e] bg-gradient-to-br from-[#33250a] to-[#5a3d10] hover:opacity-90 transition">
      Support the Developers
    </button>
  </div>
  <button className="px-6 mt-10 -ml-10 py-3 font-bold text-white rounded-md border border-[#846a3e] bg-gradient-to-br from-[#3b2a0e] to-[#70521b] hover:opacity-90 transition">
      Buy Us a Coffee
    </button>

  {/* Social Links */}
  <div className="flex justify-center gap-6 mt-12">
    <a href="#" className="hover:text-[#f4c76b] transition">
      <i className="fab fa-facebook-f"></i>
    </a>
    <a href="#" className="hover:text-[#f4c76b] transition">
      <i className="fab fa-instagram"></i>
    </a>
    <a href="#" className="hover:text-[#f4c76b] transition">
      <i className="fab fa-twitter"></i>
    </a>
  </div>

  {/* Footer text */}
  <p className="text-sm text-gray-400 mt-6">
    Made with <a href="#" className="text-[#f4c76b] hover:underline">author </a>
  </p>
</div>

    </div>
  )
}

export default Footer
