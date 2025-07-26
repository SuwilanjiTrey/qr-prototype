import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  QrCode, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  Shield, 
  Globe,
  Play,
  Check,
  Star,
  Eye,
  MousePointer,
  BarChart3,
  Sparkles,
  Megaphone,
  Building2,
  Calendar,
  Camera
} from 'lucide-react';
import Navbar from './Pages/Navbar.jsx';

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMetric, setActiveMetric] = useState(0);
  const [floatingElements, setFloatingElements] = useState([]);

  const metrics = [
    { label: 'Brands Promoted', value: '25,000+', icon: Building2, color: 'from-pink-500 to-rose-500' },
    { label: 'QR Interactions', value: '8.2M+', icon: MousePointer, color: 'from-blue-500 to-cyan-500' },
    { label: 'Events Advertised', value: '15,000+', icon: Calendar, color: 'from-green-500 to-emerald-500' },
    { label: 'Campaign ROI', value: '340%', icon: TrendingUp, color: 'from-purple-500 to-indigo-500' }
  ];

  const advertisingServices = [
    {
      icon: Megaphone,
      title: 'Brand Amplification',
      description: 'Transform any surface into premium advertising real estate with our intelligent QR campaigns',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: Calendar,
      title: 'Event Promotion',
      description: 'Drive massive attendance with location-based QR codes and real-time engagement tracking',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Building2,
      title: 'Corporate Campaigns',
      description: 'Enterprise-grade advertising solutions that connect brands with their target demographics',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      title: 'Visual Marketing',
      description: 'Eye-catching QR designs that blend seamlessly with any marketing material or environment',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ];
  
  const images = [
    {
      
      imageUrl: '/qr-prototype/QED.jpeg' // Placeholder 1
    },
    {
      
      imageUrl: '/qr-prototype/img2.png' // Placeholder 2
    },
    {
      
      imageUrl: '/qr-prototype/salsa.jpeg' // Placeholder 3
    }
  ];

  // Create floating elements for visual appeal
  useEffect(() => {
    const elements = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
    }));
    setFloatingElements(elements);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMetric((prev) => (prev + 1) % metrics.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-pink-900/20"></div>
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 animate-pulse"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              animationDelay: `${element.delay}s`,
              animationDuration: `${element.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-full text-cyan-300 text-sm font-bold mb-8 border border-cyan-500/30">
                <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                #1 QR Advertising Platform
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8 leading-tight">
                <span className="block text-white">We Make</span>
                <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Brands Famous
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-gray-300 mb-10 leading-relaxed font-light">
                Transform any company, event, or product into a viral sensation with our revolutionary QR advertising network. We don't just advertise – we create phenomena.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6">
                <button className="group relative bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-purple-500/25 transform hover:-translate-y-2 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    Launch Campaign
                    <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                <button className="group border-2 border-purple-500 text-purple-300 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 flex items-center justify-center">
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  See Results
                </button>
              </div>
            </div>
            
            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl border border-white/10 p-8 backdrop-blur-sm">
                <div className="aspect-square bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                   <div className="w-full h-full">
        <img 
          src="/qr-prototype/QED.jpeg" 
          alt="QR Code Example"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
                </div>
                {/* Floating QR codes animation */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center animate-bounce">
      <QrCode className="w-8 h-8 text-white" />
    </div>
    <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg flex items-center justify-center animate-pulse">
      
                  <Target className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Metrics Bar */}
        <div className="mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <div 
                    key={index}
                    className={`relative group p-6 rounded-2xl transition-all duration-700 cursor-pointer ${
                      activeMetric === index 
                        ? `bg-gradient-to-br ${metric.color} shadow-2xl shadow-purple-500/25 scale-110 z-10` 
                        : 'bg-slate-800/50 border border-white/10 hover:border-purple-500/50 backdrop-blur-sm hover:scale-105'
                    }`}
                  >
                    <Icon className={`w-10 h-10 mb-4 transition-all duration-300 ${
                      activeMetric === index ? 'text-white scale-110' : 'text-gray-400 group-hover:text-purple-400'
                    }`} />
                    <div className={`text-3xl font-black mb-2 transition-all duration-300 ${
                      activeMetric === index ? 'text-white' : 'text-gray-200'
                    }`}>
                      {metric.value}
                    </div>
                    <div className={`text-sm font-medium transition-all duration-300 ${
                      activeMetric === index ? 'text-white/90' : 'text-gray-400'
                    }`}>
                      {metric.label}
                    </div>
                    {activeMetric === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Services */}
      <section id="services" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              We Advertise
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Everything, Everywhere
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              From Fortune 500 brands to local events, we turn every surface into premium advertising real estate. Our QR technology makes the impossible, possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {advertisingServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className="group relative p-8 rounded-3xl bg-slate-800/30 border border-white/10 hover:border-purple-500/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {service.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>

          {/* Campaign Showcase */}
          <div className="grid md:grid-cols-3 gap-8">
  {images.map((image, i) => (  // Changed to map through images array
    <div key={i} className="group relative rounded-3xl overflow-hidden bg-slate-800/50 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:-translate-y-2">
      <div className="aspect-video bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center">
        <div className="w-full h-full">
          <img 
            src={image.imageUrl}  // Changed to use image from array
            alt={`Campaign ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="p-6">
        <h4 className="text-xl font-bold text-white mb-2">Success Story {i + 1}</h4>
        <p className="text-gray-400">Amazing results from our latest campaigns</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Investment CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20"></div>
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-300 text-sm font-bold mb-8 border border-green-500/30">
            <DollarSign className="w-5 h-5 mr-2" />
            Massive ROI Opportunity
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-8">
            Join the
            <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"> Advertising Revolution</span>
          </h2>
          
          <p className="text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
            We're disrupting a $800B global advertising market. Our QR technology delivers 10x better engagement rates than traditional advertising. The future is now.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <button className="group bg-gradient-to-r from-green-500 via-cyan-500 to-purple-500 text-white px-12 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 transition-all duration-300">
              <span className="flex items-center justify-center">
                Invest Now
                <TrendingUp className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform" />
              </span>
            </button>
            <button className="border-2 border-cyan-500 text-cyan-300 px-12 py-6 rounded-2xl font-bold text-xl hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300">
              Download Deck
            </button>
          </div>

          {/* Investment Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '$800B', label: 'Market Size' },
              { value: '10x', label: 'Better ROI' },
              { value: '94%', label: 'Client Retention' },
              { value: '500%', label: 'Growth Rate' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-xl border-t border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-4 mb-8 md:mb-0">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AdQR Pro
                </span>
                <div className="text-gray-400 text-sm">Advertising Revolution</div>
              </div>
            </div>
            <div className="flex space-x-12">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors font-medium">Terms</a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors font-medium">Contact</a>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 AdQR Pro. All rights reserved. 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"> Making brands famous worldwide.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
