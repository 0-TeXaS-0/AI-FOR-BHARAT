'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface Order {
  id: string;
  vendorName: string;
  vendorNameHindi: string;
  productName: string;
  productNameHindi: string;
  quantity: number;
  price: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'out-for-delivery' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentMethodHindi: string;
  orderDate: Date;
  deliveryDate?: Date;
  address: string;
  addressHindi: string;
  phone: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderDate' | 'status'>) => Promise<boolean>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;
  getVendorOrders: (vendorName: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      vendorName: 'Ram Kisan',
      vendorNameHindi: 'राम किसान',
      productName: 'Fresh Tomatoes',
      productNameHindi: 'ताजा टमाटर',
      quantity: 5,
      price: 30,
      totalAmount: 150,
      status: 'pending',
      paymentMethod: 'Cash on Delivery',
      paymentMethodHindi: 'कैश ऑन डिलीवरी',
      orderDate: new Date(Date.now() - 1800000), // 30 minutes ago
      address: '123 MG Road, Sector 14',
      addressHindi: '123 एमजी रोड, सेक्टर 14',
      phone: '+91 98765 12345',
    },
    {
      id: '2',
      vendorName: 'Ram Kisan',
      vendorNameHindi: 'राम किसान',
      productName: 'Fresh Onions',
      productNameHindi: 'ताजा प्याज',
      quantity: 10,
      price: 25,
      totalAmount: 250,
      status: 'confirmed',
      paymentMethod: 'UPI',
      paymentMethodHindi: 'यूपीआई',
      orderDate: new Date(Date.now() - 3600000), // 1 hour ago
      address: '456 Park Street, Nehru Nagar',
      addressHindi: '456 पार्क स्ट्रीट, नेहरू नगर',
      phone: '+91 98765 67890',
    },
    {
      id: '3',
      vendorName: 'Ram Kisan',
      vendorNameHindi: 'राम किसान',
      productName: 'Fresh Potatoes',
      productNameHindi: 'ताजा आलू',
      quantity: 20,
      price: 20,
      totalAmount: 400,
      status: 'out-for-delivery',
      paymentMethod: 'Cash on Delivery',
      paymentMethodHindi: 'कैश ऑन डिलीवरी',
      orderDate: new Date(Date.now() - 7200000), // 2 hours ago
      address: '789 Gandhi Road, Civil Lines',
      addressHindi: '789 गांधी रोड, सिविल लाइन्स',
      phone: '+91 98765 11111',
    },
    {
      id: '4',
      vendorName: 'Ram Kisan',
      vendorNameHindi: 'राम किसान',
      productName: 'Fresh Carrots',
      productNameHindi: 'ताजा गाजर',
      quantity: 3,
      price: 35,
      totalAmount: 105,
      status: 'delivered',
      paymentMethod: 'Card',
      paymentMethodHindi: 'कार्ड',
      orderDate: new Date(Date.now() - 86400000), // 1 day ago
      deliveryDate: new Date(Date.now() - 3600000),
      address: '321 Station Road, Model Town',
      addressHindi: '321 स्टेशन रोड, मॉडल टाउन',
      phone: '+91 98765 22222',
    },
    {
      id: '5',
      vendorName: 'Ram Kisan',
      vendorNameHindi: 'राम किसान',
      productName: 'Fresh Cucumber',
      productNameHindi: 'ताजा खीरा',
      quantity: 8,
      price: 18,
      totalAmount: 144,
      status: 'pending',
      paymentMethod: 'UPI',
      paymentMethodHindi: 'यूपीआई',
      orderDate: new Date(Date.now() - 900000), // 15 minutes ago
      address: '555 Mall Road, Sadar Bazaar',
      addressHindi: '555 मॉल रोड, सदर बाज़ार',
      phone: '+91 98765 33333',
    },
  ]);

  const addOrder = async (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>): Promise<boolean> => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date(),
      status: 'pending',
    };
    setOrders((prev) => [newOrder, ...prev]);

    // Sync with backend
    try {
      await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      console.log('Order synced with backend');
      return true;
    } catch (error) {
      console.log('Order saved locally (backend sync pending)');
      return true; // Still return true since order is saved locally
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );

    // Sync with backend
    try {
      fetch(`http://localhost:5000/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => console.log('Status updated locally'));
    } catch (error) {
      console.log('Status updated locally (backend sync pending)');
    }
  };

  const getOrderById = (id: string) => {
    return orders.find((order) => order.id === id);
  };

  const getVendorOrders = (vendorName: string) => {
    return orders.filter(
      (order) => order.vendorName === vendorName || order.vendorNameHindi === vendorName
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrderById,
        getVendorOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
}
