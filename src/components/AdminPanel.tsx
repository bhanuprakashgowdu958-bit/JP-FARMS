'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight,
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
  Mail,
  Menu,
  Filter,
  LayoutGrid,
  List,
  Check,
  ChevronRight,
  TrendingUp,
  MapPin,
  Play,
  Share2,
  Folder,
  FolderOpen
} from 'lucide-react';
import { Rooster, RoosterCategory, RoosterBadge, CustomerInquiry, RoosterOrder } from '@/types/rooster';
import { useRoosters, useInquiries, useOrders } from '@/lib/roosterStore';
import { getRegisteredCustomers, RegisteredCustomer, useAuth, isBhanuEmail } from '@/lib/authStore';
import { GoogleIcon } from '@/components/GoogleSignInButton';
import { generateWhatsAppLink } from '@/lib/utils';
import { FARM_INFO, ROOSTER_CATEGORIES_META, BreedCategoryMeta } from '@/lib/data';
import { isFirebaseConfigured, db } from '@/lib/firebase';
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

  // Navigation State
  const [activeTab, setActiveTab] = useState<'roosters' | 'orders' | 'customers' | 'inquiries' | 'add'>('roosters');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [roosterViewMode, setRoosterViewMode] = useState<'categories' | 'table' | 'grid'>('categories');
  const [selectedCategoryFolder, setSelectedCategoryFolder] = useState<Exclude<RoosterCategory, 'all'> | null>(null);

  // Filters & Search
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending_approval' | 'confirmed' | 'dispatched' | 'delivered' | 'rejected'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');

  // Modals & Active Selections
  const [printingOrder, setPrintingOrder] = useState<RoosterOrder | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<RoosterOrder | null>(null);
  const [selectedRejectReason, setSelectedRejectReason] = useState<string>('Destination address exceeds 20 km live animal delivery radius');
  const [customRejectReason, setCustomRejectReason] = useState<string>('');
  const [editingRooster, setEditingRooster] = useState<Rooster | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [previewRoosterModal, setPreviewRoosterModal] = useState<Rooster | null>(null);

  // Owner Authentication Gate
  const { user, signInWithGoogle } = useAuth();
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

      // Verify server session cookie
      fetch('/api/admin-auth')
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAuthenticated(true);
            sessionStorage.setItem('jp_farms_admin_auth', 'granted');
          }
        })
        .catch(() => {})
        .finally(() => setAuthChecking(false));

      const updateAndSyncCustomers = () => {
        const list = getRegisteredCustomers();
        if (user && user.photoURL) {
          const idx = list.findIndex(c => c.uid === user.uid || (user.email && c.email.toLowerCase() === user.email.toLowerCase()));
          if (idx >= 0 && (!list[idx].photoURL || list[idx].photoURL !== user.photoURL)) {
            list[idx] = { ...list[idx], photoURL: user.photoURL };
            localStorage.setItem('jp_farms_registered_users_v1', JSON.stringify(list));
          }
        }
        setCustomers(list);
      };

      updateAndSyncCustomers();
      window.addEventListener('customers-updated', updateAndSyncCustomers);

      // Cloud Firestore Users Sync (pulls real Google photos and registered users across all devices)
      if (isFirebaseConfigured && db) {
        import('firebase/firestore').then(async ({ collection, getDocs }) => {
          try {
            const snap = await getDocs(collection(db, 'users'));
            if (!snap.empty) {
              const currentList = getRegisteredCustomers();
              let changed = false;
              snap.forEach((docSnap: any) => {
                const data = docSnap.data();
                if (data.email) {
                  const emailLower = data.email.toLowerCase().trim();
                  const idx = currentList.findIndex(c => c.email.toLowerCase().trim() === emailLower);
                  if (idx >= 0) {
                    if (data.photoURL && currentList[idx].photoURL !== data.photoURL) {
                      currentList[idx].photoURL = data.photoURL;
                      changed = true;
                    }
                    if (data.displayName && currentList[idx].name !== data.displayName) {
                      currentList[idx].name = data.displayName;
                      changed = true;
                    }
                    if (data.phoneNumber && !currentList[idx].phone) {
                      currentList[idx].phone = data.phoneNumber;
                      changed = true;
                    }
                  } else {
                    currentList.push({
                      uid: docSnap.id,
                      name: data.displayName || 'Google User',
                      email: data.email,
                      phone: data.phoneNumber || '',
                      photoURL: data.photoURL || '',
                      joinedAt: data.createdAt || new Date().toLocaleString(),
                      lastLoginAt: data.lastLoginAt || new Date().toLocaleString(),
                    });
                    changed = true;
                  }
                }
              });
              if (changed) {
                localStorage.setItem('jp_farms_registered_users_v1', JSON.stringify(currentList));
                setCustomers([...currentList]);
              }
            }
          } catch (e) {
            console.warn('Could not fetch cloud users:', e);
          }
        });
      }

      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'orders' || tabParam === 'roosters' || tabParam === 'customers' || tabParam === 'inquiries' || tabParam === 'add') {
        setActiveTab(tabParam as any);
      }

      // Default to grid on small screens for ideal mobile UX
      if (window.innerWidth < 768) {
        setRoosterViewMode('grid');
      }

      return () => {
        window.removeEventListener('customers-updated', updateAndSyncCustomers);
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
        body: JSON.stringify({ pin: enteredPin }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('jp_farms_admin_auth', 'granted');
        if (data.token) {
          sessionStorage.setItem('jp_farms_admin_token', data.token);
        }
        setIsAuthenticated(true);
        setAuthError('');
      } else {
        setAuthError(data.error || 'Access Denied: Incorrect Master Passcode.');
        setEnteredPin('');
      }
    } catch {
      setAuthError('Authentication verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    fetch('/api/admin-auth', { method: 'DELETE' }).catch(() => {});
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jp_farms_admin_auth');
      sessionStorage.removeItem('jp_farms_admin_token');
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
    price: 14500,
    originalPrice: 18000,
    age: '12 Months',
    weight: '3.6 Kg',
    height: '25 Inches',
    combType: 'Pea Comb',
    colorPattern: 'Golden Yellow & Red with Emerald Sheen Tail',
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

  const openAddRoosterForCategory = (catKey: Exclude<RoosterCategory, 'all'>) => {
    const meta = ROOSTER_CATEGORIES_META[catKey];
    const randomTagNum = Math.floor(100 + Math.random() * 900);
    setEditingRooster(null);
    setFormData({
      tagId: `${meta.tagPrefix}${randomTagNum}`,
      name: `${meta.shortName} Specimen`,
      breed: meta.name,
      category: catKey,
      price: catKey === 'breeding-pairs' ? 28000 : catKey === 'aseel-sindhi' ? 22000 : catKey === 'aseel-kagar' ? 16000 : catKey === 'kadaknath' ? 6500 : catKey === 'country-desi' ? 3200 : 14500,
      originalPrice: catKey === 'breeding-pairs' ? 32000 : catKey === 'aseel-sindhi' ? 25000 : catKey === 'aseel-kagar' ? 19000 : catKey === 'kadaknath' ? 8000 : catKey === 'country-desi' ? 4000 : 18000,
      age: '12 Months',
      weight: catKey === 'aseel-sindhi' ? '4.4 Kg' : catKey === 'aseel-kagar' ? '4.1 Kg' : catKey === 'kadaknath' ? '2.4 Kg' : catKey === 'country-desi' ? '2.6 Kg' : '3.8 Kg',
      height: '25 Inches',
      combType: catKey === 'aseel-sindhi' ? 'Cushion Comb' : catKey === 'aseel-kagar' ? 'Walnut Comb' : catKey === 'kadaknath' ? 'Blackened Pea Comb' : catKey === 'country-desi' ? 'Single Serrated Comb' : 'Pea Comb',
      colorPattern: meta.tagline,
      temperament: 'Dominant, Alert, Strong Upright Stance',
      diet: 'Sprouted Bajra, Almond paste, Boiled Desi Eggs & Greens',
      vaccinationStatus: 'Fully Vaccinated',
      vaccines: 'Ranikhet ND-Lasota, Fowl Pox, IBD, Dewormed',
      badge: 'Farm Stud',
      imageUrl1: '',
      imageUrl2: '',
      videoUrl: '',
      lineage: `Pure bloodline maintained under ${meta.name} lineage standards.`,
      healthWarranty: '100% Certified Disease-Free & Verified Heritage Bloodline.',
      description: meta.description,
      featured: true,
    });
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'imageUrl1' | 'imageUrl2' | 'videoUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreviewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, [field]: localPreviewUrl }));
    setUploadingField(field);
    setUploadProgress(15);

    try {
      if (isFirebaseConfigured) {
        const folder = field === 'videoUrl' ? 'rooster-videos' : 'rooster-photos';
        const downloadUrl = await uploadRoosterMediaToFirebase(file, folder, (percent) => {
          setUploadProgress(percent);
        });
        setFormData(prev => ({ ...prev, [field]: downloadUrl }));
      } else {
        const uploadData = new FormData();
        uploadData.append('file', file);
        const uploadHeaders: Record<string, string> = {};
        const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('jp_farms_admin_token') : null;
        if (adminToken) {
          uploadHeaders['x-admin-token'] = adminToken;
        }
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: uploadHeaders,
          body: uploadData,
        });
        const data = await res.json();
        if (data.success && data.url) {
          setFormData(prev => ({ ...prev, [field]: data.url }));
        }
      }
    } catch (err: any) {
      console.warn('Upload fallback to preview:', err);
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
      alert(`Rooster #${formData.tagId} updated successfully!`);
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
      alert('New rooster registered into catalogue successfully!');
    }

    setEditingRooster(null);
    setActiveTab('roosters');
  };

  // Metrics
  const totalRoosters = roosters.length;
  const championCount = roosters.filter(r => r.badge === 'Champion Line').length;
  const farmStudCount = roosters.filter(r => r.badge === 'Farm Stud').length;
  const videoCount = roosters.filter(r => !!r.videoUrl).length;
  const totalInquiries = inquiries.length;
  const pendingInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  // Order Metrics
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_approval').length;
  const confirmedOrdersCount = orders.filter((o) => o.status === 'confirmed').length;
  const dispatchedOrdersCount = orders.filter((o) => o.status === 'dispatched').length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const rejectedOrdersCount = orders.filter((o) => o.status === 'rejected').length;
  const totalRevenue = orders.filter((o) => o.status !== 'rejected').reduce((sum, o) => sum + o.price, 0);

  // Filtered roosters
  const filteredRoosters = roosters.filter(r => {
    if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return r.tagId.toLowerCase().includes(q) ||
      r.name.toLowerCase().includes(q) ||
      r.breed.toLowerCase().includes(q);
  });

  // Filtered orders
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

  // Filtered customers (Purge dummy demo accounts)
  const filteredCustomers = customers
    .filter(
      (c) =>
        c.uid !== 'google-usr-01' &&
        c.uid !== 'google-usr-02' &&
        c.email !== 'kishore.varma.agri@gmail.com' &&
        c.email !== 'anilkumar.breeder@gmail.com' &&
        c.name !== 'Kishore Varma' &&
        c.name !== 'Anil Kumar Reddy'
    )
    .filter(c => {
      if (!customerSearchQuery.trim()) return true;
      const q = customerSearchQuery.toLowerCase();
      return (c.name || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.phone || '').includes(q);
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

  const getBadgeStyle = (badge: Rooster['badge']) => {
    switch (badge) {
      case 'Champion Line':
        return 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-xs border border-amber-300';
      case 'Farm Stud':
        return 'bg-stone-900 text-amber-400 font-bold border border-amber-500/40 shadow-xs';
      case 'Heritage Pure':
        return 'bg-emerald-600 text-white font-bold shadow-xs';
      case 'Breeding Flock':
        return 'bg-blue-600 text-white font-bold shadow-xs';
      case 'Young Star':
        return 'bg-purple-600 text-white font-bold shadow-xs';
      default:
        return 'bg-stone-800 text-stone-200';
    }
  };

  const getOrderStatusBadge = (status: RoosterOrder['status']) => {
    switch (status) {
      case 'pending_approval':
        return { label: 'Pending Approval', style: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'confirmed':
        return { label: 'Confirmed • Ready', style: 'bg-sky-100 text-sky-900 border-sky-300' };
      case 'dispatched':
        return { label: 'In Transit 🚚', style: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 'delivered':
        return { label: 'Delivered ✅', style: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 'rejected':
        return { label: 'Rejected ❌', style: 'bg-rose-100 text-rose-900 border-rose-300' };
    }
  };

  // Auth checking spinner
  if (authChecking) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
          Verifying Owner Credentials...
        </p>
      </div>
    );
  }

  // RESTRICTED ACCESS SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-[#0d1117] to-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#161b22]/95 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 mx-auto shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d1117] rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              JP Farms • Owner Access Only
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Restricted management center. Authorized owner credentials required to view orders, inventory, and customer dispatch details.
            </p>
          </div>

          {/* Quick Google Unlock for Bhanu */}
          {user && isOwnerAdmin ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center space-x-2 text-amber-400 text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Owner Account ({user.email})</span>
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
                <span>Unlock Control Center</span>
              </button>
            </div>
          ) : !user ? (
            <button
              type="button"
              onClick={() => signInWithGoogle()}
              className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2.5 transition active:scale-95 shadow-md"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Owner Sign In with Google</span>
            </button>
          ) : null}

          {/* PIN Form */}
          <form onSubmit={handleLogin} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>Master Passcode</span>
                <span className="text-[10px] text-slate-500 font-mono">Confidential Owner PIN</span>
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  placeholder="Enter 4-6 digit PIN"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value.replace(/\D/g, ''));
                    setAuthError('');
                  }}
                  autoFocus
                  className="w-full pl-10 pr-10 py-3 bg-[#0d1117] border border-slate-700 rounded-xl text-sm font-mono tracking-widest text-amber-400 placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  tabIndex={-1}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
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

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-amber-400 font-semibold transition inline-flex items-center space-x-1"
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col lg:flex-row">
      
      {/* =======================================================================
         1. DESKTOP PERMANENT DARK LUXURY SIDEBAR (Stripe / Shopify Polaris Style)
         ======================================================================= */}
      <aside className="hidden lg:flex w-64 bg-[#0d1117] text-slate-200 border-r border-slate-800/80 flex-col justify-between shrink-0 h-screen fixed top-0 bottom-0 left-0 z-40 overflow-y-auto select-none">
        
        {/* Brand & Estate Status Header */}
        <div>
          <div className="p-5 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0d1117] rounded-[10px] flex items-center justify-center text-lg">
                  🐓
                </div>
              </div>
              <div>
                <h1 className="text-sm font-black text-white tracking-wide flex items-center space-x-1">
                  <span>JP FARMS</span>
                  <span className="text-[9px] bg-amber-500 text-stone-950 font-extrabold px-1.5 py-0.2 rounded">
                    HQ
                  </span>
                </h1>
                <p className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Operations Live</span>
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {/* 1. Roosters Inventory */}
            <button
              onClick={() => setActiveTab('roosters')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'roosters'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Layers className="w-4 h-4" />
                <span>Roosters Catalog</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                activeTab === 'roosters' ? 'bg-stone-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {totalRoosters}
              </span>
            </button>

            {/* 2. Customer Orders */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Package className="w-4 h-4" />
                <span>Customer Orders</span>
              </div>
              {pendingOrdersCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-rose-500 text-white animate-pulse">
                  {pendingOrdersCount} new
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === 'orders' ? 'bg-stone-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>

            {/* 3. Registered Customers */}
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className="w-4 h-4" />
                <span>Customer Hub</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                activeTab === 'customers' ? 'bg-stone-950 text-amber-400' : 'bg-slate-800 text-slate-300'
              }`}>
                {customers.length}
              </span>
            </button>

            {/* 4. Farm Visit Requests */}
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-amber-500 text-stone-950 shadow-md font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4" />
                <span>Visit Requests</span>
              </div>
              {pendingInquiriesCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-amber-500 text-stone-950">
                  {pendingInquiriesCount}
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                  activeTab === 'inquiries' ? 'bg-stone-950 text-amber-400' : 'bg-slate-800 text-slate-300'
                }`}>
                  {totalInquiries}
                </span>
              )}
            </button>

            {/* 5. Add Rooster Profile */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setEditingRooster(null);
                  setActiveTab('add');
                }}
                className={`w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'add'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-extrabold'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>{editingRooster ? 'Edit Rooster Profile' : '+ Add New Rooster'}</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800/80 space-y-2 bg-[#161b22]/50">
          <Link
            href="/"
            className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
          >
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>View Public Store</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 p-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* =======================================================================
         2. MOBILE FIXED APP BAR & SLIDE-OUT DRAWER (< lg devices)
         ======================================================================= */}
      <div className="lg:hidden sticky top-0 z-40 bg-[#0d1117] text-white border-b border-slate-800 shadow-md">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-200 active:scale-95 transition"
              aria-label="Toggle Navigation Drawer"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <span className="font-black text-sm tracking-wide text-white flex items-center space-x-1">
              <span>🐓 JP FARMS</span>
              <span className="text-[9px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.5 rounded">
                Admin
              </span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/"
              className="p-1.5 rounded-lg bg-slate-800 text-sky-400 hover:text-sky-300 text-xs font-bold flex items-center space-x-1"
              title="View Public Store"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-[11px] hidden min-[360px]:inline">Store</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-rose-950/60 text-rose-400 hover:text-rose-300 transition"
              title="Lock Admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick-Tab Strip (Smooth Swipeable Thumb Navigation) */}
        <div className="px-3 py-2 bg-[#161b22] border-t border-slate-800/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('roosters')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'roosters'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <span>🐓 Birds</span>
            <span className="text-[10px] font-mono opacity-80">({totalRoosters})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <span>📦 Orders</span>
            {pendingOrdersCount > 0 ? (
              <span className="text-[9px] font-black bg-rose-500 text-white px-1 rounded-full">
                {pendingOrdersCount}
              </span>
            ) : (
              <span className="text-[10px] font-mono opacity-80">({orders.length})</span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'customers'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <span>👥 Users</span>
            <span className="text-[10px] font-mono opacity-80">({customers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1.5 ${
              activeTab === 'inquiries'
                ? 'bg-amber-500 text-stone-950 shadow-xs'
                : 'bg-slate-800/80 text-slate-300'
            }`}
          >
            <span>💬 Visits</span>
            <span className="text-[10px] font-mono opacity-80">({totalInquiries})</span>
          </button>

          <button
            onClick={() => {
              setEditingRooster(null);
              setActiveTab('add');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition flex items-center space-x-1 ${
              activeTab === 'add'
                ? 'bg-emerald-500 text-white shadow-xs font-black'
                : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Bird</span>
          </button>
        </div>

        {/* Mobile Full Slide-Down Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="p-4 bg-[#0d1117] border-b border-slate-800 space-y-2 animate-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => {
                setActiveTab('roosters');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 text-xs font-bold"
            >
              <span>🐓 Rooster Showcase Catalog</span>
              <span className="text-amber-400">{totalRoosters} birds</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('orders');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 text-xs font-bold"
            >
              <span>📦 Live Crate Customer Orders</span>
              <span className="text-emerald-400">{orders.length} orders</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('customers');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 text-xs font-bold"
            >
              <span>👥 Registered Customer Directory</span>
              <span className="text-sky-400">{customers.length} users</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('inquiries');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 text-xs font-bold"
            >
              <span>💬 Farm Visit Inquiries</span>
              <span className="text-purple-400">{totalInquiries} requests</span>
            </button>

            <button
              onClick={() => {
                setEditingRooster(null);
                setActiveTab('add');
                setIsMobileNavOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-1.5 p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Rooster Specimen</span>
            </button>
          </div>
        )}
      </div>

      {/* =======================================================================
         3. MAIN CONTENT CANVAS
         ======================================================================= */}
      <main className="flex-1 min-w-0 lg:ml-64 p-3 sm:p-6 lg:p-8 space-y-6">
        
        {/* Desktop Header Top-Bar */}
        <div className="hidden lg:flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold mb-1">
              <span>JP Farms Admin</span>
              <span>/</span>
              <span className="text-slate-900 capitalize font-bold">{activeTab}</span>
            </div>
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">
              {activeTab === 'roosters' && 'Living Rooster Catalog'}
              {activeTab === 'orders' && 'Live Animal Orders & Dispatch'}
              {activeTab === 'customers' && 'Registered Enthusiast Hub'}
              {activeTab === 'inquiries' && 'Farm Visit Reservations'}
              {activeTab === 'add' && (editingRooster ? `Edit Rooster #${editingRooster.tagId}` : 'Register New Purebred Rooster')}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {activeTab === 'orders' && (
              <button
                type="button"
                onClick={handleExportOrdersCSV}
                className="flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs shadow-xs transition"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export CSV</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setEditingRooster(null);
                setActiveTab('add');
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-4 py-2 rounded-xl text-xs shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Rooster</span>
            </button>
          </div>
        </div>

        {/* =====================================================================
           EXECUTIVE KPI METRICS CARDS (Shopify / Stripe Standard)
           Responsive: 2 columns on mobile, 4 columns on desktop
           ===================================================================== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
          
          {/* Card 1: Birds Inventory */}
          <div 
            onClick={() => setActiveTab('roosters')}
            className={`p-3.5 sm:p-5 rounded-2xl bg-white border transition shadow-xs cursor-pointer ${
              activeTab === 'roosters' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Catalog Birds
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                🐓
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              {totalRoosters}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-1">
              <strong className="text-amber-700 font-bold">{championCount}</strong> Champion • <strong className="text-slate-700 font-bold">{farmStudCount}</strong> Studs
            </p>
          </div>

          {/* Card 2: Live Animal Orders */}
          <div 
            onClick={() => {
              setActiveTab('orders');
              setOrderStatusFilter('all');
            }}
            className={`p-3.5 sm:p-5 rounded-2xl bg-white border transition shadow-xs cursor-pointer ${
              activeTab === 'orders' && orderStatusFilter !== 'delivered'
                ? 'border-amber-500 ring-2 ring-amber-500/10' 
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Total Orders
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Package className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              {orders.length}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-1">
              {pendingOrdersCount > 0 ? (
                <span className="text-rose-600 font-bold">⚡ {pendingOrdersCount} Pending Approval</span>
              ) : (
                <span className="text-emerald-700 font-semibold">✓ All orders processed</span>
              )}
            </p>
          </div>

          {/* Card 3: Gross Order Value */}
          <div 
            onClick={() => {
              setActiveTab('orders');
              setOrderStatusFilter('delivered');
            }}
            className={`p-3.5 sm:p-5 rounded-2xl bg-white border transition shadow-xs cursor-pointer ${
              activeTab === 'orders' && orderStatusFilter === 'delivered'
                ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Gross Order Value
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <Banknote className="w-4 h-4 text-sky-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-950 flex items-baseline justify-between">
              <span>₹{totalRevenue.toLocaleString('en-IN')}</span>
              {activeTab === 'orders' && orderStatusFilter === 'delivered' && (
                <span className="text-[9px] font-black uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">
                  Fulfilled
                </span>
              )}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-1">
              <strong className="text-emerald-700 font-bold">{deliveredOrdersCount}</strong> Fulfilled • {dispatchedOrdersCount} In Transit
            </p>
          </div>

          {/* Card 4: Visit Inquiries */}
          <div 
            onClick={() => setActiveTab('inquiries')}
            className={`p-3.5 sm:p-5 rounded-2xl bg-white border transition shadow-xs cursor-pointer ${
              activeTab === 'inquiries' ? 'border-amber-500 ring-2 ring-amber-500/10' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
                Farm Inquiries
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-black text-slate-950">
              {totalInquiries}
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-1">
              <strong className="text-purple-700 font-bold">{customers.length}</strong> Registered Buyers
            </p>
          </div>

        </div>

        {/* =====================================================================
           TAB 1: ROOSTERS CATALOG (Showroom Folders + Dual Table/Grid Views)
           ===================================================================== */}
        {activeTab === 'roosters' && (
          <div className="space-y-4">
            
            {/* If user is inside a specific category showroom folder */}
            {selectedCategoryFolder ? (
              (() => {
                const catMeta = ROOSTER_CATEGORIES_META[selectedCategoryFolder];
                const catBirds = roosters.filter(r => r.category === selectedCategoryFolder);
                const filteredCatBirds = catBirds.filter(r => {
                  if (!searchFilter.trim()) return true;
                  const q = searchFilter.toLowerCase();
                  return r.tagId.toLowerCase().includes(q) ||
                    r.name.toLowerCase().includes(q) ||
                    r.breed.toLowerCase().includes(q);
                });
                const prices = catBirds.map(b => b.price).filter(Boolean);
                const minPrice = prices.length ? Math.min(...prices) : 0;
                const maxPrice = prices.length ? Math.max(...prices) : 0;
                const priceRangeStr = prices.length === 0
                  ? 'Awaiting Birds'
                  : minPrice === maxPrice
                  ? `₹${minPrice.toLocaleString('en-IN')}`
                  : `₹${minPrice.toLocaleString('en-IN')} - ₹${maxPrice.toLocaleString('en-IN')}`;

                return (
                  <div className="space-y-4">
                    {/* Breadcrumb Navigation Bar */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => { setSelectedCategoryFolder(null); setSearchFilter(''); }}
                          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>All Category Showrooms</span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                        <span className="text-lg">{catMeta.icon}</span>
                        <span className="text-xs font-extrabold text-slate-900">{catMeta.name}</span>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
                          {catBirds.length} Birds
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => openAddRoosterForCategory(selectedCategoryFolder)}
                          className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black px-4 py-2 rounded-xl text-xs shadow-xs transition active:scale-95 cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Upload New {catMeta.shortName} Rooster</span>
                        </button>
                      </div>
                    </div>

                    {/* Breed Workspace Hero Banner */}
                    <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-slate-900 text-white rounded-2xl p-5 border border-amber-500/20 shadow-sm relative overflow-hidden">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2.5">
                            <span className="text-3xl">{catMeta.icon}</span>
                            <div>
                              <h3 className="text-xl font-black text-white tracking-tight flex items-center space-x-2">
                                <span>{catMeta.name}</span>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                                  Series: {catMeta.tagPrefix}###
                                </span>
                              </h3>
                              <p className="text-xs text-amber-300 font-semibold">{catMeta.tagline}</p>
                            </div>
                          </div>
                          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                            {catMeta.description}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3 bg-stone-900/90 border border-white/10 rounded-xl p-3 shrink-0">
                          <div className="text-center px-3 border-r border-white/10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Living Specimens</p>
                            <p className="text-xl font-black text-amber-400">{catBirds.length}</p>
                          </div>
                          <div className="text-center px-3">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price Range</p>
                            <p className="text-sm font-black text-white">{priceRangeStr}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Showroom Filter & View Switcher */}
                    <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder={`Search ${catMeta.shortName} by tag ID, name...`}
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                        />
                        {searchFilter && (
                          <button 
                            onClick={() => setSearchFilter('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                          >
                            ×
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-500">
                          {filteredCatBirds.length} of {catBirds.length} birds
                        </span>

                        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setRoosterViewMode('grid')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              roosterViewMode !== 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                            }`}
                            title="Grid View"
                          >
                            <LayoutGrid className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setRoosterViewMode('table')}
                            className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              roosterViewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
                            }`}
                            title="Table View"
                          >
                            <List className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Birds List */}
                    {filteredCatBirds.length === 0 ? (
                      <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
                        <span className="text-4xl">{catMeta.icon}</span>
                        <div>
                          <h4 className="text-sm font-black text-slate-900">
                            {catBirds.length === 0 
                              ? `No ${catMeta.name} roosters uploaded yet` 
                              : `No birds match "${searchFilter}"`}
                          </h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            {catBirds.length === 0
                              ? `Upload photos, videos, weights, and biological specs to open this breed showroom.`
                              : `Try clearing your search query to see all registered birds.`}
                          </p>
                        </div>
                        {catBirds.length === 0 ? (
                          <button
                            type="button"
                            onClick={() => openAddRoosterForCategory(selectedCategoryFolder)}
                            className="inline-flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs transition cursor-pointer shadow-sm"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Upload First {catMeta.shortName} Rooster</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSearchFilter('')}
                            className="text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                          >
                            Clear search filter
                          </button>
                        )}
                      </div>
                    ) : roosterViewMode === 'table' ? (
                      /* Table View inside Category Workspace */
                      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                              <tr>
                                <th className="py-3 px-4">Rooster Specimen</th>
                                <th className="py-3 px-4">Tag ID</th>
                                <th className="py-3 px-4">Comb & Traits</th>
                                <th className="py-3 px-4">Weight / Age</th>
                                <th className="py-3 px-4">Price</th>
                                <th className="py-3 px-4">Exhibition Badge</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {filteredCatBirds.map((rooster) => (
                                <tr key={rooster.id} className="hover:bg-slate-50/60 transition group">
                                  <td className="py-3 px-4">
                                    <div className="flex items-center space-x-3">
                                      <img
                                        src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
                                        alt={rooster.name}
                                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                                      />
                                      <div>
                                        <p className="font-extrabold text-slate-900 group-hover:text-amber-700 transition">
                                          {rooster.name}
                                        </p>
                                        <p className="text-[10px] text-slate-400">
                                          {rooster.combType || 'Pea Comb'}
                                        </p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                      {rooster.tagId}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <p className="font-semibold text-slate-800">{rooster.combType}</p>
                                    <span className="text-[10px] text-slate-400 truncate block max-w-xs">{rooster.colorPattern}</span>
                                  </td>
                                  <td className="py-3 px-4 font-medium text-slate-600">
                                    <p>{rooster.weight}</p>
                                    <p className="text-[10px] text-slate-400">{rooster.age}</p>
                                  </td>
                                  <td className="py-3 px-4 font-mono font-black text-slate-900">
                                    ₹{(rooster.price || 9500).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 px-4">
                                    <select
                                      value={rooster.badge}
                                      onChange={(e) => toggleBadge(rooster.id, e.target.value as RoosterBadge)}
                                      className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                                    >
                                      <option value="Champion Line">👑 Champion Line</option>
                                      <option value="Farm Stud">⭐ Farm Stud</option>
                                      <option value="Heritage Pure">🌿 Heritage Pure</option>
                                      <option value="Breeding Flock">🌾 Breeding Flock</option>
                                      <option value="Young Star">✨ Young Star</option>
                                    </select>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-1.5">
                                      <button
                                        type="button"
                                        onClick={() => handleEditClick(rooster)}
                                        className="p-1.5 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                                        title="Edit bird"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Delete #${rooster.tagId} (${rooster.name})?`)) {
                                            deleteRooster(rooster.id);
                                          }
                                        }}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                        title="Delete bird"
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
                    ) : (
                      /* Grid View inside Category Workspace */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                        {filteredCatBirds.map((rooster) => (
                          <div 
                            key={rooster.id}
                            className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/70 hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                                <img 
                                  src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'} 
                                  alt={rooster.name}
                                  className="w-full h-full object-cover object-center"
                                />
                                <div className="absolute top-2 left-2 flex items-center space-x-1 font-mono text-[10px] font-bold bg-black/85 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
                                  <span>TAG: {rooster.tagId}</span>
                                </div>
                                {rooster.videoUrl && (
                                  <div className="absolute top-2 right-2 p-1 rounded-full bg-black/75 text-amber-400" title="Video Available">
                                    <Video className="w-3.5 h-3.5" />
                                  </div>
                                )}
                                <div className="absolute bottom-2 left-2">
                                  <span className={`text-[10px] px-2 py-0.5 rounded-md ${getBadgeStyle(rooster.badge)}`}>
                                    {rooster.badge}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 space-y-1.5">
                                <h4 className="text-sm font-extrabold text-slate-950 truncate">
                                  {rooster.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium truncate">
                                  {rooster.combType} • {rooster.temperament}
                                </p>

                                <div className="flex items-center justify-between pt-1">
                                  <div>
                                    <span className="text-xs text-slate-400 line-through mr-1.5">
                                      ₹{(rooster.originalPrice || Math.round((rooster.price || 9500) * 1.25)).toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-sm font-black text-slate-950">
                                      ₹{(rooster.price || 9500).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                    {rooster.weight} • {rooster.height}
                                  </span>
                                </div>

                                <div className="pt-1">
                                  <select
                                    value={rooster.badge}
                                    onChange={(e) => toggleBadge(rooster.id, e.target.value as RoosterBadge)}
                                    className="w-full text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                                  >
                                    <option value="Champion Line">👑 Champion Line</option>
                                    <option value="Farm Stud">⭐ Farm Stud</option>
                                    <option value="Heritage Pure">🌿 Heritage Pure</option>
                                    <option value="Breeding Flock">🌾 Breeding Flock</option>
                                    <option value="Young Star">✨ Young Star</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            <div className="p-3 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => handleEditClick(rooster)}
                                className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-800 font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                                <span>Edit</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Delete #${rooster.tagId} (${rooster.name}) from catalogue?`)) {
                                    deleteRooster(rooster.id);
                                  }
                                }}
                                className="flex items-center justify-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              /* All Showrooms / All Roosters Root View */
              <div className="space-y-4">
                
                {/* View Switcher & Search Bar */}
                <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  
                  {/* View Mode Switcher Pills */}
                  <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
                    <button
                      type="button"
                      onClick={() => setRoosterViewMode('categories')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                        roosterViewMode === 'categories'
                          ? 'bg-amber-500 text-stone-950 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>📁 Breed Showrooms ({Object.keys(ROOSTER_CATEGORIES_META).length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoosterViewMode('table')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                        roosterViewMode === 'table'
                          ? 'bg-white text-slate-900 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>📋 All Birds Table ({roosters.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRoosterViewMode('grid')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
                        roosterViewMode === 'grid'
                          ? 'bg-white text-slate-900 shadow-xs font-black'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>🖼️ All Birds Grid ({roosters.length})</span>
                    </button>
                  </div>

                  {/* Search and Category Filter for table/grid */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search tag, name or breed..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                      />
                      {searchFilter && (
                        <button 
                          onClick={() => setSearchFilter('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    {roosterViewMode !== 'categories' && (
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                      >
                        <option value="all">All Breeds ({roosters.length})</option>
                        <option value="aseel-peela">Pure Aseel (Peela)</option>
                        <option value="aseel-kagar">Aseel (Kagar)</option>
                        <option value="aseel-sindhi">Sindhi Heavy Aseel</option>
                        <option value="kadaknath">Pure Kadaknath</option>
                        <option value="country-desi">Country Desi</option>
                        <option value="breeding-pairs">Breeding Units</option>
                      </select>
                    )}

                    <button
                      onClick={resetToDefault}
                      className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 text-xs font-semibold cursor-pointer"
                      title="Reset demo catalogue"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Primary Category View: BREED SHOWROOM FOLDERS */}
                {roosterViewMode === 'categories' ? (
                  <div className="space-y-4">
                    {/* Intro Note */}
                    <div className="bg-gradient-to-r from-amber-50 via-sky-50/50 to-white p-4 rounded-2xl border border-amber-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                          <Folder className="w-4 h-4 text-amber-600" />
                          <span>Heritage Breed Showrooms & Direct Upload Workspace</span>
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Open any breed showroom folder to browse registered roosters, inspect videos, or click <strong>&quot;+ Upload to Breed&quot;</strong> to document new specimens.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-lg self-start sm:self-auto border border-amber-300">
                        {roosters.length} Total Birds Cataloged
                      </span>
                    </div>

                    {/* Showroom Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {(Object.entries(ROOSTER_CATEGORIES_META) as [Exclude<RoosterCategory, 'all'>, BreedCategoryMeta][])
                        .filter(([catKey, meta]) => {
                          if (!searchFilter.trim()) return true;
                          const q = searchFilter.toLowerCase();
                          return meta.name.toLowerCase().includes(q) ||
                            meta.shortName.toLowerCase().includes(q) ||
                            meta.tagPrefix.toLowerCase().includes(q) ||
                            catKey.toLowerCase().includes(q);
                        })
                        .map(([catKey, meta]) => {
                          const birds = roosters.filter(r => r.category === catKey);
                          const prices = birds.map(b => b.price).filter(Boolean);
                          const minP = prices.length ? Math.min(...prices) : 0;
                          const maxP = prices.length ? Math.max(...prices) : 0;
                          const priceStr = prices.length === 0
                            ? 'Awaiting First Specimen'
                            : minP === maxP
                            ? `₹${minP.toLocaleString('en-IN')}`
                            : `₹${minP.toLocaleString('en-IN')} - ₹${maxP.toLocaleString('en-IN')}`;

                          const videoCount = birds.filter(b => !!b.videoUrl).length;

                          return (
                            <div
                              key={catKey}
                              className="bg-white rounded-2xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                            >
                              {/* Top Banner Accent */}
                              <div className={`h-2.5 w-full bg-gradient-to-r ${meta.accentColor}`} />

                              <div className="p-4 sm:p-5 space-y-3.5">
                                {/* Header: Icon + Name + Series Badge */}
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex items-center space-x-3">
                                    <span className="text-3xl p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition shrink-0">
                                      {meta.icon}
                                    </span>
                                    <div>
                                      <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-amber-800 transition">
                                        {meta.shortName}
                                      </h4>
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 inline-block mt-0.5">
                                        Series: {meta.tagPrefix}###
                                      </span>
                                    </div>
                                  </div>

                                  <span className={`text-[11px] font-mono font-extrabold px-2.5 py-1 rounded-lg border ${
                                    birds.length > 0 
                                      ? 'bg-amber-50 text-amber-950 border-amber-200' 
                                      : 'bg-slate-100 text-slate-500 border-slate-200'
                                  }`}>
                                    {birds.length} {birds.length === 1 ? 'Bird' : 'Birds'}
                                  </span>
                                </div>

                                {/* Breed Full Name & Tagline */}
                                <div>
                                  <p className="text-xs font-bold text-slate-700">{meta.name}</p>
                                  <p className="text-[11px] text-amber-700 font-semibold">{meta.tagline}</p>
                                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                                    {meta.description}
                                  </p>
                                </div>

                                {/* Specimen Thumbnails Preview */}
                                <div className="pt-2 border-t border-slate-100">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                      Living Stock Preview
                                    </span>
                                    <span className="text-[11px] font-mono font-black text-slate-900">
                                      {priceStr}
                                    </span>
                                  </div>

                                  {birds.length > 0 ? (
                                    <div className="flex items-center space-x-2 overflow-hidden py-0.5">
                                      {birds.slice(0, 4).map((b) => (
                                        <div
                                          key={b.id}
                                          className="relative group/thumb cursor-pointer"
                                          onClick={() => setSelectedCategoryFolder(catKey)}
                                          title={`#${b.tagId} - ${b.name}`}
                                        >
                                          <img
                                            src={b.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                                            alt={b.name}
                                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 group-hover/thumb:border-amber-500 transition shadow-2xs"
                                          />
                                          {b.videoUrl && (
                                            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 p-0.5 rounded-full text-[8px]" title="Video Available">
                                              <Video className="w-2.5 h-2.5" />
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                      {birds.length > 4 && (
                                        <div 
                                          onClick={() => setSelectedCategoryFolder(catKey)}
                                          className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 font-mono font-bold text-xs flex items-center justify-center border border-slate-200 cursor-pointer transition"
                                        >
                                          +{birds.length - 4}
                                        </div>
                                      )}
                                      {videoCount > 0 && (
                                        <span className="text-[10px] text-amber-700 font-bold ml-auto flex items-center space-x-1">
                                          <Video className="w-3 h-3" />
                                          <span>{videoCount} Video{videoCount > 1 ? 's' : ''}</span>
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl py-3 text-center">
                                      <p className="text-[11px] font-semibold text-slate-400">
                                        No birds registered yet in this category
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Card Action Footer */}
                              <div className="p-3 bg-slate-50/70 border-t border-slate-100 grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => openAddRoosterForCategory(catKey)}
                                  className="flex items-center justify-center space-x-1 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-800 hover:text-amber-950 border border-slate-200 font-bold py-2 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-2xs"
                                >
                                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                                  <span>+ Upload to Breed</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSelectedCategoryFolder(catKey)}
                                  className="flex items-center justify-center space-x-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2 rounded-xl text-xs transition active:scale-95 cursor-pointer shadow-xs"
                                >
                                  <span>Open Showroom</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                                </button>
                              </div>

                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : filteredRoosters.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                    <p className="text-sm font-bold text-slate-700">No birds match this search filter.</p>
                    <button
                      onClick={() => { setSearchFilter(''); setCategoryFilter('all'); }}
                      className="mt-2 text-xs text-amber-700 font-bold hover:underline cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : roosterViewMode === 'grid' ? (
                  /* Card Grid View (All Birds) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {filteredRoosters.map((rooster) => (
                      <div 
                        key={rooster.id}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500/70 hover:shadow-md transition overflow-hidden flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-4/3 w-full bg-slate-900 overflow-hidden">
                            <img 
                              src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'} 
                              alt={rooster.name}
                              className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute top-2 left-2 flex items-center space-x-1 font-mono text-[10px] font-bold bg-black/85 text-amber-400 px-2 py-0.5 rounded-md border border-amber-500/30">
                              <span>TAG: {rooster.tagId}</span>
                            </div>
                            {rooster.videoUrl && (
                              <div className="absolute top-2 right-2 p-1 rounded-full bg-black/75 text-amber-400" title="Video Available">
                                <Video className="w-3.5 h-3.5" />
                              </div>
                            )}
                            <div className="absolute bottom-2 left-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-md ${getBadgeStyle(rooster.badge)}`}>
                                {rooster.badge}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 space-y-1.5">
                            <h4 className="text-sm font-extrabold text-slate-950 truncate">
                              {rooster.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium truncate">
                              {rooster.breed}
                            </p>

                            <div className="flex items-center justify-between pt-1">
                              <div>
                                <span className="text-xs text-slate-400 line-through mr-1.5">
                                  ₹{(rooster.originalPrice || Math.round((rooster.price || 9500) * 1.25)).toLocaleString('en-IN')}
                                </span>
                                <span className="text-sm font-black text-slate-950">
                                  ₹{(rooster.price || 9500).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-600 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                {rooster.weight} • {rooster.height}
                              </span>
                            </div>

                            <div className="pt-1">
                              <select
                                value={rooster.badge}
                                onChange={(e) => toggleBadge(rooster.id, e.target.value as RoosterBadge)}
                                className="w-full text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                              >
                                <option value="Champion Line">👑 Champion Line</option>
                                <option value="Farm Stud">⭐ Farm Stud</option>
                                <option value="Heritage Pure">🌿 Heritage Pure</option>
                                <option value="Breeding Flock">🌾 Breeding Flock</option>
                                <option value="Young Star">✨ Young Star</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 pt-0 border-t border-slate-100 grid grid-cols-2 gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(rooster)}
                            className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-950 text-slate-800 font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                            <span>Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete rooster #${rooster.tagId} (${rooster.name}) from catalogue?`)) {
                                deleteRooster(rooster.id);
                              }
                            }}
                            className="flex items-center justify-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-1.5 rounded-lg text-xs transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  /* Table View (All Birds) */
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                          <tr>
                            <th className="py-3 px-4">Rooster Specimen</th>
                            <th className="py-3 px-4">Tag ID</th>
                            <th className="py-3 px-4">Breed & Category</th>
                            <th className="py-3 px-4">Weight / Age</th>
                            <th className="py-3 px-4">Price</th>
                            <th className="py-3 px-4">Exhibition Badge</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredRoosters.map((rooster) => (
                            <tr key={rooster.id} className="hover:bg-slate-50/60 transition group">
                              <td className="py-3 px-4">
                                <div className="flex items-center space-x-3">
                                  <img
                                    src={rooster.images[0] || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=800&q=80'}
                                    alt={rooster.name}
                                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                                  />
                                  <div>
                                    <p className="font-extrabold text-slate-900 group-hover:text-amber-700 transition">
                                      {rooster.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400">
                                      {rooster.combType || 'Pea Comb'}
                                    </p>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 font-mono font-bold text-slate-700">
                                <span className="bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                                  {rooster.tagId}
                                </span>
                              </td>

                              <td className="py-3 px-4">
                                <p className="font-semibold text-slate-800">{rooster.breed}</p>
                                <span className="text-[10px] text-amber-700 font-mono">
                                  {rooster.category}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-medium text-slate-600">
                                <p>{rooster.weight}</p>
                                <p className="text-[10px] text-slate-400">{rooster.age}</p>
                              </td>

                              <td className="py-3 px-4 font-mono font-black text-slate-900">
                                ₹{(rooster.price || 9500).toLocaleString('en-IN')}
                              </td>

                              <td className="py-3 px-4">
                                <select
                                  value={rooster.badge}
                                  onChange={(e) => toggleBadge(rooster.id, e.target.value as RoosterBadge)}
                                  className="text-[11px] font-bold py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700"
                                >
                                  <option value="Champion Line">👑 Champion Line</option>
                                  <option value="Farm Stud">⭐ Farm Stud</option>
                                  <option value="Heritage Pure">🌿 Heritage Pure</option>
                                  <option value="Breeding Flock">🌾 Breeding Flock</option>
                                  <option value="Young Star">✨ Young Star</option>
                                </select>
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end space-x-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditClick(rooster)}
                                    className="p-1.5 rounded-lg text-slate-600 hover:text-amber-800 hover:bg-amber-50 transition cursor-pointer"
                                    title="Edit bird"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (confirm(`Delete #${rooster.tagId} (${rooster.name})?`)) {
                                        deleteRooster(rooster.id);
                                      }
                                    }}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete bird"
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
                )}

              </div>
            )}

          </div>
        )}

        {/* =====================================================================
           TAB 2: CUSTOMER ORDERS & LIVE DISPATCH TRACKING
           ===================================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Orders Header Search & Filter Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, customer, phone, city or bird..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Status Filter Chips */}
              <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: `All (${orders.length})` },
                  { id: 'pending_approval', label: `Pending (${pendingOrdersCount})` },
                  { id: 'confirmed', label: `Ready (${confirmedOrdersCount})` },
                  { id: 'dispatched', label: `In Transit (${dispatchedOrdersCount})` },
                  { id: 'delivered', label: `Delivered (${deliveredOrdersCount})` },
                  { id: 'rejected', label: `Rejected (${rejectedOrdersCount})` },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(st.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      orderStatusFilter === st.id
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Orders List: Mobile-First Executive Order Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No orders found in this category.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredOrders.map((order) => {
                  const statusInfo = getOrderStatusBadge(order.status);
                  const whatsAppOrderUrl = generateWhatsAppLink({
                    phone: order.phoneNumber,
                    customMessage: `Hello ${order.customerName}! 🐓 This is JP Farms dispatch team regarding your order #${order.id}.`,
                  });

                  return (
                    <div 
                      key={order.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:border-slate-300 transition space-y-3"
                    >
                      {/* Top Row: Order ID, Date & Status */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-xs sm:text-sm text-slate-900">
                            #{order.id}
                          </span>
                          <span className="text-slate-400 text-xs">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {new Date(order.orderDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${statusInfo.style}`}>
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Middle Grid: Customer & Delivery details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        {/* Customer */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Buyer Details</p>
                          <p className="font-extrabold text-slate-900 mt-0.5">{order.customerName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <a
                              href={`tel:${order.phoneNumber}`}
                              className="inline-flex items-center space-x-1 text-slate-600 font-mono hover:text-amber-800"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>{order.phoneNumber}</span>
                            </a>
                            <a
                              href={whatsAppOrderUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded hover:bg-emerald-100"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Destination */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Fulfillment & Destination</p>
                          <p className="font-semibold text-slate-800 mt-0.5">
                            {order.deliveryType === 'farm_pickup' ? '🏡 Farm Estate Pickup' : '🚚 Doorstep Climate Crate'}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5" title={order.deliveryAddress}>
                            {order.deliveryAddress}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {order.city}, {order.state} • {order.pincode}
                          </p>
                        </div>

                        {/* Order Items & Price */}
                        <div className="sm:text-right">
                          <p className="text-[10px] text-slate-400 uppercase font-bold">Total Amount</p>
                          <p className="text-base font-black text-slate-950 mt-0.5">
                            ₹{order.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[11px] text-slate-600 font-medium mt-0.5">
                            {order.items && order.items.length > 0
                              ? `${order.items.length} ${order.items.length === 1 ? 'Rooster' : 'Roosters'}`
                              : order.roosterName}
                          </p>
                          <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online / UPI'}
                          </span>
                        </div>
                      </div>

                      {/* Birds List Thumbnails */}
                      {order.items && order.items.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
                          {order.items.map((item, idx) => (
                            <div 
                              key={idx}
                              className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-xl border border-slate-200 shrink-0"
                            >
                              {item.roosterImage && (
                                <img 
                                  src={item.roosterImage} 
                                  alt={item.roosterName} 
                                  className="w-7 h-7 rounded-lg object-cover"
                                />
                              )}
                              <span className="text-[11px] font-bold text-slate-800">
                                {item.roosterName}
                              </span>
                              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-1 rounded">
                                #{item.roosterTag}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Order Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            onClick={() => setPrintingOrder(order)}
                            className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Dispatch Slip</span>
                          </button>

                          {order.status !== 'delivered' && order.status !== 'pending_approval' && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Permanently remove order #${order.id}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                              title="Delete order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Status Transition Triggers */}
                        <div className="flex items-center space-x-2">
                          {order.status === 'pending_approval' && (
                            <>
                              <button
                                type="button"
                                onClick={() => acceptOrder(order.id)}
                                className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-3 py-1.5 rounded-xl text-xs shadow-xs active:scale-95 transition"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Accept Order</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setRejectingOrder(order)}
                                className="flex items-center space-x-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold px-3 py-1.5 rounded-xl text-xs transition"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </>
                          )}

                          {order.status === 'confirmed' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'dispatched')}
                              className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs active:scale-95 transition"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>Dispatch Crate 🚚</span>
                            </button>
                          )}

                          {order.status === 'dispatched' && (
                            <button
                              type="button"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-xs active:scale-95 transition"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Mark Delivered ✅</span>
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
           TAB 3: REGISTERED CUSTOMERS DIRECTORY
           ===================================================================== */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search buyer by name, email, phone or city..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden"
                />
              </div>
              <span className="text-xs font-bold text-slate-500">
                {filteredCustomers.length} Enthusiasts
              </span>
            </div>

            {filteredCustomers.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No registered customers match your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredCustomers.map((cust) => {
                  const custOrders = orders.filter(o => o.userId === cust.uid || (cust.phone && o.phoneNumber === cust.phone));
                  const custSpend = custOrders.reduce((sum, o) => sum + o.price, 0);
                  const custWhatsApp = cust.phone ? generateWhatsAppLink({
                    phone: cust.phone,
                    customMessage: `Hello ${cust.name || 'Friend'}! 🐓 JP Farms here.`,
                  }) : '';

                  const isOwner = isBhanuEmail(cust.email);
                  const isGoogleUser = Boolean(cust.email?.toLowerCase().endsWith('@gmail.com'));
                  const photoUrl = cust.photoURL && cust.photoURL.trim() && !cust.photoURL.includes('images.unsplash.com') ? cust.photoURL : null;

                  // Google Material Palette Colors for crisp, distinct initial avatars
                  const avatarBgColors = [
                    'bg-blue-600',
                    'bg-emerald-600',
                    'bg-amber-600',
                    'bg-rose-600',
                    'bg-indigo-600',
                    'bg-teal-600',
                    'bg-purple-600',
                  ];
                  let hash = 0;
                  const str = cust.email || cust.name || 'User';
                  for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 5) - hash);
                  }
                  const avatarBg = avatarBgColors[Math.abs(hash) % avatarBgColors.length];

                  return (
                    <div 
                      key={cust.uid}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition space-y-3"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 shrink-0">
                          {photoUrl ? (
                            <img
                              src={photoUrl}
                              alt={cust.name || 'Profile'}
                              referrerPolicy="no-referrer"
                              className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-xs"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                                const fallback = e.currentTarget.parentElement?.querySelector('.avatar-fallback') as HTMLElement | null;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`avatar-fallback w-12 h-12 rounded-full ${avatarBg} text-white font-black text-base items-center justify-center shadow-xs border border-white/20 ${photoUrl ? 'hidden' : 'flex'}`}
                          >
                            {cust.name ? cust.name.charAt(0).toUpperCase() : '👤'}
                          </div>
                          {isGoogleUser && (
                            <span 
                              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs"
                              title="Google Verified Account"
                            >
                              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                              </svg>
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <h4 className="text-sm font-extrabold text-slate-900 truncate">
                              {cust.name || 'Avian Enthusiast'}
                            </h4>
                            {isOwner ? (
                              <span className="text-[10px] font-black text-amber-900 bg-amber-400 px-1.5 py-0.2 rounded-full inline-flex items-center space-x-0.5 shrink-0">
                                <span>★ Farm Owner</span>
                              </span>
                            ) : isGoogleUser ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full inline-flex items-center space-x-0.5 shrink-0">
                                <Check className="w-2.5 h-2.5" />
                                <span>Google Verified</span>
                              </span>
                            ) : null}
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{cust.email}</p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Phone:</span>
                          <span className="font-mono font-bold text-slate-900">
                            {cust.phone || 'Not provided'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Joined:</span>
                          <span className="font-semibold text-slate-900">
                            {new Date(cust.joinedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Total Orders:</span>
                          <span className="font-extrabold text-slate-900">{custOrders.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                          <span>Total Spent:</span>
                          <span className="font-black text-emerald-700">₹{custSpend.toLocaleString('en-IN')}</span>
                        </div>
                      </div>

                      {cust.phone && (
                        <div className="pt-1 flex items-center space-x-2">
                          <a
                            href={`tel:${cust.phone}`}
                            className="flex-1 flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-1.5 rounded-lg text-xs transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Call</span>
                          </a>
                          <a
                            href={custWhatsApp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded-lg text-xs transition"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
           TAB 4: FARM VISIT INQUIRIES & APPOINTMENTS
           ===================================================================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900">Visitor Appointments & Strain Inquiries</h3>
                <p className="text-xs text-slate-500">Coordinate on-site visits to inspect lineage specimens</p>
              </div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                {inquiries.length} Inquiries
              </span>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No farm visit inquiries logged yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {inquiries.map((inquiry) => {
                  const inquiryWhatsApp = generateWhatsAppLink({
                    phone: inquiry.phoneNumber,
                    customMessage: `Hello ${inquiry.customerName}! 🐓 JP Farms here regarding your inquiry for ${inquiry.roosterName || 'heritage breeds'}.`,
                  });

                  return (
                    <div 
                      key={inquiry.id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-black text-slate-900">{inquiry.customerName}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">{inquiry.phoneNumber}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          inquiry.status === 'contacted' ? 'bg-sky-100 text-sky-800' :
                          inquiry.status === 'archived' ? 'bg-slate-100 text-slate-700' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {inquiry.status}
                        </span>
                      </div>

                      <div className="bg-slate-50 rounded-xl p-2.5 text-xs space-y-1">
                        <p><strong>City / State:</strong> {inquiry.cityState || 'Not specified'}</p>
                        <p><strong>Inquiry Type:</strong> <span className="capitalize">{inquiry.inquiryType.replace('_', ' ')}</span></p>
                        {inquiry.roosterName && (
                          <p><strong>Bird Interest:</strong> {inquiry.roosterName} (#{inquiry.roosterTag})</p>
                        )}
                        {inquiry.message && (
                          <p className="text-slate-600 italic pt-1 border-t border-slate-200 text-[11px]">
                            "{inquiry.message}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 pt-1">
                        <select
                          value={inquiry.status}
                          onChange={(e) => updateInquiryStatus(inquiry.id, e.target.value as any)}
                          className="flex-1 text-[11px] font-bold py-1.5 px-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700"
                        >
                          <option value="new">New Inquiry</option>
                          <option value="contacted">Contacted</option>
                          <option value="archived">Archived</option>
                        </select>

                        <a
                          href={inquiryWhatsApp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                          title="WhatsApp visitor"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* =====================================================================
           TAB 5: ADD / EDIT ROOSTER FORM (Frictionless Mobile-First Form)
           ===================================================================== */}
        {activeTab === 'add' && (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-7 shadow-xs space-y-6 max-w-4xl mx-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {editingRooster ? `Edit Rooster Profile #${editingRooster.tagId}` : 'Register New Heritage Rooster'}
                </h3>
                <p className="text-xs text-slate-500">
                  Document biological traits, comb structure, plumage, and media
                </p>
              </div>

              {editingRooster && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingRooster(null);
                    setActiveTab('roosters');
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
              )}
            </div>

            {/* Showroom Association Banner */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl">{ROOSTER_CATEGORIES_META[formData.category as Exclude<RoosterCategory, 'all'>]?.icon || '🐓'}</span>
                <div>
                  <p className="text-xs font-black text-amber-950">
                    Category Showroom: {ROOSTER_CATEGORIES_META[formData.category as Exclude<RoosterCategory, 'all'>]?.name || formData.category}
                  </p>
                  <p className="text-[11px] text-amber-800">
                    Tag Series Prefix: <code className="font-mono font-bold bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-950">{ROOSTER_CATEGORIES_META[formData.category as Exclude<RoosterCategory, 'all'>]?.tagPrefix}###</code> • {ROOSTER_CATEGORIES_META[formData.category as Exclude<RoosterCategory, 'all'>]?.tagline}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-950 px-2.5 py-1 rounded-md self-start sm:self-auto border border-amber-300">
                Showroom Linked
              </span>
            </div>

            {/* Section 1: Identification & Pricing */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>1. Identification & Valuation</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Breed Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as Exclude<RoosterCategory, 'all'>;
                      const meta = ROOSTER_CATEGORIES_META[newCat];
                      setFormData(prev => ({
                        ...prev,
                        category: newCat,
                        breed: meta ? meta.name : prev.breed,
                        tagId: prev.tagId && prev.tagId.includes('-') && meta
                          ? `${meta.tagPrefix}${prev.tagId.split('-').slice(2).join('-') || Math.floor(100 + Math.random() * 900)}`
                          : meta ? `${meta.tagPrefix}${Math.floor(100 + Math.random() * 900)}` : prev.tagId
                      }));
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                  >
                    <option value="aseel-peela">🐓 Pure Aseel (Peela)</option>
                    <option value="aseel-kagar">🦅 Aseel Kagar</option>
                    <option value="aseel-sindhi">🦃 Sindhi Heavy Aseel</option>
                    <option value="kadaknath">🖤 Pure Kadaknath</option>
                    <option value="country-desi">🌾 Country Desi (Natu Kodi)</option>
                    <option value="breeding-pairs">👑 Breeding Units</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tag ID</label>
                  <input
                    type="text"
                    required
                    value={formData.tagId}
                    onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
                    placeholder="e.g. JP-AS-105"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Rooster Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sultan - Sindhi Heavy Stud"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Exhibition Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value as RoosterBadge })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Champion Line">👑 Champion Line</option>
                    <option value="Farm Stud">⭐ Farm Stud</option>
                    <option value="Heritage Pure">🌿 Heritage Pure</option>
                    <option value="Breeding Flock">🌾 Breeding Flock</option>
                    <option value="Young Star">✨ Young Star</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Breed Line</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    placeholder="e.g. Pure Aseel (Peela)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Biological & Anatomical Traits */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>2. Physical & Anatomical Specs</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="e.g. 14 Months"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="e.g. 3.85 Kg"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Height</label>
                  <input
                    type="text"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    placeholder="e.g. 26 Inches"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Comb Type</label>
                  <input
                    type="text"
                    value={formData.combType}
                    onChange={(e) => setFormData({ ...formData, combType: e.target.value })}
                    placeholder="e.g. Pea Comb (Compact)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Color & Plumage Pattern</label>
                <input
                  type="text"
                  value={formData.colorPattern}
                  onChange={(e) => setFormData({ ...formData, colorPattern: e.target.value })}
                  placeholder="e.g. Golden Yellow & Red with Green Tail Sheen"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>
            </div>

            {/* Section 3: High-Res Media & Video Documentation */}
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                <span>3. HD Media Documentation</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Photo 1 */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Primary Photo URL</label>
                  <input
                    type="url"
                    value={formData.imageUrl1}
                    onChange={(e) => setFormData({ ...formData, imageUrl1: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'imageUrl1')} 
                      />
                    </label>
                    {uploadingField === 'imageUrl1' && (
                      <span className="text-[10px] text-amber-600 font-bold animate-pulse">
                        Uploading ({uploadProgress}%)...
                      </span>
                    )}
                  </div>
                </div>

                {/* Video URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Video Demonstration (MP4)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                  <div className="flex items-center space-x-2 pt-1">
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center space-x-1">
                      <Video className="w-3.5 h-3.5" />
                      <span>Upload Video File</span>
                      <input 
                        type="file" 
                        accept="video/*" 
                        className="hidden" 
                        onChange={(e) => handleFileUpload(e, 'videoUrl')} 
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('roosters')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-stone-950 font-black text-xs shadow-md active:scale-95 transition"
              >
                {editingRooster ? 'Save Changes' : 'Publish Rooster to Catalogue'}
              </button>
            </div>

          </form>
        )}

      </main>

      {/* =======================================================================
         4. BIOLOGICAL DISPATCH BILL / INVOICE PRINT MODAL
         ======================================================================= */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
                <Printer className="w-4 h-4 text-amber-600" />
                <span>OFFICIAL LIVE ANIMAL TRANSIT CONSIGNMENT</span>
              </div>
              <button
                onClick={() => setPrintingOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
              <div className="flex justify-between font-bold">
                <span>Consignment Order ID:</span>
                <span className="font-mono text-stone-950">#{printingOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-bold text-stone-900">{printingOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-mono">{printingOrder.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination:</span>
                <span>{printingOrder.deliveryAddress}, {printingOrder.city}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-800 pt-1 border-t border-amber-200">
                <span>Consignment Value:</span>
                <span>₹{printingOrder.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="p-3 bg-stone-900 text-amber-300 rounded-xl text-[11px] font-bold">
              ⚡ LIVE BIRD PROTOCOL: Store crate upright in ventilated compartment. Seed & hydration trays secured.
            </div>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setPrintingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl text-xs font-black bg-stone-950 text-white flex items-center space-x-1.5 shadow-md"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Slip</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =======================================================================
         5. REJECT ORDER WITH REASON MODAL
         ======================================================================= */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-stone-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-rose-200 space-y-4">
            
            <div className="flex items-start justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="font-black text-stone-900 text-base">Reject Customer Order</h3>
                <p className="text-xs text-stone-500 font-mono">Order #{rejectingOrder.id} • {rejectingOrder.customerName}</p>
              </div>
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-stone-800 uppercase tracking-wide">
                Select Reason for Rejection
              </label>

              {[
                'Destination address exceeds 20 km live animal delivery radius',
                'Selected rooster is currently undergoing 14-day avian quarantine',
                'Customer requested cancellation or duplicate order placed',
                'Customer unreachable for doorstep bio-secure delivery confirmation',
                'Other (specify custom reason below)',
              ].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-start space-x-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    selectedRejectReason === reason
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={selectedRejectReason === reason}
                    onChange={() => setSelectedRejectReason(reason)}
                    className="mt-0.5 text-rose-600 cursor-pointer"
                  />
                  <span>{reason}</span>
                </label>
              ))}

              {selectedRejectReason === 'Other (specify custom reason below)' && (
                <textarea
                  rows={2}
                  placeholder="Specify custom reason..."
                  value={customRejectReason}
                  onChange={(e) => setCustomRejectReason(e.target.value)}
                  className="w-full p-2.5 text-xs border border-stone-300 rounded-xl"
                />
              )}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 text-xs font-bold text-stone-600 bg-stone-100 rounded-xl"
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
                className="px-5 py-2 text-xs font-black text-white bg-rose-600 hover:bg-rose-500 rounded-xl active:scale-95 shadow-md"
              >
                Confirm Rejection
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
