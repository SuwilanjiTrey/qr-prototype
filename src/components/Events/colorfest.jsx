import React, { useState, useEffect } from 'react';
import { ShoppingCart, Clock, Truck, Users, Star, MapPin, Phone, Mail, Home, Package, Heart, CheckCircle } from 'lucide-react';

import RegisterPage from '../AnA/Registration'; 


const QedApp = () => {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-First Hero Section */}
      <section className="bg-gradient-to-br from-green-500 to-emerald-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute top-32 right-8 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-16 w-12 h-12 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="relative px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Logo */}
            <div className={`transform transition-all duration-1000 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img src="/qr-prototype/qedlogo.png" />
              </div>
              <p className="text-lg sm:text-xl text-green-100 font-medium">
                Quick Efficient Delivery
              </p>
            </div>
            
            <div className={`transform transition-all duration-1000 delay-300 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Spend weekends with family,<br />not grocery shopping
              </h2>
              <p className="text-base sm:text-lg text-green-100 max-w-md mx-auto">
                Fresh groceries delivered to your door. Free delivery on all orders in Lusaka.
              </p>
            </div>

            {/* CTA Button */}
            <div className={`transform transition-all duration-1000 delay-500 ${isAnimated ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="bg-white text-green-600 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <ShoppingCart className="inline mr-2" size={20} />
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            How QED Works
          </h2>
          
          <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">1. Browse</h3>
              <p className="text-gray-600 text-sm">
                Choose from thousands of fresh products from your favorite local stores
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">2. Order</h3>
              <p className="text-gray-600 text-sm">
                Add items to cart and checkout in minutes with secure payment
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">3. Delivered for free</h3>
              <p className="text-gray-600 text-sm">
                Get your groceries delivered fresh to your doorstep at no extra cost
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            Why Choose QED?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Truck className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Free Delivery</h3>
                  <p className="text-sm text-gray-600">
                    No delivery fees on any order. More savings for your family.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Fast Service</h3>
                  <p className="text-sm text-gray-600">
                    Same-day delivery available. Order by 2PM for evening delivery.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Fresh Quality</h3>
                  <p className="text-sm text-gray-600">
                    Hand-picked fresh produce and quality goods from trusted suppliers.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-start space-x-4">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Family Focused</h3>
                  <p className="text-sm text-gray-600">
                    Built for families. Bulk options and family-sized packages available.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Trusted by Families Across Lusaka
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">5,000+</div>
              <p className="text-gray-600">Happy Families</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">15,000+</div>
              <p className="text-gray-600">Orders Delivered</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.8★</div>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-green-50 p-6 rounded-2xl max-w-2xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={20} />
              ))}
            </div>
            <p className="text-gray-700 mb-4 italic">
              "QED has been a game-changer for our family. Fresh groceries delivered right to our door, 
              and the kids love helping me unpack everything. More time for what matters most!"
            </p>
            <p className="text-sm text-gray-600 font-medium">- Sarah M., Kabulonga</p>
          </div>
        </div>
      </section>

      {/* Coverage Areas */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8">
            We Deliver To
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              'Lusaka Central', 'Kabulonga', 'Rhodes Park', 
              'Woodlands', 'Chelston', 'Avondale',
              'Roma', 'Fairview', 'Ridgeway'
            ].map((area, i) => (
              <div key={i} className="bg-white p-4 rounded-lg text-center border border-gray-100">
                <MapPin className="mx-auto mb-2 text-green-600" size={20} />
                <p className="text-sm font-medium text-gray-800">{area}</p>
              </div>
            ))}
          </div>
          
          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't see your area? <span className="text-green-600 font-medium">Contact us</span> - we're expanding!
          </p>
        </div>
      </section>

      {/* Registration Section - Mobile Optimized */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-green-100 max-w-2xl mx-auto">
              Join thousands of families who trust QED for their grocery needs. 
              Create your account today and get your first delivery free!
            </p>
          </div>
          
          <div className="flex justify-center">
            <RegisterPage />
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 text-center text-sm text-green-100 space-y-2">
            <p className="flex items-center justify-center">
              <CheckCircle className="mr-2" size={16} />
              No subscription fees
            </p>
            <p className="flex items-center justify-center">
              <CheckCircle className="mr-2" size={16} />
              Cancel anytime
            </p>
            <p className="flex items-center justify-center">
              <CheckCircle className="mr-2" size={16} />
              24/7 customer support
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                
                <img src="/qr-prototype/qedlogo.png" />
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Quick Efficient Delivery - Making grocery shopping easier for Zambian families.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact Us</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center">
                  <Phone className="mr-2 text-green-400" size={16} />
                  +260 XXX XXX XXX
                </p>
                <p className="flex items-center">
                  <Mail className="mr-2 text-green-400" size={16} />
                  hello@qed.zm
                </p>
                <p className="flex items-center">
                  <MapPin className="mr-2 text-green-400" size={16} />
                  Lusaka, Zambia
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 QED. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default QedApp;
