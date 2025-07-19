import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, Music, Star, Sparkles, Heart, Camera, Ticket } from 'lucide-react';
import RegisterPage from './AnA/Registration.jsx'

// Music Festival Landing Page
export const MusicFestivalPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Define artist data with online image URLs
  const artists = [
    {
      name: 'Electric Dreams',
      genre: 'Electronic',
      imageUrl: '/qr-prototype/img1.jpeg' // Placeholder 1
    },
    {
      name: 'Neon Nights',
      genre: 'Synthwave',
      imageUrl: '/qr-prototype/img2.png' // Placeholder 2
    },
    {
      name: 'Cosmic Vibes',
      genre: 'Ambient',
      imageUrl: '/qr-prototype/img3.jpeg' // Placeholder 3
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <nav className="p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-pink-400" />
            <span className="text-2xl font-bold text-white">SoundWave</span>
          </div>
          <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-2 rounded-full font-medium hover:scale-105 transition-transform">
            Get Tickets
          </button>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-20 px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 mb-6 animate-pulse">
              SOUNDWAVE
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 mb-4 font-light">
              Three Days of Pure Magic
            </p>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Experience the ultimate music festival with world-class artists, incredible vibes, and unforgettable memories
            </p>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-white/80">
                <Calendar className="h-5 w-5" />
                <span>July 15-17, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <MapPin className="h-5 w-5" />
                <span>Desert Valley, CA</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <Users className="h-5 w-5" />
                <span>50,000 Festival Goers</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-2xl">
                <Ticket className="inline h-5 w-5 mr-2" />
                Buy Tickets Now
              </button>
              <button className="border-2 border-white/50 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-all">
                View Lineup
              </button>
            </div>
          </div>
        </div>

        {/* Artist Cards */}
        <div className="px-6 pb-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-12">Featured Artists</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {artists.map((artist, i) => ( // Use the 'artists' array defined above
                <div key={i} className="group cursor-pointer">
                  <div
                    className="h-64 rounded-2xl p-6 flex flex-col justify-end transform group-hover:scale-105 transition-all duration-300 bg-cover bg-center"
                    style={{ backgroundImage: `url(${artist.imageUrl})` }} // <--- Updated here
                  >
                    <h3 className="text-2xl font-bold text-white mb-2 text-shadow-md">{artist.name}</h3>
                    <p className="text-white/80 text-shadow-sm">{artist.genre}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

       
         <RegisterPage /> 
      </div>
    </div>
  );
};

// Concert Landing Page
export const ConcertPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Spotlight effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">StarLight</span>
          </div>
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors">
            Book Now
          </button>
        </nav>

        <div className="text-center py-32 px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
              AURORA
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                LIVE
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">An Intimate Evening of Music & Light</p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="h-5 w-5" />
                <span>Saturday, August 20, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Clock className="h-5 w-5" />
                <span>8:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-5 w-5" />
                <span>Madison Square Garden</span>
              </div>
            </div>

            <button className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
              Get Tickets from $75
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wedding Landing Page
export const WeddingPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Floating hearts */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <Heart
            key={i}
            className="absolute text-pink-200 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
              fontSize: `${1 + Math.random() * 0.5}rem`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-pink-500" />
            <span className="text-2xl font-bold text-gray-800">Ever After</span>
          </div>
          <button className="bg-pink-500 text-white px-6 py-2 rounded-full font-medium hover:bg-pink-600 transition-colors">
            RSVP
          </button>
        </nav>

        <div className="text-center py-32 px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-7xl font-light text-gray-800 mb-6">
              Sarah & Michael
            </h1>
            <div className="text-2xl text-pink-500 mb-8 font-light">
              are getting married
            </div>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Join us for a celebration of love, laughter, and the beginning of our forever
            </p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>September 15, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>4:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Sunset Gardens, Napa Valley</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-pink-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-pink-600 transition-colors shadow-lg">
                RSVP Yes!
              </button>
              <button className="border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full text-lg font-medium hover:bg-pink-50 transition-colors">
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Conference Landing Page
export const ConferencePage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Tech grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 gap-4 h-full">
          {[...Array(144)].map((_, i) => (
            <div
              key={i}
              className="border border-cyan-400 animate-pulse"
              style={{
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center backdrop-blur-sm bg-black/20">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">TechSummit</span>
          </div>
          <button className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-cyan-300 transition-colors">
            Register
          </button>
        </nav>

        <div className="text-center py-32 px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6">
              TECH
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                SUMMIT
              </span>
              <span className="block text-3xl font-light text-gray-300">2025</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">Shaping the Future of Technology</p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-gray-300">
                <Calendar className="h-5 w-5" />
                <span>October 10-12, 2025</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <MapPin className="h-5 w-5" />
                <span>San Francisco Convention Center</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <Users className="h-5 w-5" />
                <span>5,000+ Attendees</span>
              </div>
            </div>

            <button className="bg-gradient-to-r from-cyan-400 to-blue-400 text-black px-12 py-4 rounded-lg text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
              Register Now - Early Bird $299
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Photography Landing Page
export const PhotographyPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 relative overflow-hidden">
      {/* Camera flashes */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-yellow-300 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <nav className="p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-800">LensLight</span>
          </div>
          <button className="bg-amber-600 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-700 transition-colors">
            Book Session
          </button>
        </nav>

        <div className="text-center py-32 px-6">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-6xl md:text-8xl font-light text-gray-800 mb-6">
              Capture
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600 font-black">
                MOMENTS
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">Professional Photography Workshop</p>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Every Saturday</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-5 w-5" />
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>Golden Gate Park, SF</span>
              </div>
            </div>

            <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-12 py-4 rounded-full text-xl font-bold hover:scale-105 transition-transform shadow-2xl">
              Join Workshop - $150
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Demo Component with Page Selector
const EventLandingPages = () => {
  const [currentPage, setCurrentPage] = useState('festival');

  const pages = [
    { id: 'festival', name: 'Music Festival', icon: Music },
    { id: 'concert', name: 'Concert', icon: Star },
    { id: 'wedding', name: 'Wedding', icon: Heart },
    { id: 'conference', name: 'Conference', icon: Users },
    { id: 'photography', name: 'Photography', icon: Camera }
  ];

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'festival': return <MusicFestivalPage />;
      case 'concert': return <ConcertPage />;
      case 'wedding': return <WeddingPage />;
      case 'conference': return <ConferencePage />;
      case 'photography': return <PhotographyPage />;
      default: return <MusicFestivalPage />;
    }
  };

  return (
    <div className="relative">
      {/* Page Selector */}
      <div className="fixed top-4 left-4 z-50 bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
        <div className="flex flex-col space-y-2">
          {pages.map(page => {
            const IconComponent = page.icon;
            return (
              <button
                key={page.id}
                onClick={() => setCurrentPage(page.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  currentPage === page.id 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="text-sm font-medium">{page.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Page */}
      {renderCurrentPage()}
    </div>
  );
};

export default EventLandingPages;