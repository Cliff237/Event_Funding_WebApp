import { FiDollarSign, FiSmartphone, FiPhone, FiCreditCard } from 'react-icons/fi';
import type { AccountDetails, PaymentGetMethod, WalletSettings } from '../../components/Organizer/Events/type';

interface PaymentMethodSectionProps {
  selectedMethod: PaymentGetMethod;
  setSelectedMethod: (method: PaymentGetMethod) => void;
  accountDetails: AccountDetails;
  setAccountDetails: (details: AccountDetails) => void;
  walletSettings: WalletSettings;
  setWalletSettings: (settings: WalletSettings) => void;
}

export const PaymentGetMethodSection = ({
  selectedMethod,
  setSelectedMethod,
  accountDetails,
  setAccountDetails,
  walletSettings,
  setWalletSettings,
}: PaymentMethodSectionProps) => {
  const handleAccountDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('bank_')) {
      setAccountDetails({
        ...accountDetails,
        bankAccount: {
          ...accountDetails.bankAccount,
          [name.split('_')[1]]: value,
        },
      });
    } else {
      setAccountDetails({
        ...accountDetails,
        [name]: value,
      });
    }
  };

  const handleWalletSettingChange = (setting: keyof WalletSettings, value: boolean | number) => {
    setWalletSettings({ ...walletSettings, [setting]: value });
  };

  return (
    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FiDollarSign className="mr-2" />
        Payment Destination
      </h2>
      
      {/* Payment method cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { id: 'wallet', name: 'ShaderlPay Wallet', icon: <FiDollarSign />, color: 'text-green-600' },
          { id: 'momo', name: 'Mobile Money', icon: <FiSmartphone />, color: 'text-purple-600' },
          { id: 'om', name: 'OM', icon: <FiPhone />, color: 'text-blue-600' },
          { id: 'bank', name: 'Bank Account', icon: <FiCreditCard />, color: 'text-yellow-600' },
        ].map(method => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedMethod === method.id ? 'border-purple-800 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedMethod(method.id as PaymentGetMethod)}
          >
            <div className="flex items-center mb-2">
              <span className={`text-2xl mr-2 ${method.color}`}>{method.icon}</span>
              <span className="font-medium">{method.name}</span>
            </div>
            <p className="text-sm text-gray-600">
              {method.id === 'wallet' 
                ? 'Receive payments in your app wallet' 
                : `Direct to your ${method.name.toLowerCase()} account`}
            </p>
          </div>
        ))}
      </div>

      {/* Method-specific settings */}
      {selectedMethod === 'wallet' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Wallet Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={walletSettings.autoWithdraw}
                  onChange={(e) => handleWalletSettingChange('autoWithdraw', e.target.checked)}
                  className="mr-2"
                />
                Auto-withdraw to linked account after freeze period
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Withdrawal Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={walletSettings.freezeDuration ? 
                    new Date(Date.now() + walletSettings.freezeDuration * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split('T')[0] : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const selectedDate = new Date(e.target.value);
                      const today = new Date();
                      const diffTime = selectedDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      handleWalletSettingChange('freezeDuration', diffDays);
                    } else {
                      handleWalletSettingChange('freezeDuration', 0);
                    }
                  }}
                  className="w-full p-2 border rounded appearance-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              {walletSettings.freezeDuration > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Funds will be available on {new Date(Date.now() + walletSettings.freezeDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              )}
              {walletSettings.freezeDuration === 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Funds will be available immediately
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {(selectedMethod === 'momo' || selectedMethod === 'om') && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">
            {selectedMethod === 'momo' ? 'Mobile Money' : 'OM'} Account Details
          </h3>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name={selectedMethod === 'momo' ? 'momoNumber' : 'omNumber'}
              value={selectedMethod === 'momo' ? accountDetails.momoNumber : accountDetails.omNumber}
              onChange={handleAccountDetailChange}
              className="w-full p-2 border rounded"
              placeholder="6XX XXX XXX"
            />
          </div>
        </div>
      )}

      {selectedMethod === 'bank' && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-3">Bank Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'bank_accountName', label: 'Account Name', placeholder: 'John Doe' },
              { name: 'bank_accountNumber', label: 'Account Number', placeholder: '1234567890' },
              { name: 'bank_bankName', label: 'Bank Name', placeholder: 'Bank Name' },
              { name: 'bank_branch', label: 'Branch', placeholder: 'Branch Location' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={accountDetails.bankAccount[field.name.split('_')[1] as keyof typeof accountDetails.bankAccount]}
                  onChange={handleAccountDetailChange}
                  className="w-full p-2 border rounded"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};