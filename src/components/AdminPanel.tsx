'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Award, 
  Tag, 
  Phone, 
  MessageCircle, 
  RotateCcw, 
  Sparkles, 
  Calendar, 
  Layers, 
  Search,
  Banknote,
  Truck,
  Package,
  Printer,
  Download,
  ShieldCheck,
  FileText,
  X,
  ExternalLink,
  Lock,
  Unlock,
  KeyRound,
  EyeOff,
  LogOut,
  Users,
  Mail
} from 'lucide-react';
import { Rooster, RoosterCategory, RoosterBadge, CustomerInquiry, RoosterOrder } from '@/types/rooster';
import { useRoosters, useInquiries, useOrders } from '@/lib/roosterStore';
import { getRegisteredCustomers, RegisteredCustomer, useAuth, isBhanuEmail } from '@/lib/authStore';
import { GoogleIcon } from '@/components/GoogleSignInButton';
import { generateWhatsAppLink } from '@/lib/utils';
import { FARM_INFO } from '@/lib/data';
import { isFirebaseConfigured } from '@/lib/firebase';
import { uploadRoosterMediaToFirebase } from '@/lib/firebaseService';

export const AdminPanel: React.FC = () => {
  const { 
    roosters, 
    addRooster, 
    updateRooster, 
    deleteRooster, 
    toggleBadge, 
    resetToDefault 
  } = useRoosters();

  const { inquiries, updateInquiryStatus } = useInquiries();
  const { orders, updateOrderStatus, deleteOrder, acceptOrder, rejectOrder } = useOrders();
  const [customers, setCustomers] = useState<RegisteredCustomer[]>([]);

  const [activeTab, setActiveTab] = useState<'roosters' | 'orders' | 'customers' | 'inquiries' | 'add'>('roosters');
  const [searchFilter, setSearchFilter] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending_approval' | 'confirmed' | 'dispatched' | 'delivered' | 'rejected'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [printingOrder, setPrintingOrder] = useState<RoosterOrder | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<RoosterOrder | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>('Destination address exceeds 20 km live animal delivery radius');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [editingRooster, setEditingRooster] = useState<Rooster | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Owner Authentication Gate (Security Lock)
  const { user, signInWithGoogle, signOut: signOutUser } = useAuth();
  const isOwnerAdmin = Boolean(user?.email && isBhanuEmail(user.email));

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authChecking, setAuthChecking] = useState<boolean>(true);
  const [enteredPin, setEnteredPin] = useState('');
  const [authError, setAuthError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = sessionStorage.getItem('jp_farms_admin_auth');
      if (storedAuth === 'granted' || (user?.email && isBhanuEmail(user.email))) {
        setIsAuthenticated(true);
      }
      setAuthChecking(false);

      setCustomers(getRegisteredCustomers());
      const handleCustomersUpdate = () => {
        setCustomers(getRegisteredCustomers());
      };
      window.addEventListener('customers-updated', handleCustomersUpdate);

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'orders' || tabParam === 'roosters' || tabParam === 'customers' || tabParam === 'inquiries' || tabParam === 'add') {
        setActiveTab(tabParam as any);
      }

      return () => {
        window.removeEventListener('customers-updated', handleCustomersUpdate);
      };
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPin.trim()) return;
    setIsVerifying(true);
    setAuthError('');

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin, email: user?.email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('jp_farms_admin_auth', 'granted');
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError(data.error || 'Access Denied: Incorrect Master PIN. Authorized personnel only.');
        setEnteredPin('');
      }
    } catch {
      setAuthError('Authentication verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jp_farms_admin_auth');
    }
    setIsAuthenticated(false);
    setEnteredPin('');
  };

  // Form State for Adding / Editing Rooster
  const [formData, setFormData] = useState({
    tagId: '',
    name: '',
    breed: 'Pure Aseel (Peela)',
    category: 'aseel-peela' as RoosterCategory,
    price: 12000,
    originalPrice: 15000,
    age: '12 Months',
    weight: '3.6 Kg',
    height: '25 Inches',
    combType: 'Pea Comb',
    colorPattern: 'Golden Yellow & Red with Green Tail',
    temperament: 'Dominant, Alert, Strong Upright Stance',
    diet: 'Sprouted Bajra, Almond paste, Boiled Desi Eggs & Greens',
    vaccinationStatus: 'Fully Vaccinated' as Rooster['vaccinationStatus'],
    vaccines: 'Ranikhet ND-Lasota, Fowl Pox, IBD, Dewormed',
    badge: 'Farm Stud' as RoosterBadge,
    imageUrl1: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    imageUrl2: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rooster-crowing-in-the-morning-42544-large.mp4',
    lineage: 'Direct son of champion line. Heavy bone structure.',
    healthWarranty: '100% Certified Disease-Free & Verified Heritage Bloodline.',
    description: 'Prime breeding stud with excellent plumage and powerful upright posture.',
    featured: true,
  });

  const handleEditClick = (rooster: Rooster) => {
    setEditingRooster(rooster);
    setFormData({
      tagId: rooster.tagId,
      name: rooster.name,
      breed: rooster.breed,
      category: rooster.category,
      price: rooster.price || 9500,
      originalPrice: rooster.originalPrice || 12000,
      age: rooster.age,
      weight: rooster.weight,
      height: rooster.height,
      combType: rooster.combType,
      colorPattern: rooster.colorPattern,
      temperament: rooster.temperament,
      diet: rooster.diet,
      vaccinationStatus: rooster.vaccinationStatus,
      vaccines: rooster.vaccines.join(', '),
      badge: rooster.badge,
      imageUrl1: rooster.images[0] || '',
      imageUrl2: rooster.images[1] || '',
      videoUrl: rooster.videoUrl || '',
      lineage: rooster.lineage,
      healthWarranty: rooster.healthWarranty,
      description: rooster.description,
      featured: rooster.featured,
    });
    setActiveTab('add');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl1' | 'imageUrl2' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const localPreviewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, [field]: localPreviewUrl }));
    setUploadingField(field);
    setUploadProgress(10);

    try {
      if (isFirebaseConfigured) {
        // Upload directly to Firebase Storage bucket!
        const folder = field === 'videoUrl' ? 'rooster-videos' : 'rooster-photos';
        const downloadUrl = await uploadRoosterMediaToFirebase(file, folder, (percent) => {
          setUploadProgress(percent);
        });
        setFormData(prev => ({ ...prev, [field]: downloadUrl }));
      } else {
        // Upload via local API
        const uploadData = new FormData();
        uploadData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormData(prev => ({ ...prev, [field]: data.url }));
        }
      }
    } catch (err: any) {
      console.warn('Upload fallback to local URL:', err);
    } finally {
      setUploadingField(null);
      setUploadProgress(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const images = [formData.imageUrl1, formData.imageUrl2].filter(Boolean);
    const vaccinesArray = formData.vaccines.split(',').map(s => s.trim()).filter(Boolean);

    if (editingRooster) {
      updateRooster(editingRooster.id, {
        tagId: formData.tagId,
        name: formData.name,
        breed: formData.breed,
        category: formData.category,
        price: Number(formData.price) || 9500,
        originalPrice: Number(formData.originalPrice) || 12000,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        combType: formData.combType,
        colorPattern: formData.colorPattern,
        temperament: formData.temperament,
        diet: formData.diet,
        vaccinationStatus: formData.vaccinationStatus,
        vaccines: vaccinesArray,
        badge: formData.badge,
        images: images.length > 0 ? images : editingRooster.images,
        videoUrl: formData.videoUrl,
        lineage: formData.lineage,
        healthWarranty: formData.healthWarranty,
        description: formData.description,
        featured: formData.featured,
      });
      alert(`Rooster ${formData.tagId} updated successfully!`);
    } else {
      addRooster({
        tagId: formData.tagId || `JP-AS-${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        breed: formData.breed,
        category: formData.category,
        price: Number(formData.price) || 9500,
        originalPrice: Number(formData.originalPrice) || 12000,
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        combType: formData.combType,
        colorPattern: formData.colorPattern,
        temperament: formData.temperament,
        diet: formData.diet,
        vaccinationStatus: formData.vaccinationStatus,
        vaccines: vaccinesArray,
        badge: formData.badge,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80'],
        videoUrl: formData.videoUrl,
        lineage: formData.lineage,
        healthWarranty: formData.healthWarranty,
        description: formData.description,
        featured: formData.featured,
      });
      alert('New rooster added to farm showcase catalogue successfully!');
    }

    setEditingRooster(null);
    setActiveTab('roosters');
  };

  // Metrics
  const totalRoosters = roosters.length;
  const championCount = roosters.filter(r => r.badge === 'Champion Line').length;
  const videoCount = roosters.filter(r => !!r.videoUrl).length;
  const totalInquiries = inquiries.length;

  // Order Metrics
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_approval').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'confirmed').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'dispatched').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const rejectedOrdersCount = orders.filter((o) => o.status === 'rejected').length;
  const totalRevenue = orders.filter((o) => o.status !== 'rejected').reduce((sum, o) => sum + o.price, 0);

  const filteredRoosters = roosters.filter(r => 
    r.tagId.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.breed.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
      return false;
    }
    if (!orderSearchQuery.trim()) return true;

    const q = orderSearchQuery.toLowerCase();
    const idMatch = order.id.toLowerCase().includes(q);
    const nameMatch = order.customerName.toLowerCase().includes(q);
    const phoneMatch = order.phoneNumber.includes(q);
    const cityMatch = (order.city || '').toLowerCase().includes(q);
    const birdMatch = (order.roosterName || '').toLowerCase().includes(q) || (order.roosterTag || '').toLowerCase().includes(q);
    const itemMatch = order.items?.some((i) => 
      i.roosterName.toLowerCase().includes(q) || 
      i.roosterTag.toLowerCase().includes(q) ||
      i.roosterBreed.toLowerCase().includes(q)
    );

    return idMatch || nameMatch || phoneMatch || cityMatch || birdMatch || itemMatch;
  });

  const handleExportOrdersCSV = () => {
    if (orders.length === 0) {
      alert('No orders to export.');
      return;
    }
    const headers = [
      'Order ID',
      'Date',
      'Status',
      'Customer Name',
      'Phone',
      'Delivery Type',
      'Address',
      'City',
      'State',
      'Pincode',
      'Payment Method',
      'Total Amount (INR)',
      'Birds Ordered',
      'Notes',
    ];
    const rows = orders.map((o) => {
      const birdsList = o.items && o.items.length > 0
        ? o.items.map((i) => `${i.roosterName} (#${i.roosterTag}) x${i.quantity}`).join('; ')
        : `${o.roosterName} (#${o.roosterTag})`;
      return [
        `"${o.id}"`,
        `"${o.orderDate}"`,
        `"${o.status}"`,
        `"${o.customerName.replace(/"/g, '""')}"`,
        `"${o.phoneNumber}"`,
        `"${o.deliveryType}"`,
        `"${(o.deliveryAddress || '').replace(/"/g, '""')}"`,
        `"${o.city || ''}"`,
        `"${o.state || ''}"`,
        `"${o.pincode || ''}"`,
        `"${o.paymentMethod}"`,
        `"${o.price}"`,
        `"${birdsList.replace(/"/g, '""')}"`,
        `"${(o.notes || '').replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `jp_farms_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If verifying authentication on first mount
  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // RESTRICTED ACCESS SCREEN (If user is not authenticated)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-stone-900/95 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-500" />
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              JP Farms • Owner Access Only
            </h2>
            <p className="text-xs text-stone-400">
              Restricted administrative portal. Verified owner authorization required to view orders, revenue, and customer dispatches.
            </p>
          </div>

          {/* Owner Google Account Quick Unlock */}
          {user && isOwnerAdmin ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Owner Google Account ({user.email})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('jp_farms_admin_auth', 'granted');
                  setIsAuthenticated(true);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer flex items-center justify-center space-x-2"
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock as Owner ({user.displayName || 'Bhanu'})</span>
              </button>
            </div>
          ) : user && !isOwnerAdmin ? (
            <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-3.5 text-center space-y-2">
              <p className="text-xs text-rose-300 font-bold">Access Restricted</p>
              <p className="text-[11px] text-rose-400">
                You are currently signed in as <strong>{user.email}</strong>, which does not have estate administrator privileges.
              </p>
              <button
                type="button"
                onClick={() => signOutUser()}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold cursor-pointer"
              >
                Sign out & switch account
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full bg-stone-800 hover:bg-stone-750 text-white font-bold py-3 rounded-xl text-xs transition border border-stone-700 flex items-center justify-center space-x-2 shadow-xs cursor-pointer active:scale-95"
              >
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span>Sign in with Owner Google Account</span>
              </button>
              <div className="flex items-center space-x-2 my-2 text-stone-600 text-[10px] uppercase font-bold tracking-wider">
                <div className="flex-1 h-px bg-stone-800" />
                <span>or enter master pin</span>
                <div className="flex-1 h-px bg-stone-800" />
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-400">
                Master Security PIN
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="Enter Master PIN"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-stone-950 border border-stone-700 rounded-xl text-sm font-mono tracking-widest text-amber-400 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/10 transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Unlock className="w-4 h-4" />
              <span>{isVerifying ? 'Verifying PIN...' : 'Unlock Admin Portal'}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-stone-800 text-center">
            <Link
              href="/"
              className="text-xs text-stone-400 hover:text-amber-400 font-semibold transition inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Showcase</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center space-x-3">
              <Link 
                href="/" 
                className="flex items-center space-x-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Public Site</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition bg-red-950/40 hover:bg-red-950/70 px-3 py-1.5 rounded-lg border border-red-900/60"
                title="Lock portal and sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Lock & Sign Out</span>
              </button>

              <div className="hidden sm:block pl-3 border-l border-stone-700">
                <h1 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <span>JP Farms • Owner Control Panel</span>
                  <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.5 rounded">
                    Admin
                  </span>
                </h1>
                <p className="text-[11px] text-stone-400">
                  Manage roosters, live crate customer orders, and visitor requests
                </p>
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                setEditingRooster(null);
                setFormData({
                  tagId: `JP-AS-${Math.floor(100 + Math.random() * 900)}`,
                  name: '',
                  breed: 'Pure Aseel (Peela)',
                  category: 'aseel-peela',
                  price: 12000,
                  originalPrice: 15000,
                  age: '12 Months',
                  weight: '3.6 Kg',
                  height: '25 Inches',
                  combType: 'Pea Comb',
                  colorPattern: 'Golden Yellow & Red with Green Tail',
                  temperament: 'Dominant, Alert, Strong Upright Stance',
                  diet: 'Sprouted Bajra, Almond paste, Boiled Desi Eggs & Greens',
                  vaccinationStatus: 'Fully Vaccinated',
                  vaccines: 'Ranikhet ND-Lasota, Fowl Pox, IBD, Dewormed',
                  badge: 'Farm Stud',
                  imageUrl1: '',
                  imageUrl2: '',
                  videoUrl: '',
                  lineage: 'Direct son of champion line. Heavy bone structure.',
                  healthWarranty: '100% Certified Disease-Free & Verified Heritage Bloodline.',
                  description: 'Prime breeding stud with excellent plumage and powerful posture.',
                  featured: true,
                });
                setActiveTab('add');
              }}
              className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Rooster</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-3 border-b border-stone-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('roosters')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'roosters'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Documented Roosters ({totalRoosters})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
            {orders.some(o => o.status === 'confirmed') && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Registered Users ({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'inquiries'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Farm Visit Requests ({totalInquiries})</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'add'
                ? 'bg-stone-900 text-amber-400 shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingRooster ? 'Edit Rooster' : 'New Rooster Profile'}</span>
          </button>
        </div>

        {/* Analytics Top Cards */}
        {activeTab === 'orders' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Gross Revenue</p>
              <p className="text-3xl font-black text-emerald-700 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-stone-400 mt-1">Total value of all placed orders</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Awaiting Approval</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-3xl font-black text-amber-500">{pendingOrdersCount}</p>
                {pendingOrdersCount > 0 && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                )}
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Requires accept or reject decision</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">In-Transit Crates</p>
              <p className="text-3xl font-black text-sky-600 mt-1">{dispatchedOrdersCount}</p>
              <p className="text-[11px] text-stone-400 mt-1">En route to customers</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Delivered & Closed</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{deliveredOrdersCount}</p>
              <p className="text-[11px] text-stone-400 mt-1">Completed bio-secure handoffs</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Documented Birds</p>
              <p className="text-3xl font-black text-stone-900 mt-1">{totalRoosters}</p>
              <p className="text-[11px] text-stone-400 mt-1">Live showcase entries</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Champion Strains</p>
              <p className="text-3xl font-black text-amber-600 mt-1">{championCount}</p>
              <p className="text-[11px] text-stone-400 mt-1">Direct pedigree lines</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">HD Video Reels</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{videoCount}</p>
              <p className="text-[11px] text-stone-400 mt-1">Available on Rooster TV</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase">Visitor Requests</p>
              <p className="text-3xl font-black text-stone-900 mt-1">{totalInquiries}</p>
              <p className="text-[11px] text-stone-400 mt-1">Received via website</p>
            </div>
          </div>
        )}

        {/* TAB 1: ROOSTERS INVENTORY */}
        {activeTab === 'roosters' && (
          <div className="space-y-6">
            
            {/* Search & Actions Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by Tag ID, Name or Breed..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (confirm('Reset roosters catalog to original default farm records?')) {
                      resetToDefault();
                    }
                  }}
                  className="text-xs text-stone-500 hover:text-stone-800 flex items-center space-x-1 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200"
                  title="Restore original demo birds"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo Data</span>
                </button>
              </div>
            </div>

            {/* Roosters Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Rooster</th>
                      <th className="py-3.5 px-4">Tag ID</th>
                      <th className="py-3.5 px-4">Breed & Category</th>
                      <th className="py-3.5 px-4">Weight / Age</th>
                      <th className="py-3.5 px-4">Exhibition Badge</th>
                      <th className="py-3.5 px-4">Media</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {filteredRoosters.map((rooster) => (
                      <tr key={rooster.id} className="hover:bg-stone-50/80 transition">
                        
                        {/* Rooster Photo & Name */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=200&q=80'}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-stone-900 text-sm">{rooster.name}</p>
                              <p className="text-[11px] text-stone-500">{rooster.combType}</p>
                            </div>
                          </div>
                        </td>

                        {/* Tag ID */}
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold bg-stone-100 text-stone-800 px-2.5 py-1 rounded border border-stone-200">
                            {rooster.tagId}
                          </span>
                        </td>

                        {/* Breed */}
                        <td className="py-3 px-4">
                          <p className="font-semibold text-stone-800">{rooster.breed}</p>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-mono">
                            {rooster.category}
                          </span>
                        </td>

                        {/* Weight & Age */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-stone-900">{rooster.weight}</p>
                          <p className="text-stone-500">{rooster.age}</p>
                        </td>

                        {/* Badge Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={rooster.badge}
                            onChange={(e) => toggleBadge(rooster.id, e.target.value as RoosterBadge)}
                            className="font-bold text-[11px] rounded-lg px-2.5 py-1 bg-stone-50 border border-stone-300 text-stone-800"
                          >
                            <option value="Champion Line">👑 Champion Line</option>
                            <option value="Farm Stud">⭐ Farm Stud</option>
                            <option value="Heritage Pure">🌿 Heritage Pure</option>
                            <option value="Breeding Flock">🌾 Breeding Flock</option>
                            <option value="Young Star">✨ Young Star</option>
                          </select>
                        </td>

                        {/* Media indicators */}
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium flex items-center">
                              <ImageIcon className="w-3 h-3 mr-1" />
                              {rooster.images.length}
                            </span>
                            {rooster.videoUrl && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold flex items-center">
                                <Video className="w-3 h-3 mr-1" />
                                Video
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Edit & Delete Action Buttons */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEditClick(rooster)}
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition"
                              title="Edit Rooster"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove rooster ${rooster.tagId}?`)) {
                                  deleteRooster(rooster.id);
                                }
                              }}
                              className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete Rooster"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE CUSTOMER ORDERS (Amazon/Flipkart Style Command Center) */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Header & Filter Controls */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-lg flex items-center space-x-2">
                    <Banknote className="w-5 h-5 text-amber-600" />
                    <span>Customer Orders & Live Crate Dispatches</span>
                    <span className="bg-amber-100 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-300">
                      {orders.length} Placed
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Real-time orders placed via website cart & Buy Now. Verify buyers, print crate transit passes, and dispatch live climate crates.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleExportOrdersCSV}
                    className="inline-flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-3.5 py-2 rounded-xl text-xs transition"
                    title="Export all orders to CSV for logistics"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-600" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Search & Status Filter Pills */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by Order ID, Name, Phone, City, Breed or Tag..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
                  />
                  {orderSearchQuery && (
                    <button
                      onClick={() => setOrderSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Status Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === 'all'
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    All ({orders.length})
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('pending_approval')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                      orderStatusFilter === 'pending_approval'
                        ? 'bg-amber-500 text-stone-950 font-black shadow-xs ring-2 ring-amber-300'
                        : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full bg-amber-500 ${pendingOrdersCount > 0 ? 'animate-ping' : ''}`}></span>
                    <span>Pending Review ({pendingOrdersCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('confirmed')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                      orderStatusFilter === 'confirmed'
                        ? 'bg-emerald-600 text-white font-black shadow-xs'
                        : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed ({confirmedOrdersCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('dispatched')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                      orderStatusFilter === 'dispatched'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-sky-50 text-sky-900 hover:bg-sky-100 border border-sky-200'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>In Transit ({dispatchedOrdersCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('delivered')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                      orderStatusFilter === 'delivered'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-teal-50 text-teal-900 hover:bg-teal-100 border border-teal-200'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Delivered ({deliveredOrdersCount})</span>
                  </button>

                  <button
                    onClick={() => setOrderStatusFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap ${
                      orderStatusFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-900 hover:bg-rose-100 border border-rose-200'
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Rejected ({rejectedOrdersCount})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <Package className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-800 text-base">No orders found</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {orderSearchQuery
                    ? `No orders matching "${orderSearchQuery}". Try clearing search filters.`
                    : `No orders in "${orderStatusFilter}" status at this moment.`}
                </p>
                {(orderSearchQuery || orderStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setOrderSearchQuery('');
                      setOrderStatusFilter('all');
                    }}
                    className="text-xs font-bold text-amber-700 hover:underline pt-2 inline-block"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const birdsListFormatted = order.items && order.items.length > 0
                    ? order.items.map((i) => `• *${i.roosterName}* (TAG: #${i.roosterTag}) - ₹${i.price.toLocaleString('en-IN')} x ${i.quantity}`).join('\n')
                    : `• *${order.roosterName}* (TAG: #${order.roosterTag}) - ₹${order.price.toLocaleString('en-IN')}`;

                  const dispatchWhatsAppUrl = generateWhatsAppLink({
                    phone: order.phoneNumber,
                    customMessage: `🐓 *JP FARMS • LIVE CRATE DISPATCH NOTICE*

Dear *${order.customerName}*,
Your order *#${order.id}* has been prepared and certified for dispatch!

📦 *Consigned Roosters:*
${birdsListFormatted}

🚚 *Transit Mode:* ${order.deliveryType === 'doorstep_live_crate' ? 'Climate-Controlled Live Animal Crate' : 'Farm Gate Pickup'}
📍 *Delivery Destination:* ${order.deliveryAddress}, ${order.city}, ${order.state} - ${order.pincode}
💰 *Total Payable:* ₹${order.price.toLocaleString('en-IN')} (${order.paymentMethod.toUpperCase()})

🩺 *Veterinary Status:* Avian Health Exam Passed • Ranikhet/ND & Fowl Pox Certified

Our live transport driver will call you 2 hours prior to arrival. Thank you for choosing JP Farms!`,
                  });

                  return (
                    <div
                      key={order.id}
                      className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-amber-300 transition space-y-4"
                    >
                      {/* Top Bar: Order ID, Date, Amount, Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-stone-900 text-amber-400 tracking-wide shadow-xs">
                            {order.id}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">
                            {order.orderDate}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-stone-100 text-stone-700">
                            {order.deliveryType === 'doorstep_live_crate' ? '🚚 Live Crate' : '🏡 Farm Pickup'}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            order.paymentMethod === 'cod' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-sky-50 text-sky-800 border border-sky-200'
                          }`}>
                            {order.paymentMethod === 'cod' ? '💵 COD' : '📱 UPI Paid'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-3 self-end sm:self-auto">
                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Amount</span>
                            <p className="text-lg font-black text-emerald-700 leading-tight">
                              ₹{order.price.toLocaleString('en-IN')}
                            </p>
                          </div>

                          {order.status === 'delivered' ? (
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs" title="Delivered orders are locked and cannot be edited">
                              <Lock className="w-3.5 h-3.5 text-emerald-700" />
                              <span>🟢 Delivered (Locked)</span>
                            </div>
                          ) : order.status === 'rejected' ? (
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 shadow-xs">
                              <X className="w-3.5 h-3.5 text-rose-700" />
                              <span>🔴 Rejected</span>
                            </div>
                          ) : order.status === 'pending_approval' ? (
                            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-amber-100 text-amber-950 border border-amber-400 shadow-xs ring-2 ring-amber-300/50 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-800" />
                              <span>⏳ Pending Decision</span>
                            </div>
                          ) : (
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                              className={`text-xs font-extrabold rounded-xl px-3 py-1.5 border shadow-xs transition ${
                                order.status === 'confirmed'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-200/50'
                                  : 'bg-sky-50 text-sky-900 border-sky-300 ring-2 ring-sky-200/50'
                              }`}
                            >
                              <option value="confirmed">🟡 Order Confirmed (Accepted)</option>
                              <option value="dispatched">🚚 Dispatched / In Transit</option>
                              <option value="delivered">🟢 Delivered & Complete (Locks Order)</option>
                            </select>
                          )}
                        </div>
                      </div>

                      {/* Birds in this Consignment (Multi-item breakdown) */}
                      {order.items && order.items.length > 0 ? (
                        <div className="bg-stone-50/80 rounded-xl p-3 border border-stone-200 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-stone-700 pb-1 border-b border-stone-200/70">
                            <span className="flex items-center space-x-1.5">
                              <Package className="w-3.5 h-3.5 text-amber-600" />
                              <span>Consigned Heritage Birds ({order.items.length} {order.items.length === 1 ? 'Rooster' : 'Roosters'})</span>
                            </span>
                            <span className="text-stone-500 font-medium">Live Animal Crate Package</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-stone-200 shadow-xs"
                              >
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={item.roosterImage || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=200&q=80'}
                                    alt={item.roosterName}
                                    className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                                  />
                                  <div>
                                    <h5 className="font-bold text-stone-900 text-xs">{item.roosterName}</h5>
                                    <p className="text-[11px] font-mono text-amber-800 font-bold">TAG: #{item.roosterTag}</p>
                                    <p className="text-[10px] text-stone-500">{item.roosterBreed}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs font-bold text-stone-900">₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                                  <p className="text-[11px] font-extrabold text-emerald-700">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
                          <img
                            src={order.roosterImage || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=200&q=80'}
                            alt={order.roosterName}
                            className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div>
                            <span className="font-mono text-xs text-amber-800 font-bold">TAG: #{order.roosterTag}</span>
                            <h5 className="font-bold text-stone-900 text-xs">{order.roosterName}</h5>
                            <p className="text-[11px] text-stone-500">{order.roosterBreed}</p>
                          </div>
                        </div>
                      )}

                      {/* Customer & Delivery Information */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50/60 p-3.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-stone-400">Buyer Contact</span>
                          <p className="font-bold text-stone-900 text-sm mt-0.5">{order.customerName}</p>
                          <a
                            href={`tel:${order.phoneNumber}`}
                            className="text-stone-600 hover:text-amber-700 font-mono font-bold flex items-center space-x-1 mt-0.5"
                          >
                            <Phone className="w-3 h-3 text-stone-400" />
                            <span>{order.phoneNumber}</span>
                          </a>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase font-bold text-stone-400">Destination Address</span>
                          <p className="text-stone-800 leading-snug mt-0.5">
                            {order.deliveryAddress}, {order.city}, {order.state} - {order.pincode}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold text-sky-700">
                            {order.deliveryType === 'doorstep_live_crate' ? '🚚 Climate Crate Doorstep Delivery' : '🏡 Farm Gate Pickup'}
                          </span>
                        </div>

                        <div>
                          <span className="block text-[10px] uppercase font-bold text-stone-400">Payment & Special Notes</span>
                          <p className="font-bold text-stone-900 uppercase mt-0.5">
                            {order.paymentMethod === 'cod' ? '💵 Cash on Delivery (Pay at Crate Unboxing)' : order.paymentMethod === 'upi' ? '📱 Instant UPI / GPay' : '🪙 Advance Token'}
                          </p>
                          {order.notes ? (
                            <p className="text-[11px] text-stone-600 italic mt-1 bg-amber-50/60 p-1.5 rounded border border-amber-200/50">
                              &ldquo;{order.notes}&rdquo;
                            </p>
                          ) : (
                            <p className="text-[11px] text-stone-400 italic mt-1">No special instructions</p>
                          )}
                        </div>
                      </div>

                      {/* Action Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-stone-100">
                        {order.status === 'pending_approval' ? (
                          <div className="flex items-center space-x-2">
                            {/* Accept Order Button */}
                            <button
                              type="button"
                              onClick={() => acceptOrder(order.id)}
                              className="flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-4 rounded-xl text-xs transition active:scale-95 shadow-sm cursor-pointer"
                              title="Accept & Confirm Order (Sends live alert to customer)"
                            >
                              <CheckCircle2 className="w-4 h-4 text-white" />
                              <span>Accept Order</span>
                            </button>

                            {/* Reject Order Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingOrder(order);
                                setSelectedRejectReason('Destination address exceeds 20 km live animal delivery radius');
                                setCustomRejectReason('');
                              }}
                              className="flex items-center justify-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2 px-3.5 rounded-xl text-xs transition active:scale-95 cursor-pointer"
                              title="Reject this order and choose/type reason"
                            >
                              <X className="w-4 h-4 text-rose-600" />
                              <span>Reject Order</span>
                            </button>
                          </div>
                        ) : order.status === 'confirmed' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'dispatched')}
                              className="flex items-center justify-center space-x-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                              title="Dispatch rooster in Climate Crate (notifies customer)"
                            >
                              <Truck className="w-3.5 h-3.5 text-white" />
                              <span>Mark In-Transit (Dispatched)</span>
                            </button>
                            <span className="text-[11px] text-stone-400">Accepted by Admin</span>
                          </div>
                        ) : order.status === 'dispatched' ? (
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="flex items-center justify-center space-x-1.5 bg-teal-700 hover:bg-teal-600 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition shadow-xs cursor-pointer"
                              title="Mark delivered (locks this order permanently)"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                              <span>Mark Delivered & Handed Over</span>
                            </button>
                            <span className="text-[11px] text-sky-600 font-medium">Live GPS Crate Active</span>
                          </div>
                        ) : order.status === 'delivered' ? (
                          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            <Lock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Bio-Secure Handoff Complete • Order Record Locked</span>
                          </div>
                        ) : order.status === 'rejected' ? (
                          <div className="flex items-center space-x-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>
                              Rejected: <strong>{order.rejectionReason || 'Not approved by farm management'}</strong>
                            </span>
                          </div>
                        ) : null}

                        {/* Print Crate Pass */}
                        {order.status !== 'rejected' && (
                          <button
                            type="button"
                            onClick={() => setPrintingOrder(order)}
                            className="flex items-center justify-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 px-3.5 rounded-xl text-xs transition shadow-xs cursor-pointer ml-auto"
                            title="Generate printable bio-secure crate dispatch slip & veterinary certificate"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>Print Crate Pass</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: INQUIRIES & VISITOR REQUESTS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Farm Visit Requests & Enthusiast Inquiries</h3>
                <p className="text-xs text-stone-500">Contact visitors directly on WhatsApp or phone to welcome them to JP Farms.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => {
                const customerWhatsAppUrl = `https://wa.me/${inq.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${inq.customerName}, this is JP Farms regarding your visit request for Rooster #${inq.roosterTag || ''} (${inq.roosterName || ''}).`
                )}`;

                return (
                  <div key={inq.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                    
                    <div className="flex items-start justify-between">
                      <div>
                        {inq.roosterTag && (
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                              {inq.roosterTag}
                            </span>
                            <span className="text-xs font-bold text-stone-900">{inq.roosterName}</span>
                          </div>
                        )}
                        <p className="text-xs text-stone-400 mt-0.5">{inq.createdAt}</p>
                      </div>

                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className="text-[11px] font-bold rounded-lg px-2 py-1 bg-stone-100 border border-stone-200"
                      >
                        <option value="new">New Request</option>
                        <option value="contacted">Contacted / Confirmed</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                      <p><strong className="text-stone-700">Visitor:</strong> {inq.customerName}</p>
                      <p><strong className="text-stone-700">Phone:</strong> {inq.phoneNumber}</p>
                      <p><strong className="text-stone-700">Location:</strong> {inq.cityState}</p>
                      <p className="pt-1 text-stone-600 italic">&ldquo;{inq.message}&rdquo;</p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={customerWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${inq.phoneNumber}`}
                        className="flex items-center justify-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2 px-3 rounded-xl text-xs transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: REGISTERED CUSTOMERS DIRECTORY (Google Sign-In Accounts) */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-stone-900 text-lg flex items-center space-x-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  <span>Registered Customers (Google Sign-In)</span>
                  <span className="bg-amber-100 text-amber-950 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-300">
                    {customers.length} Verified Users
                  </span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Automatically captured customer leads with Google Email & Phone numbers. Reach buyers directly via WhatsApp or phone.
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  onClick={() => {
                    const headers = ['Customer Name', 'Google Email', 'Mobile Phone', 'Joined Date', 'Last Active', 'Total Orders'];
                    const rows = customers.map((c) => {
                      const userOrders = orders.filter(
                        (o) => o.customerName.toLowerCase() === c.name.toLowerCase() || (c.email && o.notes?.includes(c.email))
                      );
                      return [
                        `"${c.name}"`,
                        `"${c.email}"`,
                        `"${c.phone || 'N/A'}"`,
                        `"${c.joinedAt}"`,
                        `"${c.lastLoginAt}"`,
                        userOrders.length,
                      ];
                    });
                    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
                    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `jp_farms_customers_${new Date().toISOString().slice(0, 10)}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="inline-flex items-center space-x-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                  title="Download all customer phone numbers and emails to CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Leads (CSV)</span>
                </button>

                <div className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2 rounded-xl">
                  Google OAuth Active
                </div>
              </div>
            </div>

            {/* Customers Table / Grid */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Google Email</th>
                      <th className="py-3.5 px-4">Mobile / WhatsApp</th>
                      <th className="py-3.5 px-4">Joined Date</th>
                      <th className="py-3.5 px-4">Last Active</th>
                      <th className="py-3.5 px-4 text-center">Orders Placed</th>
                      <th className="py-3.5 px-4 text-right">Instant Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {customers.map((cust) => {
                      // Match orders by customer name or email
                      const userOrders = orders.filter(
                        (o) => o.customerName.toLowerCase() === cust.name.toLowerCase() || (cust.email && o.notes?.includes(cust.email))
                      );
                      const totalCustomerSpent = userOrders.reduce((sum, o) => sum + o.price, 0);

                      return (
                        <tr key={cust.uid} className="hover:bg-stone-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center space-x-3">
                              <img
                                src={cust.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover border border-stone-200"
                              />
                              <div>
                                <p className="font-bold text-stone-900 text-sm">{cust.name}</p>
                                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold inline-flex items-center space-x-0.5">
                                  <span>✓ Google Verified</span>
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-stone-700">
                            {cust.email}
                          </td>

                          <td className="py-3.5 px-4">
                            {cust.phone ? (
                              <div className="flex items-center space-x-1.5 font-mono font-bold text-stone-900">
                                <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span>{cust.phone}</span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-stone-400 italic">
                                Pending input
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-stone-500">
                            {cust.joinedAt}
                          </td>

                          <td className="py-3.5 px-4 text-stone-500">
                            {cust.lastLoginAt}
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            {userOrders.length > 0 ? (
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full text-xs border border-emerald-200">
                                {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'} (₹{totalCustomerSpent.toLocaleString('en-IN')})
                              </span>
                            ) : (
                              <span className="text-stone-400 font-medium text-[11px]">Browsing / 0 Orders</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right space-x-1.5 whitespace-nowrap">
                            {cust.phone ? (
                              <>
                                <a
                                  href={`https://wa.me/${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${cust.name}! Thank you for registering at JP Farms. How can we assist you with our champion roosters today?`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl font-bold transition text-xs shadow-xs"
                                  title="Chat on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                  <span>WhatsApp</span>
                                </a>

                                <a
                                  href={`tel:${cust.phone.replace(/\s+/g, '')}`}
                                  className="inline-flex items-center space-x-1 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1.5 rounded-xl font-bold transition text-xs"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3.5 h-3.5 text-stone-600" />
                                  <span>Call</span>
                                </a>
                              </>
                            ) : (
                              <a
                                href={`mailto:${cust.email}?subject=Welcome%20to%20JP%20Farms%20Heritage%20Roosters`}
                                className="inline-flex items-center space-x-1 text-stone-600 hover:text-amber-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-xl font-bold transition text-xs"
                              >
                                <Mail className="w-3.5 h-3.5 text-stone-500" />
                                <span>Email</span>
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ADD / EDIT ROOSTER FORM */}
        {activeTab === 'add' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-xl font-extrabold text-stone-900">
                {editingRooster ? `Edit Rooster: ${editingRooster.tagId}` : 'Add New Rooster to Farm Showcase'}
              </h2>
              <p className="text-xs text-stone-500">
                Upload photos, walking video link, physical measurements, and bloodline history.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Tag ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tag ID (Leg Band / Microchip) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. JP-AS-105"
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-mono font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Rooster Name / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sikandar - Pure Peela Aseel"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Row 2: Breed & Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Breed Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Aseel (Peela Bloodline)"
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Category Filter *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RoosterCategory })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="aseel-peela">Pure Aseel (Peela)</option>
                    <option value="aseel-kagar">Aseel (Kagar)</option>
                    <option value="aseel-sindhi">Sindhi Heavy Aseel</option>
                    <option value="kadaknath">Pure Kadaknath</option>
                    <option value="country-desi">Country Desi (Natu Kodi)</option>
                    <option value="breeding-pairs">Breeding Trio / Pair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Exhibition Badge *
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value as RoosterBadge })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 font-bold"
                  >
                    <option value="Champion Line">👑 Champion Line</option>
                    <option value="Farm Stud">⭐ Farm Stud</option>
                    <option value="Heritage Pure">🌿 Heritage Pure</option>
                    <option value="Breeding Flock">🌾 Breeding Flock</option>
                    <option value="Young Star">✨ Young Star</option>
                  </select>
                </div>
              </div>

              {/* Row 2.5: E-Commerce Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Selling Price (₹ INR) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-500">Customer checkout amount (e.g. ₹14,500)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Original / Strikethrough Price (₹ INR)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 18000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-500">Displays discount percentage badge (e.g. 19% OFF)</span>
                </div>
              </div>

              {/* Row 3: Physical Specs (Weight, Age, Height, Comb) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Weight *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 3.8 Kg"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Age *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Months"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Height *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 26 Inches"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Comb Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Pea Comb"
                    value={formData.combType}
                    onChange={(e) => setFormData({ ...formData, combType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Row 4: Color, Temperament, Diet */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Color & Plumage</label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Yellow & Red"
                    value={formData.colorPattern}
                    onChange={(e) => setFormData({ ...formData, colorPattern: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Temperament / Stance</label>
                  <input
                    type="text"
                    placeholder="e.g. Dominant, Alert, Upright"
                    value={formData.temperament}
                    onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Vaccination Status</label>
                  <select
                    value={formData.vaccinationStatus}
                    onChange={(e) => setFormData({ ...formData, vaccinationStatus: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 font-medium"
                  >
                    <option value="Fully Vaccinated">Fully Vaccinated</option>
                    <option value="Core Vaccines Completed">Core Vaccines Completed</option>
                    <option value="Dewormed & Certified">Dewormed & Certified</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Media Uploads (Photos & Walking Video) */}
              <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center space-x-1.5">
                  <Video className="w-4 h-4 text-amber-600" />
                  <span>Media Uploads (Photos & Walking Video)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Primary Photo (URL or File Upload)
                    </label>
                    <input
                      type="text"
                      placeholder="Paste Image URL"
                      value={formData.imageUrl1}
                      onChange={(e) => setFormData({ ...formData, imageUrl1: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 mb-1"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-1 text-[11px] text-amber-700 hover:text-amber-800 cursor-pointer font-medium">
                        <Upload className="w-3 h-3" />
                        <span>{uploadingField === 'imageUrl1' ? `Uploading (${uploadProgress}%)...` : 'Upload Photo File'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          disabled={uploadingField === 'imageUrl1'}
                          onChange={(e) => handleFileUpload(e, 'imageUrl1')} 
                        />
                      </label>
                      {formData.imageUrl1 && (
                        <span className="text-[10px] text-emerald-600 font-semibold">✓ Photo Ready</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Walking / Crowing Video (MP4 URL or File Upload)
                    </label>
                    <input
                      type="text"
                      placeholder="Paste MP4 / Video URL"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 mb-1 font-mono text-[11px]"
                    />
                    <div className="flex items-center justify-between">
                      <label className="flex items-center space-x-1 text-[11px] text-amber-700 hover:text-amber-800 cursor-pointer font-medium">
                        <Upload className="w-3 h-3" />
                        <span>{uploadingField === 'videoUrl' ? `Uploading Video (${uploadProgress}%)...` : 'Upload Video File'}</span>
                        <input 
                          type="file" 
                          accept="video/*" 
                          className="hidden" 
                          disabled={uploadingField === 'videoUrl'}
                          onChange={(e) => handleFileUpload(e, 'videoUrl')} 
                        />
                      </label>
                      {formData.videoUrl && (
                        <span className="text-[10px] text-emerald-600 font-semibold">✓ Video Attached</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 6: Description & Bloodline */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pedigree / Bloodline Lineage Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Direct bloodline of Garuda Champion. High bone density."
                    value={formData.lineage}
                    onChange={(e) => setFormData({ ...formData, lineage: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Description & Stance Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe temperament, crowing frequency, comb formation, gait..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  ></textarea>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRooster(null);
                    setActiveTab('roosters');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition"
                >
                  {editingRooster ? 'Update Rooster Listing' : 'Publish Rooster to Showcase'}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

      {/* PRINTABLE LIVE CRATE SHIPPING PASS & VETERINARY CERTIFICATE MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative border border-stone-300 my-8 space-y-6">
            
            {/* Top Toolbar (Hidden during print) */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                  Live Animal Transit Pass & Veterinary Health Slip
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-4 py-2 rounded-xl text-xs shadow-md transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip / Save PDF</span>
                </button>

                <button
                  onClick={() => setPrintingOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition"
                  title="Close Pass"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Pass Document Content (Printable Area) */}
            <div className="bg-white p-6 rounded-2xl border-2 border-stone-900 space-y-6 font-sans">
              
              {/* Document Header */}
              <div className="flex items-start justify-between border-b-2 border-stone-900 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black tracking-tight text-stone-950">JP FARMS</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-stone-900 text-amber-400">
                      EST. 2016
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-stone-600">Heritage Desi Rooster Conservation & Championship Breeding Estate</p>
                  <p className="text-[11px] text-stone-500">Helpline: +91 1234567890 • info@jpfarmsofficial.com • Andhra Pradesh, India</p>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-emerald-100 text-emerald-950 text-[10px] font-black px-2.5 py-1 rounded border border-emerald-300 uppercase tracking-wider">
                    ✓ BIO-SECURE TRANSIT CLEARED
                  </span>
                  <p className="font-mono text-xs font-black text-stone-900 mt-1">CONSIGNMENT #{printingOrder.id}</p>
                  <p className="text-[10px] text-stone-400">{printingOrder.orderDate}</p>
                </div>
              </div>

              {/* Consignee & Dispatch Routing */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    CONSIGNEE (BUYER) DETAILS
                  </span>
                  <p className="font-black text-stone-950 text-sm mt-0.5">{printingOrder.customerName}</p>
                  <p className="font-mono font-bold text-stone-700 mt-0.5">{printingOrder.phoneNumber}</p>
                  <p className="text-stone-800 mt-1 leading-snug">
                    {printingOrder.deliveryAddress}, {printingOrder.city}, {printingOrder.state} - {printingOrder.pincode}
                  </p>
                </div>

                <div>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-400">
                    DISPATCH & PAYMENT MANIFEST
                  </span>
                  <p className="font-bold text-stone-900 mt-0.5">
                    Mode: {printingOrder.deliveryType === 'doorstep_live_crate' ? '🚚 Climate-Controlled Live Animal Crate' : '🏡 Farm Gate Pickup'}
                  </p>
                  <p className="font-bold text-stone-900 mt-0.5">
                    Payment Method: {printingOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pay at Unboxing)' : 'Instant UPI / Prepaid'}
                  </p>
                  <p className="font-black text-emerald-800 text-base mt-1">
                    Total Amount: ₹{printingOrder.price.toLocaleString('en-IN')}
                  </p>
                  {printingOrder.notes && (
                    <p className="text-[11px] text-stone-600 italic mt-0.5">Note: &ldquo;{printingOrder.notes}&rdquo;</p>
                  )}
                </div>
              </div>

              {/* Consigned Birds Table */}
              <div className="space-y-2">
                <span className="block text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                  CONSIGNED BIRDS INVENTORY
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border border-stone-200 rounded-xl overflow-hidden min-w-[500px]">
                    <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Tag ID</th>
                        <th className="py-2 px-3">Rooster Name</th>
                        <th className="py-2 px-3">Heritage Breed</th>
                        <th className="py-2 px-3 text-center">Qty</th>
                        <th className="py-2 px-3 text-right">Price</th>
                        <th className="py-2 px-3 text-right">Avian Health Exam</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {printingOrder.items && printingOrder.items.length > 0 ? (
                        printingOrder.items.map((item, idx) => (
                          <tr key={idx} className="bg-white">
                            <td className="py-2 px-3 font-mono font-bold text-amber-800">#{item.roosterTag}</td>
                            <td className="py-2 px-3 font-bold text-stone-900">{item.roosterName}</td>
                            <td className="py-2 px-3 text-stone-600">{item.roosterBreed}</td>
                            <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                            <td className="py-2 px-3 text-right font-bold text-stone-900">₹{(item.price * item.quantity).toLocaleString('en-IN')}</td>
                            <td className="py-2 px-3 text-right text-emerald-700 font-extrabold text-[11px]">✓ PASSED (Active)</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white">
                          <td className="py-2 px-3 font-mono font-bold text-amber-800">#{printingOrder.roosterTag}</td>
                          <td className="py-2 px-3 font-bold text-stone-900">{printingOrder.roosterName}</td>
                          <td className="py-2 px-3 text-stone-600">{printingOrder.roosterBreed}</td>
                          <td className="py-2 px-3 text-center font-bold">1</td>
                          <td className="py-2 px-3 text-right font-bold text-stone-900">₹{printingOrder.price.toLocaleString('en-IN')}</td>
                          <td className="py-2 px-3 text-right text-emerald-700 font-extrabold text-[11px]">✓ PASSED (Active)</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Veterinary Clearance Box */}
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>VETERINARY HEALTH & BIO-SECURITY CLEARANCE</span>
                </div>
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  The roosters documented in this consignment have undergone physical examination prior to boxing. Vaccinated against <strong>Ranikhet (ND-Lasota)</strong>, <strong>Fowl Pox</strong>, and <strong>Infectious Bursal Disease (IBD)</strong> with verified deworming schedule. Certified 100% free from communicable avian diseases.
                </p>
              </div>

              {/* Live Animal Transport Instructions */}
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs space-y-1">
                <p className="font-extrabold text-amber-950 uppercase tracking-wide flex items-center space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>CRITICAL LIVE BIRD TRANSIT PROTOCOL</span>
                </p>
                <ul className="text-[10px] text-amber-900 list-disc list-inside space-y-0.5 font-medium">
                  <li>Keep crate upright and well-ventilated at all times. Do not cover air vents.</li>
                  <li>Do not stack heavy items or cargo on top of this live bird carrier.</li>
                  <li>Store in shaded vehicle compartment between 20°C to 30°C. Protect from rain and direct midday sun.</li>
                  <li>Seed and water sponge trays are affixed inside. Handle with care.</li>
                </ul>
              </div>

              {/* Signature Block */}
              <div className="grid grid-cols-2 gap-8 pt-4 border-t border-stone-200 text-xs">
                <div>
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Consignment Inspector</p>
                  <p className="font-bold text-stone-900 mt-6 pt-1 border-t border-stone-300">JP Farms Logistics Officer</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-stone-400 uppercase font-bold">Veterinary Clearance Officer</p>
                  <p className="font-bold text-stone-900 mt-6 pt-1 border-t border-stone-300">Certified Avian Specialist</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* REJECT ORDER WITH DOCUMENTED REASON MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-rose-200 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <X className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-stone-900 text-base">Reject Customer Order</h3>
                  <p className="text-xs text-stone-500 font-mono">Order #{rejectingOrder.id} • {rejectingOrder.customerName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Order Brief Summary */}
            <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200 text-xs space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Consigned Bird:</span>
                <span className="font-bold text-stone-900">{rejectingOrder.roosterName}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Destination:</span>
                <span className="font-medium text-stone-900">{rejectingOrder.city}, {rejectingOrder.state}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Payable Amount:</span>
                <span className="font-bold text-emerald-700">₹{rejectingOrder.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Select Rejection Reason */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
                Select Reason for Rejection <span className="text-rose-500">*</span>
              </label>

              <div className="space-y-2">
                {[
                  'Destination address exceeds 20 km live animal delivery radius',
                  'Selected rooster is currently undergoing 14-day avian quarantine',
                  'Customer requested cancellation or duplicate order placed',
                  'Customer unreachable for doorstep bio-secure delivery confirmation',
                  'Other (specify custom reason below)',
                ].map((reason) => (
                  <label
                    key={reason}
                    className={`flex items-start space-x-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition ${
                      selectedRejectReason === reason
                        ? 'bg-rose-50/80 border-rose-300 text-rose-950 font-bold ring-1 ring-rose-300'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      value={reason}
                      checked={selectedRejectReason === reason}
                      onChange={() => setSelectedRejectReason(reason)}
                      className="mt-0.5 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              {selectedRejectReason === 'Other (specify custom reason below)' && (
                <div className="pt-2">
                  <textarea
                    rows={3}
                    placeholder="Type the specific reason why this order cannot be fulfilled..."
                    value={customRejectReason}
                    onChange={(e) => setCustomRejectReason(e.target.value)}
                    className="w-full p-3 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const effectiveReason =
                    selectedRejectReason === 'Other (specify custom reason below)'
                      ? customRejectReason.trim() || 'Order could not be approved by farm management.'
                      : selectedRejectReason;
                  rejectOrder(rejectingOrder.id, effectiveReason);
                  setRejectingOrder(null);
                }}
                className="px-5 py-2.5 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition active:scale-95 shadow-md shadow-rose-600/20"
              >
                Confirm Rejection & Notify Buyer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
