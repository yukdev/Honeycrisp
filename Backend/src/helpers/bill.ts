// import { Item } from '@prisma/client';
// import prisma from '../db';

interface Item {
  id: string;
  quantity: number;
  price: number;
}

export function calculateBill(items: Item[], tax: number, tip: number): number {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const taxAmount = subtotal * (tax / 100);
  const tipAmount = subtotal * (tip / 100);
  const total = subtotal + taxAmount + tipAmount;
  return Number(total.toFixed(2));
}

// export async function calculateSplit(
//   items: Item[],
//   tax: number,
//   tip: number,
// ): Promise<Bill> {
//   const userItems = await prisma.userItem.findMany({
//     where: {
//       itemId: { in: items.map((item) => item.id) },
//     },
//     select: {
//       user: { select: { name: true } },
//       item: { select: { id: true, price: true } },
//     },
//   });

//   const itemSplit = items.reduce(
//     (acc, item) => ({
//       ...acc,
//       [item.id]: userItems.filter((userItem) => userItem.item.id === item.id)
//         .length,
//     }),
//     {} as { [key: string]: number },
//   );

//   const userSubtotals = userItems.reduce((acc, userItem) => {
//     const {
//       user: { name },
//       item: { id, price },
//     } = userItem;
//     const count = itemSplit[id];
//     const total = price / count;
//     acc[name] = (acc[name] ?? 0) + total;
//     return acc;
//   }, {} as { [key: string]: number });

//   const userTotals = Object.entries(userSubtotals).reduce(
//     (acc, [name, subtotal]) => {
//       const total = (subtotal * (1 + (tax + tip) / 100)).toFixed(2);
//       acc[name] = `$${total}`;
//       return acc;
//     },
//     {} as { [key: string]: string },
//   );

//   const total = `$${(
//     items.reduce((acc, item) => acc + item.price, 0) *
//     (1 + (tax + tip) / 100)
//   ).toFixed(2)}`;

//   return {
//     total,
//     userTotals,
//   };
// }
