'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  categoryHindi: string;
  unit: string;
  price: number;
  marketMin: number;
  marketMax: number;
  stock: number;
  image: string | null;
  addedAt: Date | string;
  sold?: number;
  revenue?: number;
}

interface BuyerRequest {
  id: string;
  buyerName: string;
  product: string;
  quantity: number;
  offerPrice: number;
  message: string;
  messageHindi: string;
  timestamp: Date | string;
  status?: 'pending' | 'accepted' | 'declined' | 'countered';
  counterPrice?: number;
  vendorMessage?: string;
}

interface VendorProfile {
  name: string;
  nameEn: string;
  phone: string;
  location: string;
  locationHindi: string;
  operatingHours: string;
  operatingHoursHindi: string;
  paymentMethods: string[];
  paymentMethodsHindi: string[];
  specialties: string[];
  specialtiesHindi: string[];
  verified: boolean;
  rating: number;
  totalOrders: number;
}

interface Analytics {
  totalProducts: number;
  totalRevenue: number;
  totalSold: number;
  activeRequests: number;
  acceptedRequests: number;
  bestSelling: Product[];
  acceptanceRate: string;
}

interface VendorContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'addedAt' | 'sold' | 'revenue'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  buyerRequests: BuyerRequest[];
  respondToRequest: (id: string, action: string, counterPrice?: number, message?: string) => Promise<void>;
  requestHistory: BuyerRequest[];
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  profile: VendorProfile;
  updateProfile: (updates: Partial<VendorProfile>) => Promise<void>;
  analytics: Analytics | null;
  refreshAnalytics: () => Promise<void>;
  notifications: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

export function VendorProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([
    {
      id: '1',
      buyerName: 'Rahul Kumar | राहुल कुमार',
      product: 'Fresh Tomatoes',
      quantity: 5,
      offerPrice: 28,
      message: 'Can you deliver by evening?',
      messageHindi: 'क्या आप शाम तक डिलीवर कर सकते हैं?',
      timestamp: new Date(Date.now() - 300000),
      status: 'pending',
    },
    {
      id: '2',
      buyerName: 'Priya Singh | प्रिया सिंह',
      product: 'Fresh Tomatoes',
      quantity: 10,
      offerPrice: 27,
      message: 'Bulk order, need best price',
      messageHindi: 'थोक ऑर्डर, सबसे अच्छी कीमत चाहिए',
      timestamp: new Date(Date.now() - 600000),
      status: 'pending',
    },
  ]);
  const [requestHistory, setRequestHistory] = useState<BuyerRequest[]>([]);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [profile, setProfile] = useState<VendorProfile>({
    name: 'राम किसान',
    nameEn: 'Ram Kisan',
    phone: '+91 98765 43210',
    location: 'Sector 14 Market',
    locationHindi: 'सेक्टर 14 मार्केट',
    operatingHours: '6:00 AM - 8:00 PM',
    operatingHoursHindi: 'सुबह 6:00 - रात 8:00',
    paymentMethods: ['Cash', 'UPI', 'Card'],
    paymentMethodsHindi: ['नकद', 'UPI', 'कार्ड'],
    specialties: ['Organic Vegetables', 'Farm Fresh'],
    specialtiesHindi: ['जैविक सब्जियां', 'फार्म फ्रेश'],
    verified: true,
    rating: 4.5,
    totalOrders: 1247,
  });
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [notifications, setNotifications] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load products from backend
  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/vendor/products`);
      const data = await response.json();
      if (data.success && data.data.products) {
        setProducts(data.data.products.map((p: Product) => ({
          ...p,
          addedAt: new Date(p.addedAt)
        })));
      }
    } catch (error) {
      console.log('Using local products (backend unavailable)');
      // Fallback to local state if backend is unavailable
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${API_BASE}/vendor/analytics`);
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.log('Analytics unavailable (backend offline)');
      // Set mock analytics when backend unavailable
      setAnalytics({
        totalProducts: products.length,
        totalRevenue: products.reduce((sum, p) => sum + ((p.revenue || 0)), 0),
        totalSold: products.reduce((sum, p) => sum + ((p.sold || 0)), 0),
        activeRequests: buyerRequests.filter(r => !r.status || r.status === 'pending').length,
        acceptedRequests: 0,
        bestSelling: products.slice(0, 3),
        acceptanceRate: '0',
      });
    }
  };

  const addProduct = async (product: Omit<Product, 'id' | 'addedAt' | 'sold' | 'revenue'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      addedAt: new Date(),
      sold: 0,
      revenue: 0,
    };
    
    // Add to local state immediately
    setProducts(prev => [...prev, newProduct]);
    
    // Try to sync with backend
    try {
      const response = await fetch(`${API_BASE}/vendor/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        await fetchAnalytics();
      }
    } catch (error) {
      console.log('Product saved locally (backend sync pending)');
      await fetchAnalytics();
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    // Update local state immediately
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    
    // Try to sync with backend
    try {
      const response = await fetch(`${API_BASE}/vendor/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        await fetchAnalytics();
      }
    } catch (error) {
      console.log('Product updated locally (backend sync pending)');
      await fetchAnalytics();
    }
  };

  const removeProduct = async (id: string) => {
    // Remove from local state immediately
    setProducts(prev => prev.filter(p => p.id !== id));
    
    // Try to sync with backend
    try {
      const response = await fetch(`${API_BASE}/vendor/products/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        await fetchProducts();
        await fetchAnalytics();
      }
    } catch (error) {
      console.log('Product removed locally (backend sync pending)');
      await fetchAnalytics();
    }
  };

  const respondToRequest = async (id: string, action: string, counterPrice?: number, message?: string) => {
    try {
      const response = await fetch(`${API_BASE}/vendor/requests/${id}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, counterPrice, message }),
      });
      const data = await response.json();
      if (data.success) {
        // Move to history
        const request = buyerRequests.find(r => r.id === id);
        if (request) {
          setRequestHistory(prev => [...prev, { ...request, status: action as any, counterPrice, vendorMessage: message }]);
        }
        setBuyerRequests(prev => prev.filter(r => r.id !== id));
        setNotifications(prev => Math.max(0, prev - 1));
        await fetchAnalytics();
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      // Fallback to local state
      const request = buyerRequests.find(r => r.id === id);
      if (request) {
        setRequestHistory(prev => [...prev, { ...request, status: action as any, counterPrice, vendorMessage: message }]);
      }
      setBuyerRequests(prev => prev.filter(r => r.id !== id));
      setNotifications(prev => Math.max(0, prev - 1));
    }
  };

  const updateProfile = async (updates: Partial<VendorProfile>) => {
    try {
      const response = await fetch(`${API_BASE}/vendor/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const data = await response.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, ...updates }));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfile(prev => ({ ...prev, ...updates }));
    }
  };

  const refreshAnalytics = async () => {
    await fetchAnalytics();
  };

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  return (
    <VendorContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        removeProduct,
        buyerRequests,
        respondToRequest,
        requestHistory,
        language,
        toggleLanguage,
        profile,
        updateProfile,
        analytics,
        refreshAnalytics,
        notifications,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </VendorContext.Provider>
  );
}

export function useVendor() {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendor must be used within a VendorProvider');
  }
  return context;
}
