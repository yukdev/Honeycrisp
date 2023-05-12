export interface Session {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  ownerPaymentAddress: string | null;
  finalized: boolean;
  tax: number;
  taxType: TipType;
  tip: number;
  tipType: TipType;
  subtotal: number;
  bill: number;
  split?: Split[];
  guests?: Guest[];
}

export enum TipType {
  PERCENTAGE = 'PERCENTAGE',
  FLAT = 'FLAT',
}

export interface Split {
  id: string;
  name: string;
  split: number;
  paid: boolean;
}

export interface Guest {
  id: string;
  name: string;
}

export interface DetailedSession {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  ownerPaymentAddress: string | null;
  finalized: boolean;
  tax: number;
  tip: number;
  tipType: TipType;
  subtotal: number;
  bill: number;
  split: Split[];
  guests: Guest[];
  items: SessionItem[];
  itemsEaten: ItemEaten[];
}

export interface userSession {
  user: {
    name: string;
    email: string;
    id: string;
    isGuest: boolean;
  };
}

export interface SessionItem {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

export interface ItemEaten {
  itemId: string;
  name: string;
  eatenBy: EatenBy[];
}

export interface EatenBy {
  id: string;
  name: string;
}

export interface NewItem {
  name: string;
  price: number;
  quantity: number;
}

export interface NewSessionData {
  name: string;
  tax: number;
  tip: number;
  tipType: TipType;
  items: NewItem[];
}

export interface EditedSessionData {
  name: string;
  tax: number;
  tip: number;
  tipType: TipType;
  items: EditedItem[];
}

export interface EditedItem {
  id: string;
  name: string;
  price: number;
}

export interface NewSession {
  ownerId: string;
  ownerName: string;
  ownerPaymentAddress: string | null;
  name: string;
  items: NewItem[];
  tax: number;
  tip: number;
  tipType: TipType;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface RegisterUser extends LoginUser {
  name: string;
}

export interface GuestUser extends RegisterUser {
  sessionId: string;
  paymentAddress?: string;
}

export interface UpdateUser {
  name: string;
  email: string;
  paymentAddress: string;
  password: string;
  currentPassword: string;
}

export interface EatenItems {
  items: string[];
  userId: string;
  userName: string;
  sessionId: string;
}
