import React from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import useAuth from '@/useAuth';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative w-full text-white">
      <style>{`
        @keyframes sg-fadeInUp {
          0%   { opacity: 0; transform: translateY(10px) scale(.985); filter: blur(1px); }
          60%  { opacity: 1; transform: translateY(0)   scale(1.01);  filter: blur(0); }
          100% { opacity: 1; transform: translateY(0)   scale(1); }
        }
        @keyframes sg-goldShift {
          0%   { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        @keyframes sg-underline {
          from { width: 0%; opacity: 0; }
          to   { width: 72%; opacity: 1; }
        }
        @keyframes sg-twinkle {
          0%,100% { opacity: .3; transform: scale(.8); }
          50%     { opacity: 1; transform: scale(1); }
        }

        .sg-titleWrap {
          position: relative;
          display: inline-block;
          padding: clamp(8px, 1.5vw, 14px) clamp(14px, 2vw, 22px);
        }
        .sg-titleWrap::before {
          content: "";
          position: absolute;
          inset: -10% -14%;
          background:
            radial-gradient(120% 85% at 50% 50%,
              rgba(0,0,0,.12) 0%,
              rgba(0,0,0,.06) 45%,
              rgba(0,0,0,0) 72%);
          border-radius: 24px;
          filter: blur(1.5px);
          pointer-events: none;
        }

        /* SPELLGRAVE — tighter letter spacing, strong stroke & glow */
        .sg-title {
          animation: sg-fadeInUp .8s ease-out both, sg-goldShift 16s linear .6s infinite;
          letter-spacing: .08em; /* reduced from .16em */
          white-space: nowrap;
          user-select: none;

          background: linear-gradient(90deg,
            #f4d27b 0%,
            #ffd98a 28%,
            #ffeab8 50%,
            #ffd98a 72%,
            #f4d27b 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;

          /* stronger stroke for more definition */
          -webkit-text-stroke: 1px rgba(255, 240, 200, .55);

          /* slightly brighter glow */
          text-shadow:
            0 0 8px rgba(255, 225, 170, .65),
            0 0 16px rgba(255, 210, 120, .45),
            0 0 30px rgba(255, 190, 90, .35);
        }

        .sg-title::after {
          content: "";
          display: block;
          height: 2px;
          margin: 12px auto 0;
          width: 0%;
          background: linear-gradient(90deg, #ffeaa0, #ffd76b, #ffeaa0);
          box-shadow:
            0 0 14px rgba(255, 234, 160, .7),
            0 0 28px rgba(255, 215, 107, .4);
          border-radius: 999px;
          animation: sg-underline .7s ease-out .35s forwards;
        }

        /* PLAY BUTTON — solid black base */
        .sg-cta-btn {
          border: 1.5px solid #ffeaa0;
          background: #000;
          color: #fff7dc;
          backdrop-filter: blur(2px);
          transition: all .3s ease;
        }
        .sg-cta-btn:hover {
          background: #000;
          color: #fffbe8;
          box-shadow: 0 0 12px rgba(255, 234, 160, .5);
        }

        .sg-stars {
          position: absolute;
          inset: -40% -24% -28% -24%;
          pointer-events: none;
        }
        .sg-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #ffeab8;
          animation: sg-twinkle 6s ease-in-out infinite;
        }
        .sg-star:nth-child(1){ top:10%; left:18%; animation-delay:0s; }
        .sg-star:nth-child(2){ top:22%; right:12%; animation-delay:1s; }
        .sg-star:nth-child(3){ top:42%; left:6%;  animation-delay:2s; }
        .sg-star:nth-child(4){ top:55%; left:50%; animation-delay:3s; }
        .sg-star:nth-child(5){ top:28%; left:72%; animation-delay:4s; }
        .sg-star:nth-child(6){ top:70%; left:30%; animation-delay:5s; }
        .sg-star:nth-child(7){ top:12%; left:50%; animation-delay:6s; }
        .sg-star:nth-child(8){ top:60%; right:8%;  animation-delay:7s; }
        .sg-star:nth-child(9){ top:35%; left:38%; animation-delay:8s; }
        .sg-star:nth-child(10){top:18%; left:86%; animation-delay:9s; }

        @media (prefers-reduced-motion: reduce) {
          .sg-title, .sg-cta-btn, .sg-star { animation: none !important; }
          .sg-title::after { width: 72%; opacity: 1; }
        }
      `}</style>

      <div
        className="relative w-full text-white"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center 35%',
          backgroundColor: 'black'
        }}
      >
        <Navbar />
        <div className="flex h-[calc(100vh-64px)] items-start justify-center px-6">
          <div className="flex flex-col items-center text-center w-full pt-[16vh]">
            <div className="relative">
              {/* Star flickers */}
              <div className="sg-stars" aria-hidden="true">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="sg-star" />
                ))}
              </div>

              {/* Title */}
              <div className="sg-titleWrap">
                <h1 className="sg-title font-[Cinzel] font-black text-[9vw] sm:text-6xl md:text-7xl lg:text-8xl">
                  S P E L L G R A V E
                </h1>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-8 animate-[sg-fadeInUp_.8s_ease-out_.35s_both]">
              <Link
                to={user ? '/play' : '/login'}
                className="sg-cta-btn inline-block rounded-2xl px-10 py-3 uppercase tracking-wide text-sm font-semibold"
              >
                Play
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
