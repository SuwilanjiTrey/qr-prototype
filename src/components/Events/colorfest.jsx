import React, { useState, useEffect } from 'react';
import { Sparkles, Users, CalendarHeart, MapPin, Music, Camera, Star, Zap } from 'lucide-react';
import RegisterPage from '../AnA/Registration'; // Assuming this is your registration form component


const ColorFest = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-yellow-400 via-orange-500 to-purple-600 text-white overflow-hidden">
      {/* Floating Color Particles Animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-4 h-4 rounded-full animate-bounce opacity-70 ${
              ['bg-pink-400', 'bg-yellow-400', 'bg-purple-400', 'bg-orange-400', 'bg-green-400'][i % 5]
            }`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative text-center p-10 flex flex-col items-center justify-center space-y-8 min-h-screen">
        <div className={`transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-6xl md:text-8xl font-extrabold drop-shadow-xl mb-4">
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent animate-pulse">
              SPLASH OF COLORS
            </span>
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-yellow-200 mb-6">
            Zambia's Biggest Color Festival 2025
          </h2>
        </div>
        
        <p className="text-lg md:text-xl max-w-2xl leading-relaxed text-center">
          Join 4,000+ festival-goers for the ultimate celebration of life, music, and color! 
          Experience the magic of Holi merged with Zambian culture - live performances, 
          color throwing, dancing, and unforgettable memories.
        </p>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
            <CalendarHeart className="mx-auto mb-3 text-yellow-300" size={40} />
            <h3 className="font-bold text-lg mb-2">When</h3>
            <p className="text-sm">April 19, 2025</p>
            <p className="text-sm">10 AM - 8 PM</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
            <MapPin className="mx-auto mb-3 text-pink-300" size={40} />
            <h3 className="font-bold text-lg mb-2">Where</h3>
            <p className="text-sm">NASDEC Sports Complex</p>
            <p className="text-sm">Lusaka, Zambia</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
            <Users className="mx-auto mb-3 text-purple-300" size={40} />
            <h3 className="font-bold text-lg mb-2">Experience</h3>
            <p className="text-sm">4,000+ Attendees</p>
            <p className="text-sm">All Ages Welcome</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button className="bg-gradient-to-r from-pink-600 to-purple-700 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            <Sparkles className="inline mr-2" />
            Get Your Tickets Now
          </button>
          <button className="bg-white/20 backdrop-blur-sm border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all">
            <Camera className="inline mr-2" />
            View Gallery
          </button>
        </div>
      </section>

      {/* Artists Lineup */}
      <section className="bg-gradient-to-r from-purple-900/80 to-pink-900/80 backdrop-blur-sm p-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-yellow-300">Star-Studded Lineup</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: "Kamo Mphela", role: "Headliner", color: "from-pink-500 to-purple-600" },
            { name: "Slap Dee", role: "Hip Hop Icon", color: "from-yellow-500 to-orange-600" },
            { name: "Yo Maps", role: "Afrobeat Star", color: "from-green-500 to-blue-600" },
            { name: "Chanda Na Kay", role: "Local Heroes", color: "from-purple-500 to-pink-600" }
          ].map((artist, i) => (
            <div key={i} className={`bg-gradient-to-br ${artist.color} p-4 rounded-xl text-center transform hover:scale-105 transition-all`}>
              <Star className="mx-auto mb-2 text-yellow-300" />
              <h3 className="font-bold">{artist.name}</h3>
              <p className="text-sm opacity-90">{artist.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Festival Highlights */}
      <section className="p-10">
        <h2 className="text-4xl font-bold text-center mb-12">Festival Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Music className="mx-auto mb-4 text-yellow-400" size={50} />
            <h3 className="font-bold text-xl mb-2">Live Performances</h3>
            <p className="text-sm">Top Zambian & African artists on multiple stages</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Sparkles className="mx-auto mb-4 text-pink-400" size={50} />
            <h3 className="font-bold text-xl mb-2">Color Throwing</h3>
            <p className="text-sm">Premium colored powders & paint stations</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Users className="mx-auto mb-4 text-purple-400" size={50} />
            <h3 className="font-bold text-xl mb-2">Family Fun</h3>
            <p className="text-sm">Kids zones, food courts & cultural activities</p>
          </div>
          
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl">
            <Zap className="mx-auto mb-4 text-orange-400" size={50} />
            <h3 className="font-bold text-xl mb-2">Brand Experiences</h3>
            <p className="text-sm">Interactive installations & sponsored activations</p>
          </div>
        </div>
      </section>

      {/* Festival Gallery */}
      <section className="p-10 bg-black/20">
        <h2 className="text-4xl font-bold text-center mb-8">Experience the Magic</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          <img
            src="/qr-prototype/img3.jpeg"
            alt="Color explosion at festival"
            className="rounded-2xl shadow-xl h-64 object-cover transform hover:scale-105 transition-all"
          />
          <img
            src="/qr-prototype/img1.jpeg"
            alt="Dancing crowd"
            className="rounded-2xl shadow-xl h-64 object-cover transform hover:scale-105 transition-all"
          />
          <img
            src="/qr-prototype/hands.jpeg"
            alt="Festival atmosphere"
            className="rounded-2xl shadow-xl h-64 object-cover transform hover:scale-105 transition-all"
          />
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="bg-white/10 backdrop-blur-sm p-10">
        <h2 className="text-2xl font-bold text-center mb-6">Proudly Sponsored By</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
          <div className="bg-white/20 px-6 py-3 rounded-lg">Proflight Zambia</div>
          <div className="bg-white/20 px-6 py-3 rounded-lg">Johnnie Walker Blonde</div>
          <div className="bg-white/20 px-6 py-3 rounded-lg">NASDEC</div>
          <div className="bg-white/20 px-6 py-3 rounded-lg">Posh Zambia</div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="bg-white text-black p-10 rounded-t-3xl shadow-inner relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Join the Color Revolution!
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't miss Zambia's most vibrant celebration! Register now and be part of the 4,000+ festival-goers 
            creating unforgettable memories at NASDEC Sports Complex.
          </p>
          <RegisterPage />
          
          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">📱 Follow us on social media for updates</p>
            <p>🎨 White clothes recommended for maximum color impact!</p>
            <p>🚗 Shuttle services available from city center</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ColorFest;
