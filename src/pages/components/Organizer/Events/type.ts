// src/components/EventBuilder/types.ts
export type FieldType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'email' | 'tel' | 'file';
export type PaymentMethod = 'momo' | 'om' | 'bank';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type PaymentGetMethod = 'wallet' | 'momo' | 'om' | 'bank';

export interface FormField {
  accept?: string;
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  readOnly: boolean;
  defaultValue?: string | number;
  options?: string[];
  min?: number;
  max?: number;
  fixedValue?: boolean;
  conditional?: {
    fieldId: string;
    values: string[];
  };
}

export interface EventConfig {
  id: string;
  title: string;
  description: string;
  category: 'wedding' | 'school';
  subType?: string;
  fields: FormField[];
  paymentMethods?: PaymentMethod[];
  allowImageUpload?: boolean;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
  };
}


export interface Transaction {
  id: string;
  transactionId: string;
  eventId: string;
  eventName: string;
  eventType: string;
  amount: number;
  date: string;
  payerName: string;
  payerEmail?: string;
  payerPhone?: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  customFields: Record<string, any>; // Dynamic fields based on event
  metadata?: {
    fee?: number;
    netAmount?: number;
    processedAt?: string;
  };
}

export interface Event {
  id: string;
  name: string;
  // type: string;
  category: 'wedding' | 'school' | 'funeral' | 'birthday';
  customFields:Array<{
    id: string;
    label: string;
    type: string;
    visible: boolean;
  }>;
}

export interface AccountDetails {
  momoNumber: string;
  omNumber: string;
  bankAccount: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branch: string;
  };
}

export interface WalletSettings {
  freezeDuration: number;
  autoWithdraw: boolean;
}

export interface SchoolInfo {
  name: string;
  location: string;
  contact: string;
}

export interface CustomField {
  name: string;
  value: string;
  required: boolean;
}

export interface ReceiptSettings {
  title: string;
  logo: string | null;
  customFields: CustomField[];
  includeQR: boolean;
  qrData: string;
  schoolInfo: SchoolInfo;
}

export interface ReceiptData {
  amount: string;
  date: string;
  reference: string;
  payer: string;
  details: string;
}

// overview Page 
export interface EventWallet {
  id: string;
  eventName: string;
  category: 'wedding' | 'school' | 'funeral' | 'birthday';
  balance: number;
  targetAmount?: number;
  totalContributions: number;
  lastActivity: string;
  status: 'active' | 'completed' | 'locked' | 'cancelled';
  progress: number;
  contributorCount: number;
}

export interface PlatformStats {
  totalEvents: number;
  activeEvents: number;
  totalRevenue: number;
  monthlyGrowth: number;
  totalUsers: number;
  successRate: number;
  avgContribution: number;
  totalTransactions: number;
}

export interface QuickStats {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
}
