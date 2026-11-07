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
  DollarSign, 
  Tag, 
  Phone, 
  MessageCircle, 
  RotateCcw,
  Sparkles,
  TrendingUp,
  Package,
  Layers,
  Search
} from 'lucide-react';
import { Rooster, RoosterCategory, CustomerInquiry } from '@/types/rooster';
import { useRoosters, useInquiries } from '@/lib/roosterStore';
import { formatPrice, generateWhatsAppLink } from '@/lib/utils';
import { FARM_INFO } from '@/lib/data';
import { isFirebaseConfigured } from '@/lib/firebase';
import { uploadRoosterMediaToFirebase } from '@/lib/firebaseService';

export const AdminPanel: React.FC = () => {
  const { 
    roosters, 
    addRooster, 
    updateRooster, 
    deleteRooster, 
    toggleStatus, 
    resetToDefault 
  } = useRoosters();

  const { inquiries, updateInquiryStatus } = useInquiries();

  const [activeTab, setActiveTab] = useState<'roosters' | 'inquiries' | 'add'>('roosters');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingRooster, setEditingRooster] = useState<Rooster | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Form State for Adding / Editing Rooster
  const [formData, setFormData] = useState({
    tagId: '',
    name: '',
    breed: 'Pure Aseel (Peela)',
    category: 'aseel-peela' as RoosterCategory,
    age: '12 Months',
    weight: '3.6 Kg',
    height: '25 Inches',
    combType: 'Pea Comb',
    colorPattern: 'Golden Yellow & Red with Green Tail',
    temperament: 'Dominant, Alert, Strong Upright Stance',
    diet: 'Sprouted Bajra, Almond paste, Boiled Desi Eggs & Greens',
    vaccinationStatus: 'Fully Vaccinated' as Rooster['vaccinationStatus'],
    vaccines: 'Ranikhet ND-Lasota, Fowl Pox, IBD, Dewormed',
    price: 7500,
    originalPrice: 9000,
    status: 'available' as Rooster['status'],
    imageUrl1: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80',
    imageUrl2: 'https://images.unsplash.com/photo-1612170153139-6f881ff067e0?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-rooster-crowing-in-the-morning-42544-large.mp4',
    lineage: 'Direct son of champion line. Heavy bone structure.',
    healthWarranty: '100% Disease-Free & Live Transit Guarantee',
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
      age: rooster.age,
      weight: rooster.weight,
      height: rooster.height,
      combType: rooster.combType,
      colorPattern: rooster.colorPattern,
      temperament: rooster.temperament,
      diet: rooster.diet,
      vaccinationStatus: rooster.vaccinationStatus,
      vaccines: rooster.vaccines.join(', '),
      price: rooster.price,
      originalPrice: rooster.originalPrice || rooster.price,
      status: rooster.status,
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
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        combType: formData.combType,
        colorPattern: formData.colorPattern,
        temperament: formData.temperament,
        diet: formData.diet,
        vaccinationStatus: formData.vaccinationStatus,
        vaccines: vaccinesArray,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        status: formData.status,
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
        age: formData.age,
        weight: formData.weight,
        height: formData.height,
        combType: formData.combType,
        colorPattern: formData.colorPattern,
        temperament: formData.temperament,
        diet: formData.diet,
        vaccinationStatus: formData.vaccinationStatus,
        vaccines: vaccinesArray,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        status: formData.status,
        images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1200&q=80'],
        videoUrl: formData.videoUrl,
        lineage: formData.lineage,
        healthWarranty: formData.healthWarranty,
        description: formData.description,
        featured: formData.featured,
      });
      alert('New rooster added to farm catalogue successfully!');
    }

    setEditingRooster(null);
    setActiveTab('roosters');
  };

  // Analytics Metrics
  const totalRoosters = roosters.length;
  const availableCount = roosters.filter(r => r.status === 'available').length;
  const soldCount = roosters.filter(r => r.status === 'sold').length;
  const totalInquiries = inquiries.length;
  const totalCatalogValue = roosters.reduce((acc, curr) => acc + curr.price, 0);

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
                    Admin
                  </span>
                  {isFirebaseConfigured ? (
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/60 font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Firebase Connected</span>
                    </span>
                  ) : (
                    <span className="text-[10px] bg-stone-800 text-stone-400 border border-stone-700 px-2 py-0.5 rounded-full">
                      Local Mode (Vercel Ready)
                    </span>
                  )}
                </h1>
                <p className="text-xs text-stone-400">
                  Manage roosters, upload photos & videos, and track customer inquiries
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  setEditingRooster(null);
                  setActiveTab('add');
                }}
                className="flex items-center space-x-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs shadow-md transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Rooster</span>
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-6 text-sm font-semibold border-t border-stone-800">
          <button
            onClick={() => setActiveTab('roosters')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'roosters'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Roosters Inventory ({totalRoosters})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'inquiries'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Customer Inquiries & Leads ({totalInquiries})</span>
          </button>

          <button
            onClick={() => {
              setEditingRooster(null);
              setActiveTab('add');
            }}
            className={`py-3 border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'add'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-stone-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingRooster ? 'Edit Rooster' : 'Upload Rooster (Photos & Video)'}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase">Available for Dispatch</p>
            <p className="text-3xl font-black text-emerald-700 mt-1">{availableCount} Birds</p>
            <p className="text-[11px] text-stone-400 mt-1">Ready for immediate delivery</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase">Total Birds Sold</p>
            <p className="text-3xl font-black text-stone-800 mt-1">{soldCount} Birds</p>
            <p className="text-[11px] text-stone-400 mt-1">Safely delivered</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase">Buyer Leads & Requests</p>
            <p className="text-3xl font-black text-amber-600 mt-1">{totalInquiries} Leads</p>
            <p className="text-[11px] text-stone-400 mt-1">Tokens, calls & WhatsApp</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <p className="text-xs font-semibold text-stone-500 uppercase">Current Stock Value</p>
            <p className="text-3xl font-black text-stone-900 mt-1">{formatPrice(totalCatalogValue)}</p>
            <p className="text-[11px] text-stone-400 mt-1">{totalRoosters} active catalog entries</p>
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
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Media</th>
                      <th className="py-3.5 px-4">Status</th>
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

                        {/* Price */}
                        <td className="py-3 px-4 font-black text-sm text-stone-900">
                          {formatPrice(rooster.price)}
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

                        {/* Status Toggle Dropdown */}
                        <td className="py-3 px-4">
                          <select
                            value={rooster.status}
                            onChange={(e) => toggleStatus(rooster.id, e.target.value as Rooster['status'])}
                            className={`font-bold text-[11px] rounded-lg px-2.5 py-1 border transition ${
                              rooster.status === 'available'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : rooster.status === 'reserved'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-stone-100 text-stone-600 border-stone-300'
                            }`}
                          >
                            <option value="available">🟢 Available</option>
                            <option value="reserved">🟡 Token Reserved</option>
                            <option value="sold">🔴 Sold Out</option>
                          </select>
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

        {/* TAB 2: INQUIRIES & LEADS */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-base">Customer Booking Requests & Inquiries</h3>
                <p className="text-xs text-stone-500">Contact buyers directly on WhatsApp or phone to coordinate dispatch and payment.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inquiries.map((inq) => {
                const customerWhatsAppUrl = `https://wa.me/${inq.phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Hi ${inq.customerName}, this is JP Farms regarding your inquiry for Rooster #${inq.roosterTag} (${inq.roosterName}).`
                )}`;

                return (
                  <div key={inq.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3">
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                            {inq.roosterTag}
                          </span>
                          <span className="text-xs font-bold text-stone-900">{inq.roosterName}</span>
                        </div>
                        <p className="text-xs text-stone-400 mt-0.5">{inq.createdAt}</p>
                      </div>

                      <select
                        value={inq.status}
                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                        className="text-[11px] font-bold rounded-lg px-2 py-1 bg-stone-100 border border-stone-200"
                      >
                        <option value="new">New Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="deal_closed">Deal Closed / Paid</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                      <p><strong className="text-stone-700">Customer:</strong> {inq.customerName}</p>
                      <p><strong className="text-stone-700">Phone:</strong> {inq.phoneNumber}</p>
                      <p><strong className="text-stone-700">Destination:</strong> {inq.cityState}</p>
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
                {editingRooster ? `Edit Rooster: ${editingRooster.tagId}` : 'Add New Rooster to Farm'}
              </h2>
              <p className="text-xs text-stone-500">
                Upload photos, walking video link, physical measurements, and pricing.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Tag ID & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Tag ID (Leg / Wing Band) *
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

              {/* Row 2: Breed & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Row 4: Pricing & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 8500"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 10000"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Availability Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Rooster['status'] })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-stone-300 font-bold"
                  >
                    <option value="available">🟢 Available for Sale</option>
                    <option value="reserved">🟡 Reserved (Token Paid)</option>
                    <option value="sold">🔴 Sold Out</option>
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
                  {editingRooster ? 'Update Rooster Listing' : 'Publish Rooster to Website'}
                </button>
              </div>

            </form>

          </div>
        )}

      </main>

    </div>
  );
};

