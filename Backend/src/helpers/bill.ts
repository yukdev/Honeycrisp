import { BillItem, Session } from '@/lib/types';
import { TipType } from '@prisma/client';

export function calculateBill(
  items: BillItem[],
  tax: number,
  tip: number,
  tipType: TipType,
): number {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const taxAmount = subtotal * (tax / 100);
  const tipAmount =
    tipType === TipType.PERCENTAGE ? subtotal * (tip / 100) : tip;
  const total = subtotal + taxAmount + tipAmount;
  return Number(total.toFixed(2));
}

export function calculateSplit(session: Session): {
  id: string;
  name: string;
  split: number;
}[] {
  const userBills: Record<string, number> = {};
  const { items, bill, tax, tip, tipType, ownerId } = session;

  const taxPercent = tax / 100;
  const tipPercent = tipType === TipType.PERCENTAGE ? tip / 100 : tip / bill;

  items.forEach((item) => {
    const numEaters = item.userItems.length;
    const itemCost = item.price / numEaters;
    item.userItems.forEach((userItem) => {
      const userId = userItem.user.id;
      const currentTotal = userBills[userId] || 0;
      userBills[userId] = currentTotal + itemCost;
    });
  });

  const split: Record<string, number> = {};
  Object.entries(userBills).forEach(([userId, subtotal]) => {
    let total = subtotal * (1 + taxPercent) * (1 + tipPercent);
    split[userId] = roundToTwoDecimals(total);
  });

  return Object.entries(split).map(([id, split]) => ({
    id,
    name:
      session.items
        .flatMap((item) => item.userItems)
        .find((userItem) => userItem.user.id === id)?.user.name || '',
    split,
    paid: id === ownerId,
  }));
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
