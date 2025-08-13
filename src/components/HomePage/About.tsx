import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <div className="bg-black ">
      <Navbar />
      {/* main about us  */}
      <div className=" w-full h-screen mt-20 flex flex-col items-center justify-center py-24 px-8">
        <p className="text-sm font-[cinzel] text-[#f4c76b] tracking-[0.3em] uppercase mb-6">
          ABOUT SPELLGRAVE
        </p>

        <h1 className="text-6xl font-[kapler] font-bold mb-8 text-center">
          About <span className="text-[#f4c76b]">SpellGrave</span>
        </h1>

        <div className="h-[2px] w-60 bg-gradient-to-r from-transparent via-[#f4c76b] to-transparent mb-12"></div>

        <div className="max-w-4xl mx-auto text-center font-[kapler]">
          <p className="text-lg leading-relaxed text-gray-300 mb-8 font-light">
            <span className="text-[#f4c76b] font-[Cinzel] text-4xl font-bold">
              S
            </span>
            pellGrave is a{' '}
            <strong className="font-bold">
              dark fantasy trading card game
            </strong>{' '}
            where every battle tells a story and every card has a soul.
          </p>

          <p className="text-lg leading-relaxed text-gray-300 mb-8 font-light">
            Built by <strong className="font-bold">Twin Sigil Studios</strong>,
            it blends strategic deckbuilding with living card histories —
            tracking every fight, victory, and defeat your cards endure.
          </p>

          <p className="text-lg leading-relaxed text-gray-300 mb-8 font-light">
            In SpellGrave,{' '}
            <strong className=" font-bold">power comes at a price.</strong>{' '}
            Defeat your enemies in epic duels, claim their rarest treasures, and
            forge legendary decks… but beware: in{' '}
            <strong className="font-bold">Hardcore Mode</strong>, defeat means{' '}
            <em className="italic ">permanent loss</em>. Cards can be looted,
            destroyed, or remembered as fallen heroes in your collection.
          </p>

          <p className="text-lg leading-relaxed text-gray-300 mb-12 font-light">
            From common foot soldiers to celestial legends, each card is brought
            to life with <strong className=" font-bold">stunning art</strong>,
            unique abilities, and deep lore. Whether you're chasing rare pulls,
            crafting the perfect strategy, or building the most storied
            collection in the realm, SpellGrave is where{' '}
            <span className="text-[#f4c76b] italic">
              friendship forges legends
            </span>{' '}
            — and becoming a legend is{' '}
            <em className="italic text-white">earned, not given.</em>
          </p>
        </div>
      </div>
      <div className="absolute  left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
         
          <path
            d="M0,0 C600,60 600,60 1200,120 L1200,120 L0,120 Z"
            className="fill-black"
          />

         
          <path
            d="M0,0 C600,60 600,60 1200,120"
            fill="none"
            stroke="#f97316"
            strokeWidth="10"
            className="opacity-80"
          />
        </svg>
      </div>
      {/* key features  */}
      <div className="bg-black h-screen mt-40 text-white py-20">
        <p className="text-sm font-[cinzel] text-[#7c699a] tracking-[0.3em] uppercase mb-6 text-center">
          KEY FEATURES
        </p>

        <h1 className="text-4xl font-[kapler] font-bold mb-4 text-center">
          Key Features
        </h1>

        <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-[#f4c76b] to-transparent mx-auto mb-12"></div>

        <div className="max-w-3xl mx-auto space-y-6 text-center">
          <p>
            <span className="font-bold">Living Card Histories</span> – Every
            card remembers its battles and victories.
          </p>
          <p>
            <span className="font-bold">Hardcore Mode</span> – Win glory or lose
            cards forever.
          </p>
          <p>
            <span className="font-bold">Epic Art & Lore</span> – From common
            soldiers to celestial gods.
          </p>
          <p>
            <span className="font-bold">PvP Duels & Trading</span> – Build your
            legend through battle and alliances.
          </p>
          <p>
            <span className="font-bold">Rare & Mythic Hunts</span> – Chase the
            rarest pulls in the realm.
          </p>
        </div>
      </div>
      <div className="">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 L600,0 L1200,120 L1200,120 L0,120 Z"
            className="fill-black"
          />

          <path
            d="M0,120 L600,4 L1200,120"
            fill="none"
            stroke="#f97316"
            strokeWidth="10"
            className="opacity-80"
          />
        </svg>
      </div>
      {/* The Developers*/}
      <div className="bg-black h-screen mt-20 text-white py-20">
        <p className="text-sm font-[cinzel] text-[#7c699a] tracking-[0.3em] uppercase mb-6 text-center">
          THE DEVELOPERS
        </p>

        <h1 className="text-4xl font-[kapler] font-bold mb-4 text-center">
          The Developers
        </h1>

        <div className="h-[2px] w-40 bg-gradient-to-r from-transparent via-[#f4c76b] to-transparent mx-auto mb-12"></div>

        <div className="max-w-3xl mx-auto space-y-8 text-center text-gray-300 font-light text-lg leading-relaxed">
          <p>
            We’re lifelong gamers who got tired of waiting for <em>“that”</em>{' '}
            game — the one we couldn’t put down, the one we’d dream about
            playing again and again. So, instead of waiting, we rolled up our
            sleeves, gathered our ideas, and built it ourselves.
          </p>

          <p>
            It started as a passion project between friends, but quickly grew
            into something much bigger: a world where every card tells a story,
            every match feels epic, and every player can leave their mark.
          </p>

          <p className="font-medium text-white">
            Welcome to the game we always wanted to play — now, it’s yours too.
          </p>
        </div>
      </div>
      <div>
      <svg
  className="relative block w-full h-20"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 1200 120"
  preserveAspectRatio="none"
>
  {/* Black background fill */}
  <path
    d="M0,0 C600,120 600,120 1200,0 L1200,120 L0,120 Z"
    className="fill-black"
  />

  {/* Orange stroke line */}
  <path
    d="M0,0 C600,120 600,120 1200,0"
    fill="none"
    stroke="#f97316"
    strokeWidth="10"
    className="opacity-80"
  />
</svg>

      </div>
      <Footer/>
    </div>
  );
};

export default About;
