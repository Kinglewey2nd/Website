import React from 'react';
import Navbar from './Navbar';
import About from './About';
import { Link } from 'react-router-dom';
import useAuth from '@/useAuth';
import Footer from './Footer';

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="relative w-full text-white">
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: 'url(/spellgravebg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        className="relative w-full text-white"
      >
        <Navbar />
        <div className="flex flex-col items-start justify-center h-screen backdrop-brightness-80 px-10">
          <div className="flex flex-col items-center ml-48 mb-60">
            <h1
              className="text-6xl font-bold mb-4 font-[Cinzel] text-white"
              style={{
                textShadow: `
                  0 0 20px rgba(255,255,255,0.9),
                  0 0 40px rgba(255,255,255,0.8),
                  0 0 60px rgba(186,85,255,0.4),
                  0 0 80px rgba(186,85,255,0.3),
                  0 0 100px rgba(255,255,255,0.2)
                `,
              }}
            >
              S P E L L G R A V E
            </h1>

            <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-purple-200 to-transparent mx-auto mb-6"></div>
            <p className="text-xl mb-8 font-[cinzel] text-[#c9bcdb]">
              Where friendship forges legends
            </p>
            <a
              href={user ? '/menu' : '/login'}
              className="fotn-bold border-[0.5px] border-amber-100 text-white font-bold py-2 px-9 rounded-xl"
            >
              {user ? 'Enter the Realm' : 'Join the Adventure'}
            </a>
          </div>
        </div>

        {/* SVG Curve Divider */}
        <div className="absolute -bottom-1 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {/* Black background fill */}
            <path
              d="M0,0 C600,60 600,60 1200,120 L1200,120 L0,120 Z"
              className="fill-black"
            />

            {/* Orange stroke line */}
            <path
              d="M0,0 C600,60 600,60 1200,120"
              fill="none"
              stroke="#f97316"
              strokeWidth="10"
              className="opacity-80"
            />
          </svg>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-black h-screen w-full flex flex-col items-center justify-center py-24 px-8">
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
          <Link
            to="/about"
            className="border-2 border-[#f4c76b] text-[#f4c76b] hover:bg-[#f4c76b] hover:text-black transition-all duration-300 font-[cinzel] font-semibold py-3 px-8 rounded tracking-wide uppercase text-sm"
          >
            Learn More
          </Link>
        </div>
      </div>
      <div className="-mt-20">
          <svg
            className="relative block w-full h-20"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            {/* Black background fill */}
            <path
              d="M0,0 C600,60 600,60 1200,120 L1200,120 L0,120 Z"
              className="fill-black"
            />

            {/* Orange stroke line */}
            <path
              d="M0,0 C600,60 600,60 1200,120"
              fill="none"
              stroke="#f97316"
              strokeWidth="10"
              className="opacity-80"
            />
          </svg>
        </div>
      <Footer />
    </div>
  );
};

export default Home;
