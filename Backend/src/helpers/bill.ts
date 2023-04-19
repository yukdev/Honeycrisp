// import { Item } from '@prisma/client';
// import prisma from '../db';

interface Item1 {
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
  bill: number;
  split: JSON | null;
  items: Item[];
}

interface Item {
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

export function calculateBill(
  items: Item1[],
  tax: number,
  tip: number,
): number {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxAmount = subtotal * (tax / 100);
  const tipAmount = subtotal * (tip / 100);
  const total = subtotal + taxAmount + tipAmount;
  return Number(total.toFixed(2));
}

export function calculateSplit(session: Session): Record<string, number> {
  const userBills: Record<string, number> = {};
  const { items, tax, tip } = session;

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
      split[userName] = roundToTwoDecimals(value * (1 + tip / 100 + tax / 100));
    }
  });

  return split;
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
