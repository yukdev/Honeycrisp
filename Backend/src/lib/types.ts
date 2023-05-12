import { TipType } from '@prisma/client';

export interface BillItem {
  id?: string;
  name: string;
  price: number;
}

export interface Session {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  ownerName: string;
  finalized: boolean;
  tax: number;
  tip: number;
  tipType: TipType;
  subtotal: number;
  bill: number;
  split: JSON | null;
  guests: JSON | null;
  items: SplitItem[];
}

export interface SplitItem {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  sessionId: string;
  userItems: UserItem[];
}

export interface UserItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  itemId: string;
  user: {
    id: string;
    name: string;
  };
}
