// src/components/EventBuilder/types.ts
export type FieldType = 'text' | 'number' | 'image'| 'select' | 'radio' | 'checkbox' | 'email' | 'tel' | 'file' | 'conditional';
export type EventType = 'school' | 'wedding' | 'funeral' | 'birthday' | 'business' | 'charity' | 'conference' | 'other';
export type PaymentMethod = 'momo' | 'om' | 'visa';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type EventStatus =  'active' | 'completed' | 'cancelled' | 'locked' | 'paused';
export type PaymentGetMethod = 'wallet' | 'momo' | 'om' | 'bank';

// export interface FormField {
//   accept?: string;
//   id: string;
//   label: string;
//   type: FieldType;
//   required: boolean;
//   readOnly: boolean;
//   defaultValue?: string | number;
//   options?: string[];
//   min?: number;
//   max?: number;
//   fixedValue?: boolean;
//   conditional?: {
//     fieldId: string;
//     values: string[];
//   };
// }

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
  category: EventType;
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

// export interface Schools {
//   id: string;
//   name: string;
//   logo: string;
//   email: string;
//   contact: string;
//   location: string;
// }

// create Event 
export interface SchoolInfo {
  id: string;
  name: string;
  logo: string;
  email?: string;
  contact?: string;
  location?: string;
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: string | number;
  condition?: {
    fieldId: number | string;
    value: string;
  };
  min?: number;
  max?: number;
  fixedValue?: boolean;
  readOnly: boolean;
}

export type ReceiptLayout = 'one' | 'two';
export type Align = 'left' | 'center' | 'right';
export type showDividers = boolean;

export interface EventFormData {
  eventType: EventType;
  schoolId?: string;
  organizerName: string;
  organizerPassword: string;
  eventName: string;
  fields: FormField[];
  paymentMethods: PaymentMethod[];
  formColors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  eventTitle: string;
  eventDescription: string;
  walletType: 'app_wallet' | 'bank_account';
  bankAccountId?: string;
  fundraisingGoal: number;
  deadline: string;
  contributorMessage: string;
  receiptConfig?: {
    includeFields: string[];
    school: {
      name: string;
      link: string;
      contact: string;
      logoUrl: string;
    };
    layout: ReceiptLayout;
    align: Align;
    includeQR: boolean;
    showDividers?: boolean;
    accentColor?: string;
    additionalFields: Record<string, string>;
    sampleData?: Record<string, string>;
  };
  eventCard: {
    image: string;
    title: string;
    description: string;
  };
  condition?: {
    fieldId: number | string;
    value: string;
  };
}

// My events Page 
export interface Events {
  id: string;
  title: string;
  description: string;
  category:EventType
  status:EventStatus
  targetAmount?: number;
  currentAmount: number;
  contributorCount: number;
  createdDate: string;
  defaultValue?: string | number;
  deadline: string;
  duration: number; // in days
  isLocked: boolean;
  progress: number;
  totalTransactions: number;
  avgContribution: number;
  lastActivity: string;
  completionRate: number;
  featuredContributors: string[];
}
export interface FilterEvent{
  
}
export interface EventStats {
  totalRevenue: number;
  conversionRate: number;
  dailyContributions: number[];
  paymentMethodBreakdown: {
    momo: number;
    om: number;
    bank: number;
    wallet: number;
  };
}
