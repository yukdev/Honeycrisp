export interface SessionItem {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  sessionId: string;
}

export interface UsersSession {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  ownerName: string;
  finalized: boolean;
  tax: number;
  tip: number;
  bill: number;
}

export interface ItemEaten {
  itemId: string;
  name: string;
  eatenBy: string[];
}

export interface SessionProps {
  userSession: {
    user: {
      name: string;
      email: string;
      id: string;
      image?: any;
    };
  };
  session: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
    ownerName: string;
    finalized: boolean;
    bill: number;
    tax: number;
    tip: number;
    items: SessionItem[];
    itemsEaten: ItemEaten[];
  };
}
