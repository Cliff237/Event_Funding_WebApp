import QRCode from 'react-qr-code';
import type { ReceiptData, ReceiptSettings } from '../../components/Organizer/Events/type';

interface ReceiptPreviewProps {
  receiptSettings: ReceiptSettings;
  receiptData: ReceiptData;
}

export const ReceiptPreview = ({ receiptSettings, receiptData }: ReceiptPreviewProps) => {
  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Receipt Preview</h2>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="bg-white p-6 rounded shadow-sm max-w-md mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            {receiptSettings.logo && (
              <img src={receiptSettings.logo} alt="Logo" className="h-12" />
            )}
            <div className="text-right">
              <h2 className="text-xl font-bold">{receiptSettings.title}</h2>
              <p className="text-sm text-gray-500">{receiptData.date}</p>
            </div>
          </div>

          {/* School Info */}
          {receiptSettings.schoolInfo.name && (
            <div className="mb-4 pb-4 border-b">
              <h3 className="font-medium">{receiptSettings.schoolInfo.name}</h3>
              <p className="text-sm text-gray-600">{receiptSettings.schoolInfo.location}</p>
              <p className="text-sm text-gray-600">{receiptSettings.schoolInfo.contact}</p>
            </div>
          )}

          {/* Payment Details */}
          <div className="mb-4 space-y-3">
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-bold">{receiptData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Reference:</span>
              <span>{receiptData.reference}</span>
            </div>
            <div className="flex justify-between">
              <span>Payer:</span>
              <span>{receiptData.payer}</span>
            </div>
            <div className="flex justify-between">
              <span>Purpose:</span>
              <span>{receiptData.details}</span>
            </div>

            {/* Custom Fields */}
            {receiptSettings.customFields.map((field, index) => (
              <div key={index} className="flex justify-between">
                <span>{field.name}:</span>
                <span>{field.value || '-'}</span>
              </div>
            ))}
          </div>

          {/* QR Code */}
          {receiptSettings.includeQR && (
            <div className="mt-6 pt-4 border-t flex flex-col items-center">
              <div className="mb-2 text-sm font-medium">Payment Verification</div>
              <div className="p-2 bg-white border rounded">
                <QRCode
                  value={receiptSettings.qrData}
                  size={96}
                  fgColor="#000000"
                  bgColor="#ffffff"
                />
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Scan to verify this payment
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};