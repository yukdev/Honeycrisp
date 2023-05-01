// import { Item } from '@prisma/client';
// import prisma from '../db';

import { TipType } from '@prisma/client';

interface BillItem {
  id: string;
  quantity: number;
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
  bill: number;
  split: JSON | null;
  items: SplitItem[];
}

interface SplitItem {
  id: string;
  name: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
  sessionId: string | null;
  userItems: UserItem[];
}

interface UserItem {
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

export interface UserSplit {
  id: string;
  name: string;
  split: number;
}

export function calculateBill(
  items: BillItem[],
  tax: number,
  tip: number,
  tipType: TipType,
): number {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxAmount = subtotal * (tax / 100);
  let tipAmount = 0;
  if (tipType === TipType.PERCENTAGE) {
    tipAmount = subtotal * (tip / 100);
  } else {
    tipAmount = tip;
  }
  const total = subtotal + taxAmount + tipAmount;
  return Number(total.toFixed(2));
}

export function calculateSplit(
  session: Session,
): { id: string; name: string; split: number }[] {
  const userBills: Record<string, number> = {};
  const { items, tax, tip, tipType } = session;

  items.forEach((item) => {
    const numEaters = item.userItems.length;
    const itemCost = item.price / numEaters;
    item.userItems.forEach((userItem) => {
      const userId = userItem.user.id;
      const bill = userBills[userId] || 0;
      userBills[userId] = bill + itemCost;
    });
  });

  const split: Record<string, number> = {};
  Object.entries(userBills).forEach(([userId, value]) => {
    const userName = session.items
      .flatMap((item) => item.userItems)
      .find((userItem) => userItem.user.id === userId)?.user.name;
    if (userName) {
      let total = value * (1 + tax / 100);
      if (tipType === TipType.PERCENTAGE) {
        total += total * (tip / 100);
      } else {
        total += tip;
      }
      split[userId] = roundToTwoDecimals(total);
    }
  });

  const userId = session.ownerId;
  return Object.entries(split).map(([id, split]) => ({
    id,
    name:
      session.items
        .flatMap((item) => item.userItems)
        .find((userItem) => userItem.user.id === id)?.user.name || '',
    split,
    paid: id === userId,
  }));
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
