// src/components/EventBuilder/types.ts
export type FieldType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'email' | 'tel';
export type PaymentMethod = 'momo' | 'om' | 'bank';
export type PaymentGetMethod = 'wallet' | 'momo' | 'om' | 'bank';
export interface FormField {
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
  subType: string;
  fields: FormField[];
  paymentMethods?: PaymentMethod[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    bgColor: string;
  };
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