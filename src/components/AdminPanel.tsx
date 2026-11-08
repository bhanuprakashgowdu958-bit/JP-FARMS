'use client';

import React, { useState } from 'react';
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
  Package
} from 'lucide-react';
import { Rooster, RoosterCategory, RoosterBadge, CustomerInquiry, RoosterOrder } from '@/types/rooster';
import { useRoosters, useInquiries, useOrders } from '@/lib/roosterStore';
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
  const { orders, updateOrderStatus } = useOrders();

  const [activeTab, setActiveTab] = useState<'roosters' | 'orders' | 'inquiries' | 'add'>('roosters');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingRooster, setEditingRooster] = useState<Rooster | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

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

  const filteredRoosters = roosters.filter(r => 
    r.tagId.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
    r.breed.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20">
      
      {/* Top Admin Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-1.5 text-xs font-semibold text-stone-400 hover:text-amber-400 transition bg-stone-800 px-3 py-1.5 rounded-lg border border-stone-700"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>View Public Site</span>
              </Link>

              <div>
                <h1 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <span>JP Farms • Farm Owner Control Panel</span>
                  <span className="text-[10px] bg-amber-500 text-stone-950 font-bold px-2 py-0.5 rounded">
                    Showcase Admin
                  </span>
                </h1>
                <p className="text-xs text-stone-400">
                  Manage heritage roosters, upload photos & walking reels, and review visit requests
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

        {/* TAB 2: LIVE CUSTOMER ORDERS (Amazon/Flipkart Style) */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-stone-900 text-base flex items-center space-x-2">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <span>Online Customer Orders</span>
                  <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-0.5 rounded-full font-extrabold">
                    {orders.length} Total
                  </span>
                </h3>
                <p className="text-xs text-stone-500">
                  Track live orders placed through the website. Contact buyers, verify payments, and coordinate climate crate dispatch.
                </p>
              </div>

              <div className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl">
                Total Order Volume: ₹{orders.reduce((sum, o) => sum + o.price, 0).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="space-y-3">
              {orders.map((order) => {
                const customerWhatsAppUrl = generateWhatsAppLink({
                  phone: order.phoneNumber,
                  customMessage: `Hello ${order.customerName}! 🐓 JP Farms here regarding your Order #${order.id} for Rooster ${order.roosterName} (TAG: ${order.roosterTag}). We are preparing the bird and wanted to confirm your delivery schedule.`,
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:border-amber-300 transition space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                      <div className="flex items-center space-x-3">
                        <img
                          src={order.roosterImage || 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80'}
                          alt={order.roosterName}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                              {order.id}
                            </span>
                            <span className="font-mono text-xs text-stone-600">
                              TAG: #{order.roosterTag}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-stone-900 mt-0.5">
                            {order.roosterName}
                          </h4>
                          <p className="text-xs text-stone-500">{order.roosterBreed}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <p className="text-base font-black text-emerald-700">
                            ₹{order.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-stone-400">{order.orderDate}</p>
                        </div>

                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                          className={`text-xs font-extrabold rounded-xl px-3 py-1.5 border ${
                            order.status === 'confirmed'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : order.status === 'dispatched'
                              ? 'bg-sky-50 text-sky-900 border-sky-300'
                              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <option value="confirmed">Order Confirmed</option>
                          <option value="dispatched">Dispatched / In Transit</option>
                          <option value="delivered">Delivered & Complete</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Delivery Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-stone-400">Customer</span>
                        <p className="font-bold text-stone-900">{order.customerName}</p>
                        <p className="text-stone-600 font-mono">{order.phoneNumber}</p>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase font-bold text-stone-400">Delivery Address</span>
                        <p className="text-stone-800 leading-snug">
                          {order.deliveryAddress}, {order.city}, {order.state} - {order.pincode}
                        </p>
                        <span className="inline-block mt-0.5 text-[10px] font-bold text-sky-700">
                          {order.deliveryType === 'doorstep_live_crate' ? '🚚 Live Crate Doorstep' : '🏡 Farm Pickup'}
                        </span>
                      </div>

                      <div>
                        <span className="block text-[10px] uppercase font-bold text-stone-400">Payment & Notes</span>
                        <p className="font-bold text-stone-900 uppercase">
                          {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : order.paymentMethod === 'upi' ? '📱 Instant UPI' : '🪙 Advance Token'}
                        </p>
                        {order.notes && <p className="text-[11px] text-stone-500 italic mt-0.5">&ldquo;{order.notes}&rdquo;</p>}
                      </div>
                    </div>

                    {/* Quick WhatsApp & Call Actions */}
                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={customerWhatsAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp (Send Dispatch Update)</span>
                      </a>

                      <a
                        href={`tel:${order.phoneNumber}`}
                        className="flex items-center justify-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold py-2 px-4 rounded-xl text-xs transition"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Buyer</span>
                      </a>
                    </div>

                  </div>
                );
              })}
            </div>
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

    </div>
  );
};
