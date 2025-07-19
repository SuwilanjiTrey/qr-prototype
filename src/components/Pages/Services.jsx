// Services Page
const ServicesPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Services</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">QR Code Generation</h3>
          <p className="text-gray-600">Create custom QR codes for your marketing campaigns with advanced tracking capabilities.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">Analytics Dashboard</h3>
          <p className="text-gray-600">Monitor your QR code performance with real-time analytics and detailed reports.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-bold mb-4">User Registration</h3>
          <p className="text-gray-600">Capture user data through customizable registration forms linked to your QR codes.</p>
        </div>
      </div>
    </div>
  );
};
export default ServicesPage;