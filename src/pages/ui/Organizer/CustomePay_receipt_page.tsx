import { useState } from 'react';
import {  FiChevronRight } from 'react-icons/fi';
import { ReceiptCustomization } from './ReceiptCustomization';
import { ReceiptPreview } from './ReceiptPreview';
import type { AccountDetails, EventConfig, PaymentGetMethod, ReceiptData, ReceiptSettings, WalletSettings } from '../../components/Organizer/Events/type';
import { PaymentGetMethodSection } from './PaymentGetSetUp';
import { FaArrowLeft } from 'react-icons/fa';
import EventLinkCardEditor from '../../components/Organizer/Events/EventLinkCardEditor';


export const PaymentGetSetup = () => {
    const event = useState<EventConfig>({
        id: '',
        title: 'Event Contribution',
        description: '',
        category: 'school',
        subType: '',
        fields: [
          {
            id: 'custom Field',
            label: 'Custom Field',
            type: 'text',
            required: true,
            readOnly: false
          },
        ],
        theme: {
          primaryColor: '#7C3AED',
          secondaryColor: '#EDE9FE',
          bgColor: '#FFFFFF'
        }
      });

  const [showEventLink, setShowEventLink] = useState(false)
  const handleShaowEvent = ()=>setShowEventLink(!showEventLink)
  // Payment method state
  const [selectedMethod, setSelectedMethod] = useState<PaymentGetMethod>('wallet');
  const [accountDetails, setAccountDetails] = useState<AccountDetails>({
    momoNumber: '',
    omNumber: '',
    bankAccount: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
    },
  });
  const [walletSettings, setWalletSettings] = useState<WalletSettings>({
    freezeDuration: 0,
    autoWithdraw: false,
  });

  // Receipt customization
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings>({
    title: 'Payment Receipt',
    logo: null,
    customFields: [],
    includeQR: true,
    qrData: 'https://shaderlpay.com/verify-payment/REF-2023-001',
    schoolInfo: {
      name: '',
      location: '',
      contact: '',
    },
  });

  // Sample receipt data
  const receiptData: ReceiptData = {
    amount: 'XAF ',
    date: new Date().toLocaleDateString(),
    reference: 'REF-2023-001',
    payer: 'John Doe',
    details: 'School Defense Fees - Level 2',
  };

  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'word' | 'png' | 'jpeg'>('pdf');
  return (
    <div className="text-gray-800 h-fit bg-gray-900/80 p-4 ">
      <div className="w-full">
        {/* <h1 className="text-2x  md:text-3xl font-bold text-gray-50 mb-6">Payment Setup</h1> */}
        <div className='mb-2 flex justify-between '>
          <button
          className='text-purple-800 flex items-center p-2 border-2 rounded border-purple-800'
          // onClick={handleBack}
          > <FaArrowLeft/>Go Back</button>

        </div>
        <PaymentGetMethodSection
          selectedMethod={selectedMethod}
          setSelectedMethod={setSelectedMethod}
          accountDetails={accountDetails}
          setAccountDetails={setAccountDetails}
          walletSettings={walletSettings}
          setWalletSettings={setWalletSettings}
        />

        <ReceiptCustomization
          receiptSettings={receiptSettings}
          setReceiptSettings={setReceiptSettings}
        />
        <ReceiptPreview
          receiptSettings={receiptSettings}
          receiptData={receiptData}
        />


        {/* Action Buttons */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  <small>Select The payment Receipt File Format</small>
                  <div className="relative">
                    
                      <select
                      value={selectedFormat}
                      onChange={(e) => setSelectedFormat(e.target.value as 'pdf' | 'word')}
                      className="appearance-none pl-3 pr-8 py-2 border rounded bg-white hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                      <option value="pdf">PDF Format</option>
                      <option value="word">Word Format</option>
                      <option value="png">PNG Image</option>
                      <option value="jpeg">JPEG Image</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                      </div>
                  </div>
                </div>
                
                <button 
                className="flex items-center px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                onClick={handleShaowEvent}
                >
                <FiChevronRight className="mr-2" />
                Custom Event Link
                </button>
            </div>
        </section>

      </div>

      {showEventLink && (
          <EventLinkCardEditor 
            event={event[0]}
            onSave={(cardData) => {
            // Save the card data to your backend
            console.log('Saving card:', cardData);
            // Then you might navigate to dashboard or show success message
            }}
            onBack={() =>selectedFormat}
            
          />
        )}
    </div>
  );
};