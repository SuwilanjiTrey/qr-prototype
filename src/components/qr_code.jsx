import { QRCodeSVG } from 'qrcode.react';


// QR Generator Component
const QRGenerator = ({ client, onClose }) => {
  const qrUrl = `${window.location.origin}/qr-prototype/#/register/${client.qrCode}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-4">QR Code for {client.name}</h3>
        <div className="text-center mb-4">
          <QRCodeSVG value={qrUrl} size={200} />
        </div>
        <p className="text-sm text-gray-600 mb-4 break-all">
          URL: {qrUrl}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
          >
            Close
          </button>
          <button
            onClick={() => {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              canvas.width = canvas.height = 200;
              // Simple QR download placeholder
              const link = document.createElement('a');
              link.download = `qr-${client.name}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
export default QRGenerator;