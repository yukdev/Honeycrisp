import { BillItem, Session } from '@/lib/types';
import { TipType } from '@prisma/client';

export function calculateBill(
  items: BillItem[],
  tax: number,
  tip: number,
  tipType: TipType,
): {
  subtotal: number;
  bill: number;
} {
  const subtotal = items.reduce((acc, item) => acc + item.price, 0);
  const taxAmount = subtotal * (tax / 100);
  const tipAmount =
    tipType === TipType.PERCENTAGE ? subtotal * (tip / 100) : tip;
  const total = subtotal + taxAmount + tipAmount;
  return {
    subtotal: Number(subtotal.toFixed(2)),
    bill: Number(total.toFixed(2)),
  };
}

export function calculateSplit(session: Session): {
  id: string;
  name: string;
  split: number;
}[] {
  const { items, subtotal, tax, tip, tipType, ownerId } = session;
  const taxPercent = tax / 100;
  const tipPercent =
    tipType === TipType.PERCENTAGE ? tip / 100 : tip / subtotal;

  const userBills = items.reduce((acc, item) => {
    const itemCost = item.price / item.userItems.length;

    item.userItems.forEach((userItem) => {
      const { id } = userItem.user;
      acc[id] = (acc[id] || 0) + itemCost;
    });

    return acc;
  }, {} as Record<string, number>);

  const split = Object.entries(userBills).reduce((acc, [userId, subtotal]) => {
    const total = roundToTwoDecimals(subtotal * (1 + taxPercent + tipPercent));
    acc[userId] = total;
    return acc;
  }, {} as Record<string, number>);

  const userMap = new Map<string, string>(
    session.items.flatMap((item) =>
      item.userItems.map((userItem) => [userItem.user.id, userItem.user.name]),
    ),
  );

  return Object.entries(split).map(([id, split]) => ({
    id,
    name: userMap.get(id) || '',
    split,
    paid: id === ownerId,
  }));
}

function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
