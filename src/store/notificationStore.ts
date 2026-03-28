import { create } from 'zustand';

export interface OrderItem {
  _id: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}

export interface Order {
  _id: string;
  totalAmount: number;
  items: OrderItem[];
  [key: string]: any;
}

interface NotificationState {
  ordersQueue: Order[];
  newOrderCount: number;
  currentOrder: Order | null;

  addOrder: (order: Order) => void;
  dismissCurrentOrder: () => void;
  resetCount: () => void;
  setOrders: (orders: Order[]) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  ordersQueue: [],
  newOrderCount: 0,
  currentOrder: null,

  addOrder: (order) => {
    const { ordersQueue } = get();
    if (ordersQueue.some((o) => o._id === order._id)) return;

    const newQueue = [...ordersQueue, order];
    set({
      ordersQueue: newQueue,
      newOrderCount: get().newOrderCount + 1,
      currentOrder: get().currentOrder ?? newQueue[0],
    });

    // If no current order, auto-show the first
    if (!get().currentOrder && newQueue.length > 0) {
      set({
        currentOrder: newQueue[0],
        ordersQueue: newQueue.slice(1),
      });
    }
  },

  dismissCurrentOrder: () => {
    const { ordersQueue } = get();
    if (ordersQueue.length > 0) {
      set({
        currentOrder: ordersQueue[0],
        ordersQueue: ordersQueue.slice(1),
      });
    } else {
      set({ currentOrder: null });
    }
  },

  resetCount: () => set({ newOrderCount: 0 }),

  setOrders: (orders) => {
    const { ordersQueue, currentOrder } = get();
    const merged = [...ordersQueue];
    orders.forEach((o) => {
      if (!merged.some((e) => e._id === o._id) && o._id !== currentOrder?._id) {
        merged.push(o);
      }
    });

    if (!currentOrder && merged.length > 0) {
      set({
        currentOrder: merged[0],
        ordersQueue: merged.slice(1),
        newOrderCount: get().newOrderCount + orders.length,
      });
    } else {
      set({
        ordersQueue: merged,
        newOrderCount: get().newOrderCount + orders.length,
      });
    }
  },
}));
