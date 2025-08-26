import { useState } from 'react';
import { FiEdit2, FiImage, FiInfo, FiPlus, FiType} from 'react-icons/fi';
import type { CustomField, ReceiptSettings, SchoolInfo } from '../../components/Organizer/Events/type';
import { QrCode } from 'lucide-react';
import { CustomFieldModal } from './CustomFieldForm';

interface ReceiptCustomizationProps {
  receiptSettings: ReceiptSettings;
  setReceiptSettings: (settings: ReceiptSettings | ((prev: ReceiptSettings) => ReceiptSettings)) => void;
}

export const ReceiptCustomization = ({
  receiptSettings,
  setReceiptSettings,
}: ReceiptCustomizationProps) => {
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);

  const handleReceiptSettingChange = (setting: keyof ReceiptSettings, value: any) => {
    setReceiptSettings((prev: ReceiptSettings) => ({ ...prev, [setting]: value }));
  };

  const handleSchoolInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReceiptSettings((prev: ReceiptSettings) => ({
      ...prev,
      schoolInfo: {
        ...prev.schoolInfo,
        [name]: value,
      },
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleReceiptSettingChange('logo', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addCustomField = (field: CustomField) => {
    if (field.name) {
      setReceiptSettings((prev: ReceiptSettings) => ({
        ...prev,
        customFields: [...prev.customFields, field],
      }));
    }
  };

  const removeCustomField = (index: number) => {
    setReceiptSettings((prev: ReceiptSettings) => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiEdit2 className="mr-2" />
        Payment Proof Configuration
      </h2>

      {/* Basic Settings */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <FiInfo className="mr-2" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Receipt Title</label>
            <input
              type="text"
              value={receiptSettings.title}
              onChange={(e) => handleReceiptSettingChange('title', e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Payment Receipt"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Logo</label>
            <div className="flex items-center">
              {receiptSettings.logo ? (
                <img src={receiptSettings.logo} alt="Logo" className="h-10 mr-3" />
              ) : (
                <div className="h-10 w-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                  <FiImage className="text-gray-400" />
                </div>
              )}
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <label
                htmlFor="logo-upload"
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-sm"
              >
                Upload Logo
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* School Information */}
      <div className="mb-6 p-4 border rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <FiInfo className="mr-2" />
          School Information 
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: 'name', label: 'School Name', placeholder: 'University of ...' },
            { name: 'location', label: 'Location', placeholder: 'City, Country' },
            { name: 'contact', label: 'Contact', placeholder: 'Email or Phone' },
          ].map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={receiptSettings.schoolInfo[field.name as keyof SchoolInfo]}
                onChange={handleSchoolInfoChange}
                className="w-full p-2 border rounded"
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom Fields */}
      <div className="mb-6 p-4 border rounded-lg">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium flex items-center">
            <FiType className="mr-2" />
            Additional Fields
          </h3>
          <button
            onClick={() => setIsAddFieldModalOpen(true)}
            className="flex items-center px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
          >
            <FiPlus className="mr-1" />
            Add Field
          </button>
        </div>

        {receiptSettings.customFields.length > 0 ? (
          <div className="space-y-3">
            {receiptSettings.customFields.map((field, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium">{field.name}</div>
                  <div className="text-sm text-gray-600">{field.value || '(empty)'}</div>
                </div>
                <button
                  onClick={() => removeCustomField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No additional fields added yet</p>
        )}
      </div>

      {/* QR Code Settings */}
      <div className="p-4 border rounded-lg">
        <h3 className="font-medium mb-3 flex items-center">
          <QrCode className="mr-2" />
          QR Code Verification
        </h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={receiptSettings.includeQR}
              onChange={(e) => handleReceiptSettingChange('includeQR', e.target.checked)}
              className="mr-2"
            />
            Include QR Code on receipt
          </label>

          {receiptSettings.includeQR && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">QR Code Content</label>
                <input
                  type="text"
                  value={receiptSettings.qrData}
                  onChange={(e) => handleReceiptSettingChange('qrData', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Verification URL or data"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be encoded in the QR code for verification
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <CustomFieldModal
        isOpen={isAddFieldModalOpen}
        onClose={() => setIsAddFieldModalOpen(false)}
        onAddField={addCustomField}
      />
    </section>
  );
};