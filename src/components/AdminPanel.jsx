'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Users, Phone, ArrowLeft, MoreVertical, ChevronDown, ChevronUp, Search, Trash2, Copy, Mail, 
  Calendar, Filter, BarChart2, User as UserIcon, Loader, AlertCircle, ExternalLink, Menu, X, DollarSign, Building, 
  Briefcase, FileText, Download, Check, CheckSquare, Square, Trash, AlertTriangle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { database } from '@/lib/firebase';
import { ref, get, remove, update } from 'firebase/database';
import { Toaster, toast } from 'react-hot-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays } from 'date-fns';
import Image from 'next/image';
import { copyToClipboard, exportToJSON, exportToPDF } from '@/lib/clipboard';

// --- CEO & Fetcher Setup ---
const ceoInfo = {
  name: 'Mausi',
  title: 'Founder & CEO, VidVerse',
};

const fetchSubscribers = async () => {
  const snapshot = await get(ref(database, 'subscribers'));
  return snapshot.exists() ? Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })) : [];
};

const fetchDiscoveryCalls = async () => {
  const snapshot = await get(ref(database, 'discoverycalls'));
  return snapshot.exists() ? Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value })) : [];
};

const deleteSubscriber = async (subscriberId) => {
  await remove(ref(database, `subscribers/${subscriberId}`));
};

const deleteDiscoveryCall = async (callId) => {
  await remove(ref(database, `discoverycalls/${callId}`));
};

const markDiscoveryCallDone = async (callId) => {
  await update(ref(database, `discoverycalls/${callId}`), {
    status: 'completed',
    completedAt: new Date().toISOString()
  });
};

// --- Main Admin Panel Component ---
const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Close sidebar on smaller screens by default
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardTab />;
      case 'subscribers': return <SubscribersTab />;
      case 'discovery-calls': return <DiscoveryCallsTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans flex antialiased">
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { 
            background: '#000000', 
            color: '#e5e5e5', 
            border: '1px solid hsl(var(--gold-DEFAULT))',
            borderRadius: '12px'
          } 
        }} 
      />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Header_Component_For_Admin_Panel activeTab={activeTab} onMenuClick={() => setSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Reusable & Helper Components ---
const Sidebar = ({ activeTab, setActiveTab, isOpen, setOpen }) => (
  <aside className={`fixed top-0 left-0 h-full w-64 bg-black p-4 flex flex-col justify-between border-r border-gold-DEFAULT/30 z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative`}>
    <div>
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <Image src="/logo/vidverse.svg"  alt="VidVerse Logo" width={32} height={32} />
          <span className="text-xl font-bold text-white">Admin</span>
        </div>
        <button onClick={() => setOpen(false)} className="md:hidden text-neutral-400 hover:text-gold-DEFAULT transition-colors">
          <X size={20} />
        </button>
      </div>
      <nav className="flex flex-col gap-2">
        <TabButton icon={<LayoutDashboard />} label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); if (window.innerWidth < 768) setOpen(false); }} />
        <TabButton icon={<Users />} label="Subscribers" isActive={activeTab === 'subscribers'} onClick={() => { setActiveTab('subscribers'); if (window.innerWidth < 768) setOpen(false); }} />
        <TabButton icon={<Phone />} label="Discovery Calls" isActive={activeTab === 'discovery-calls'} onClick={() => { setActiveTab('discovery-calls'); if (window.innerWidth < 768) setOpen(false); }} />
      </nav>
    </div>
    <div className="border-t border-gold-DEFAULT/30 pt-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-black border border-gold-DEFAULT/20">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-r from-gold-light to-gold-DEFAULT rounded-full flex items-center justify-center"
              whileHover={{ 
                scale: 1.1,
                rotate: 360
              }}
              transition={{ 
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
                <UserIcon className="text-black" size={20} />
            </motion.div>
            <div>
                <p className="font-bold text-white text-sm">{ceoInfo.name}</p>
                <p className="text-xs text-gold-DEFAULT">{ceoInfo.title}</p>
            </div>
        </div>
        <TabButton icon={<ArrowLeft />} label="Back to Site" isAction onClick={() => window.location.href = '/'} />
    </div>
  </aside>
);

const Header_Component_For_Admin_Panel = ({ activeTab, onMenuClick }) => {
  const titles = {
    dashboard: 'Dashboard',
    subscribers: 'Subscribers',
    'discovery-calls': 'Discovery Calls'
  };

  return (
    <header className="sticky top-0 bg-black p-4 border-b border-gold-DEFAULT/30 flex items-center md:hidden z-40">
      <button onClick={onMenuClick} className="text-neutral-300 hover:text-gold-DEFAULT mr-4 transition-colors">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-white">{titles[activeTab]}</h1>
    </header>
  );
};

const TabButton = ({ icon, label, isActive, onClick, isAction = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-200 ${isAction ? 'mt-4 text-neutral-400 hover:bg-neutral-950 hover:text-white' : isActive ? 'bg-golden-gradient text-black shadow-lg shadow-amber-500/20' : 'text-neutral-400 hover:bg-neutral-950/70 hover:text-white'}`}>
    {React.cloneElement(icon, { size: 18 })}
    <span>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value, isLoading, trend }) => (
    <motion.div 
        className="bg-black p-6 rounded-xl border border-gold-DEFAULT/20 flex flex-col justify-between h-full hover:border-gold-DEFAULT/40 transition-all duration-300 group"
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
        <div className="flex justify-between items-center text-gold-DEFAULT/70">
            <span className="font-medium">{label}</span>
            <div className="p-2 bg-gold-DEFAULT/10 rounded-lg group-hover:bg-gold-DEFAULT/20 transition-colors">
                {React.cloneElement(icon, { size: 20, className: "text-gold-DEFAULT" })}
            </div>
        </div>
        <div className="mt-6">
            {isLoading ? (
                <div className="flex items-center gap-2">
                    <Loader className="animate-spin text-gold-DEFAULT" size={20} />
                    <span className="text-gold-DEFAULT/60">Loading...</span>
                </div>
            ) : (
                <div>
                    <p className="text-3xl font-bold text-white mb-1">{value}</p>
                    {trend && (
                        <p className={`text-sm flex items-center gap-1 ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                            {trend.positive ? '↗' : '↘'} {trend.value}
                        </p>
                    )}
                </div>
            )}
        </div>
    </motion.div>
);

const LoadingSpinner = () => <div className="w-full h-64 flex justify-center items-center"><Loader className="animate-spin text-amber-500" size={40} /></div>;
const ErrorMessage = ({ message }) => <div className="w-full h-64 flex justify-center items-center text-red-400 bg-red-900/20 border border-red-500/30 rounded-lg"><AlertCircle className="mr-2"/> {message}</div>;
const formatDate = (timestamp) => timestamp ? format(new Date(timestamp), 'PPpp') : 'No date';

// --- Dashboard Tab ---
const DashboardTab = () => {
  const { data: subscribers, isLoading: subsLoading, isError: subsError } = useQuery({ queryKey: ['subscribers'], queryFn: fetchSubscribers });
  const { data: discoveryCalls, isLoading: callsLoading, isError: callsError } = useQuery({ queryKey: ['discoveryCalls'], queryFn: fetchDiscoveryCalls });

  const chartData = useMemo(() => {
    if (!subscribers || !discoveryCalls) return [];
    const days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const subsCount = subscribers.filter(d => d.subscribedAt && format(new Date(d.subscribedAt), 'yyyy-MM-dd') === dayStr).length;
      const callsCount = discoveryCalls.filter(d => d.submittedAt && format(new Date(d.submittedAt), 'yyyy-MM-dd') === dayStr).length;
      
      return {
        name: format(day, 'MMM d'),
        Subscribers: subsCount,
        'Discovery Calls': callsCount,
      };
    });
  }, [subscribers, discoveryCalls]);

  const conversionRate = useMemo(() => {
    if (!subscribers || !discoveryCalls || subscribers.length === 0) return 0;
    return Math.round((discoveryCalls.length / subscribers.length) * 100);
  }, [subscribers, discoveryCalls]);

  const completedCalls = useMemo(() => {
    if (!discoveryCalls) return 0;
    return discoveryCalls.filter(call => call.status === 'completed').length;
  }, [discoveryCalls]);

  if (subsError || callsError) {
    return <ErrorMessage message="Failed to load dashboard data. Please check permissions." />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ delay: 0.1 }}
      className="flex flex-col gap-8"
    >
      <header className="hidden md:flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gold-DEFAULT/70">Live metrics and activity for VidVerse</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gold-DEFAULT/60">Last updated</p>
          <p className="text-gold-DEFAULT font-medium">{format(new Date(), 'MMM d, h:mm a')}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users />} 
          label="Total Subscribers" 
          value={subscribers?.length ?? 0} 
          isLoading={subsLoading}
          trend={{ positive: true, value: '+12% this week' }}
        />
        <StatCard 
          icon={<Phone />} 
          label="Discovery Calls" 
          value={discoveryCalls?.length ?? 0} 
          isLoading={callsLoading}
          trend={{ positive: true, value: '+8% this week' }}
        />
        <StatCard 
          icon={<Check />} 
          label="Completed Calls" 
          value={completedCalls} 
          isLoading={callsLoading}
        />
        <StatCard 
          icon={<BarChart2 />} 
          label="Conversion Rate" 
          value={`${conversionRate}%`} 
          isLoading={subsLoading || callsLoading}
        />
      </div>

      <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gold-DEFAULT/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Activity Overview</h3>
            <p className="text-gold-DEFAULT/70 text-sm">Performance over the last 7 days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gold-light to-gold-DEFAULT"></div>
              <span className="text-sm text-gold-DEFAULT">Subscribers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"></div>
              <span className="text-sm text-blue-400">Discovery Calls</span>
            </div>
          </div>
        </div>
        {(subsLoading || callsLoading) ? <LoadingSpinner /> : (
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(212 175 55 / 0.1)" />
                <XAxis 
                  dataKey="name" 
                  stroke="rgb(212 175 55 / 0.7)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgb(212 175 55 / 0.7)' }}
                />
                <YAxis 
                  stroke="rgb(212 175 55 / 0.7)" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'rgb(212 175 55 / 0.7)' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    borderColor: 'rgb(212 175 55 / 0.3)',
                    backdropFilter: 'blur(8px)',
                    borderRadius: '12px',
                    color: '#ffffff',
                    border: '1px solid rgb(212 175 55 / 0.3)'
                  }}
                  cursor={{ fill: 'rgba(212, 175, 55, 0.1)' }}
                />
                <Bar 
                  dataKey="Subscribers" 
                  fill="url(#subscribersGradient)" 
                  name="Subscribers" 
                  radius={[4, 4, 0, 0]}
                  strokeWidth={2}
                  stroke="rgb(212 175 55)"
                />
                <Bar 
                  dataKey="Discovery Calls" 
                  fill="url(#callsGradient)" 
                  name="Discovery Calls" 
                  radius={[4, 4, 0, 0]}
                  strokeWidth={2}
                  stroke="rgb(59 130 246)"
                />
                <defs>
                  <linearGradient id="subscribersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(212 175 55)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="rgb(212 175 55)" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="callsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(59 130 246)" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="rgb(59 130 246)" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gold-DEFAULT/20">
          <h3 className="text-lg font-bold text-white mb-4">Recent Subscribers</h3>
          <div className="space-y-3">
            {subscribers?.slice(0, 5).map((sub, index) => (
              <div key={sub.id} className="flex items-center gap-3 p-3 bg-black/60 rounded-lg border border-gold-DEFAULT/10">
                <div className="w-8 h-8 bg-gradient-to-r from-gold-light to-gold-DEFAULT rounded-full flex items-center justify-center text-black font-bold text-sm">
                  {sub.email[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium truncate">{sub.email}</p>
                  <p className="text-xs text-gold-DEFAULT/60">{formatDate(sub.subscribedAt)}</p>
                </div>
              </div>
            )) || <p className="text-gold-DEFAULT/60">No subscribers yet</p>}
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gold-DEFAULT/20">
          <h3 className="text-lg font-bold text-white mb-4">Recent Discovery Calls</h3>
          <div className="space-y-3">
            {discoveryCalls?.slice(0, 5).map((call, index) => {
              const fullName = `${call.firstName || ''} ${call.lastName || ''}`.trim() || 'Anonymous';
              return (
                <div key={call.id} className="flex items-center gap-3 p-3 bg-black/60 rounded-lg border border-gold-DEFAULT/10">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {fullName[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{fullName}</p>
                    <p className="text-xs text-blue-400/70">{call.email || 'No email'}</p>
                    <p className="text-xs text-gold-DEFAULT/60">{formatDate(call.submittedAt)}</p>
                  </div>
                  {call.status === 'completed' && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="text-white" size={12} />
                    </div>
                  )}
                </div>
              );
            }) || <p className="text-gold-DEFAULT/60">No discovery calls yet</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Subscribers Tab ---
const SubscribersTab = () => {
  const queryClient = useQueryClient();
  const { data: subscribers, isLoading, error } = useQuery({ queryKey: ['subscribers'], queryFn: fetchSubscribers });
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState({ key: 'subscribedAt', order: 'desc' });
  const [selected, setSelected] = useState([]);

  const deleteMutation = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => remove(ref(database, `subscribers/${id}`)))),
    onSuccess: () => {
      toast.success('Subscriber(s) deleted.');
      queryClient.invalidateQueries({ queryKey: ['subscribers'] });
      setSelected([]);
    },
    onError: () => toast.error('Failed to delete subscriber(s).'),
  });

  const handleDelete = () => {
    if (selected.length === 0) return;
    toast((t) => (
      <div className='text-white bg-black p-4 rounded-lg shadow-lg border border-gold-DEFAULT/30'>
        <p className='mb-3 font-semibold'>Delete {selected.length} subscriber(s)?</p>
        <div className='flex gap-2'>
          <button onClick={() => { deleteMutation.mutate(selected); toast.dismiss(t.id); }} className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm w-full'>Delete</button>
          <button onClick={() => toast.dismiss(t.id)} className='bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded text-sm w-full'>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleExport = (format) => {
    const subscribersData = filteredAndSortedSubscribers.map(sub => ({
      email: sub.email,
      subscribedAt: formatDate(sub.subscribedAt)
    }));

    if (format === 'json') {
      exportToJSON(subscribersData, 'subscribers');
    } else if (format === 'pdf') {
      exportToPDF(subscribersData, 'Subscribers Report', 'subscribers');
    }
  };

  const handleCopyEmails = () => {
    const emails = selected.map(id => filteredAndSortedSubscribers.find(s => s.id === id)?.email).filter(Boolean);
    if (emails.length > 0) {
      copyToClipboard(emails.join(', '), 'Emails');
    }
  };

  const filteredAndSortedSubscribers = useMemo(() => {
    if (!subscribers) return [];
    return subscribers
      .filter(s => s.email.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        const aVal = a[sort.key];
        const bVal = b[sort.key];
        if (aVal < bVal) return sort.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return sort.order === 'asc' ? 1 : -1;
        return 0;
      });
  }, [subscribers, searchTerm, sort]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribers</h1>
          <p className="text-gold-DEFAULT/70 text-sm mt-1">{filteredAndSortedSubscribers.length} total subscribers</p>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-gold-DEFAULT/20">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-DEFAULT/60" size={18} />
            <input 
              type="text" 
              placeholder="Search by email..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="w-full lg:w-80 bg-black border border-gold-DEFAULT/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gold-DEFAULT/50 focus:outline-none focus:ring-2 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT transition-all" 
            />
          </div>
          <div className={`flex items-center gap-2 transition-opacity ${selected.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => handleExport('json')}
              className="p-2 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              title="Export JSON"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="p-2 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
              title="Export PDF"
            >
              <FileText size={18} />
            </button>
            <button 
              onClick={handleCopyEmails} 
              className="p-2 bg-gold-DEFAULT/20 border border-gold-DEFAULT/30 hover:bg-gold-DEFAULT/30 rounded-lg text-gold-DEFAULT hover:text-gold-light transition-colors"
              title="Copy Emails"
            >
              <Copy size={18} />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
              title="Delete Selected"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-gold-DEFAULT/20">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    onChange={e => setSelected(e.target.checked ? filteredAndSortedSubscribers.map(s => s.id) : [])} 
                    className="w-4 h-4 bg-black border-gold-DEFAULT/30 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-2"
                  />
                </th>
                <th className="p-4 text-sm font-semibold text-gold-DEFAULT cursor-pointer hover:text-gold-light transition-colors"
                    onClick={() => setSort({ key: 'email', order: sort.key === 'email' && sort.order === 'asc' ? 'desc' : 'asc' })}>
                  Email {sort.key === 'email' && (sort.order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-sm font-semibold text-gold-DEFAULT cursor-pointer hover:text-gold-light transition-colors"
                    onClick={() => setSort({ key: 'subscribedAt', order: sort.key === 'subscribedAt' && sort.order === 'asc' ? 'desc' : 'asc' })}>
                  Subscribed At {sort.key === 'subscribedAt' && (sort.order === 'asc' ? '↑' : '↓')}
                </th>
                <th className="p-4 text-sm font-semibold text-gold-DEFAULT">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedSubscribers.map(sub => (
                <motion.tr 
                  key={sub.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gold-DEFAULT/10 hover:bg-gold-DEFAULT/5 transition-colors"
                >
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      checked={selected.includes(sub.id)} 
                      onChange={e => setSelected(e.target.checked ? [...selected, sub.id] : selected.filter(id => id !== sub.id))} 
                      className="w-4 h-4 bg-black border-gold-DEFAULT/30 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-2"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gold-light to-gold-DEFAULT rounded-full flex items-center justify-center text-black font-bold text-sm">
                        {sub.email[0].toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{sub.email}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gold-DEFAULT/70">{formatDate(sub.subscribedAt)}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(sub.email, 'Email')}
                        className="p-1 text-gold-DEFAULT/60 hover:text-gold-DEFAULT transition-colors hover:bg-gold-DEFAULT/10 rounded"
                      >
                        <Copy size={14} />
                      </button>
                      <a 
                        href={`mailto:${sub.email}`}
                        className="p-1 text-blue-400/60 hover:text-blue-400 transition-colors hover:bg-blue-400/10 rounded"
                      >
                        <Mail size={14} />
                      </a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          
          {filteredAndSortedSubscribers.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto mb-4 text-gold-DEFAULT/40" size={48} />
              <p className="text-gold-DEFAULT/60 text-lg">No subscribers found</p>
              <p className="text-gold-DEFAULT/40 text-sm mt-1">Subscribers will appear here when users sign up for your newsletter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Discovery Calls Tab ---
const DiscoveryCallsTab = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery({ queryKey: ['discoveryCalls'], queryFn: fetchDiscoveryCalls });
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);

  const markDoneMutation = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => markDiscoveryCallDone(id))),
    onSuccess: () => {
      toast.success('Discovery call(s) marked as completed.');
      queryClient.invalidateQueries({ queryKey: ['discoveryCalls'] });
      setSelected([]);
    },
    onError: () => toast.error('Failed to mark discovery call(s) as completed.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids) => Promise.all(ids.map(id => deleteDiscoveryCall(id))),
    onSuccess: () => {
      toast.success('Discovery call(s) deleted.');
      queryClient.invalidateQueries({ queryKey: ['discoveryCalls'] });
      setSelected([]);
    },
    onError: () => toast.error('Failed to delete discovery call(s).'),
  });

  const handleMarkDone = () => {
    if (selected.length === 0) return;
    toast((t) => (
      <div className='text-white bg-neutral-800 p-4 rounded-lg shadow-lg border border-gold-DEFAULT/30'>
        <p className='mb-3 font-semibold'>Mark {selected.length} call(s) as completed?</p>
        <div className='flex gap-2'>
          <button onClick={() => { markDoneMutation.mutate(selected); toast.dismiss(t.id); }} className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm w-full'>Mark Done</button>
          <button onClick={() => toast.dismiss(t.id)} className='bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded text-sm w-full'>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleDelete = () => {
    if (selected.length === 0) return;
    toast((t) => (
      <div className='text-white bg-neutral-800 p-4 rounded-lg shadow-lg border border-gold-DEFAULT/30'>
        <p className='mb-3 font-semibold'>Delete {selected.length} call(s)?</p>
        <div className='flex gap-2'>
          <button onClick={() => { deleteMutation.mutate(selected); toast.dismiss(t.id); }} className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm w-full'>Delete</button>
          <button onClick={() => toast.dismiss(t.id)} className='bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-4 rounded text-sm w-full'>Cancel</button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const handleExport = (format) => {
    const callsData = filteredData.map(call => ({
      name: `${call.firstName || ''} ${call.lastName || ''}`.trim() || 'N/A',
      email: call.email || 'N/A',
      phone: call.phone || 'N/A',
      description: call.description || 'N/A',
      socialLink: call.socialLink || 'N/A',
      sellsOnline: call.sellsOnline || 'N/A',
      monthlyRevenue: call.monthlyRevenue || 'N/A',
      bottlenecks: (() => {
        const bottlenecks = [];
        if (Array.isArray(call.bottlenecks) && call.bottlenecks.length > 0) {
          const standardBottlenecks = call.bottlenecks.filter(b => b !== 'Custom');
          bottlenecks.push(...standardBottlenecks);
          
          if (call.bottlenecks.includes('Custom') && call.customBottleneck) {
            bottlenecks.push(`Custom: ${call.customBottleneck}`);
          } else if (call.bottlenecks.includes('Custom')) {
            bottlenecks.push('Custom (no details provided)');
          }
        }
        return bottlenecks.length > 0 ? bottlenecks.join(', ') : 'N/A';
      })(),
      customBottleneck: call.customBottleneck || 'N/A',
      canInvest: call.canInvest || 'N/A',
      meetingTime: call.meetingTime ? formatDate(call.meetingTime) : 'N/A',
      submittedAt: formatDate(call.submittedAt),
      status: call.status || 'pending'
    }));

    if (format === 'json') {
      exportToJSON(callsData, 'discovery-calls');
    } else if (format === 'pdf') {
      exportToPDF(callsData, 'Discovery Calls Report', 'discovery-calls');
    }
  };

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter(call => {
      const fullName = `${call.firstName || ''} ${call.lastName || ''}`.toLowerCase();
      const email = (call.email || '').toLowerCase();
      const searchLower = searchTerm.toLowerCase();
      return fullName.includes(searchLower) || email.includes(searchLower);
    });
  }, [data, searchTerm]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message="Failed to load discovery calls." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Discovery Call Requests</h2>
          <p className="text-gold-DEFAULT/70 text-sm mt-1">{filteredData.length} total calls</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full lg:w-80 bg-black border border-gold-DEFAULT/30 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-neutral-500 focus:ring-2 focus:ring-gold-DEFAULT focus:border-gold-DEFAULT transition-all duration-200"
            />
          </div>
          <div className={`flex items-center gap-2 transition-opacity ${selected.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              onClick={() => handleExport('json')}
              className="p-2 bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
              title="Export JSON"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => handleExport('pdf')}
              className="p-2 bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 rounded-lg text-purple-400 hover:text-purple-300 transition-colors"
              title="Export PDF"
            >
              <FileText size={18} />
            </button>
            <button 
              onClick={handleMarkDone}
              className="p-2 bg-green-600/20 border border-green-500/30 hover:bg-green-600/30 rounded-lg text-green-400 hover:text-green-300 transition-colors"
              title="Mark as Done"
            >
              <Check size={18} />
            </button>
            <button 
              onClick={handleDelete}
              className="p-2 bg-red-600/20 border border-red-500/30 hover:bg-red-600/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
              title="Delete Selected"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredData.length > 0 ? (
          <>
            <div className="flex items-center gap-3 p-3 bg-black/40 border border-gold-DEFAULT/20 rounded-lg">
              <input 
                type="checkbox" 
                onChange={e => setSelected(e.target.checked ? filteredData.map(c => c.id) : [])}
                className="w-4 h-4 bg-black border-gold-DEFAULT/30 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-2"
              />
              <span className="text-sm text-neutral-400">
                {selected.length > 0 ? `${selected.length} selected` : 'Select all'}
              </span>
            </div>
            {filteredData.map(call => (
              <CallCard key={call.id} call={call} expanded={expandedId === call.id} onToggle={() => setExpandedId(expandedId === call.id ? null : call.id)} selected={selected.includes(call.id)} onSelect={(checked) => setSelected(checked ? [...selected, call.id] : selected.filter(id => id !== call.id))} />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <Phone className="mx-auto mb-4 text-neutral-600" size={48} />
            <p className="text-neutral-500 text-lg">No discovery calls found</p>
            <p className="text-neutral-600 text-sm mt-1">Calls will appear here when customers book discovery sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};

const CallCard = ({ call, expanded, onToggle, selected, onSelect }) => {
  const fullName = `${call.firstName || ''} ${call.lastName || ''}`.trim() || 'Anonymous';
  const isCompleted = call.status === 'completed';
  
  return (
    <motion.div 
      layout 
      className={`bg-neutral-950 rounded-xl border border-gold-DEFAULT/20 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold-DEFAULT/10 hover:border-gold-DEFAULT/40 ${isCompleted ? 'opacity-60' : ''}`}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-3 p-4">
        <input 
          type="checkbox" 
          checked={selected}
          onChange={(e) => onSelect(e.target.checked)}
          className="w-4 h-4 bg-neutral-900 border-gold-DEFAULT/30 rounded text-gold-DEFAULT focus:ring-gold-DEFAULT focus:ring-2"
        />
        <button 
          onClick={onToggle}
          className="flex-1 flex justify-between items-center text-left hover:bg-neutral-800/50 transition-all duration-200 p-3 -m-3 rounded-lg group"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-gold-light to-gold-DEFAULT rounded-full flex items-center justify-center">
                <UserIcon className="text-black" size={20} />
              </div>
              {isCompleted && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="text-white" size={12} />
                </div>
              )}
            </div>
            <div>
              <p className="font-semibold text-white">{fullName}</p>
              <p className="text-sm text-gold-DEFAULT/70">{call.email || 'No email'}</p>
              {call.description && <p className="text-xs text-neutral-500 mt-1">{call.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {call.meetingTime && (
              <div className="text-right">
                <p className="text-xs text-neutral-400">Meeting</p>
                <p className="text-sm text-white">{format(new Date(call.meetingTime), 'MMM d, h:mm a')}</p>
              </div>
            )}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} className="text-gold-DEFAULT">
              <ChevronDown size={20} />
            </motion.div>
          </div>
        </button>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="px-4 pb-4 border-t border-gold-DEFAULT/20"
          >
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoItem icon={<UserIcon />} label="Full Name" value={fullName} onCopy={() => copyToClipboard(fullName, 'Name')} />
              <InfoItem icon={<Mail />} label="Email" value={call.email || 'N/A'} onCopy={() => copyToClipboard(call.email, 'Email')} isLink={call.email ? `mailto:${call.email}` : false} />
              <InfoItem icon={<Phone />} label="Phone" value={call.phone || 'N/A'} onCopy={() => copyToClipboard(call.phone, 'Phone')} isLink={call.phone ? `tel:${call.phone}` : false} />
              <InfoItem icon={<Briefcase />} label="Description" value={call.description || 'N/A'} />
              <InfoItem icon={<ExternalLink />} label="Social Link" value={call.socialLink || 'N/A'} isLink={call.socialLink} />
              <InfoItem icon={<BarChart2 />} label="Sells Online" value={call.sellsOnline || 'N/A'} />
              <InfoItem icon={<DollarSign />} label="Monthly Revenue" value={call.monthlyRevenue || 'N/A'} />
              <InfoItem icon={<Calendar />} label="Meeting Time" value={call.meetingTime ? formatDate(call.meetingTime) : 'N/A'} />
              <InfoItem icon={<Calendar />} label="Submitted" value={formatDate(call.submittedAt)} />
              <InfoItem icon={<DollarSign />} label="Can Invest" value={call.canInvest || 'N/A'} />
              <div className="md:col-span-2">
                <InfoItem 
                  icon={<AlertCircle />} 
                  label="Bottlenecks" 
                  isLongText={true}
                  value={(() => {
                    const bottlenecks = [];
                    if (Array.isArray(call.bottlenecks) && call.bottlenecks.length > 0) {
                      // Add all selected bottlenecks except 'Custom'
                      const standardBottlenecks = call.bottlenecks.filter(b => b !== 'Custom');
                      bottlenecks.push(...standardBottlenecks);
                      
                      // If 'Custom' is selected and there's custom text, add it
                      if (call.bottlenecks.includes('Custom') && call.customBottleneck) {
                        bottlenecks.push(`Custom: ${call.customBottleneck}`);
                      } else if (call.bottlenecks.includes('Custom')) {
                        bottlenecks.push('Custom (no details provided)');
                      }
                    }
                    return bottlenecks.length > 0 ? bottlenecks.join(', ') : 'N/A';
                  })()} 
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InfoItem = ({ icon, label, value, onCopy, isLink = false, isLongText = false }) => {
  const handleCopy = () => {
    if(onCopy && value && value !== 'N/A') {
      onCopy();
      toast.success(`${label} copied!`);
    }
  };

  const displayValue = value || 'N/A';

  return (
    <div className="bg-black/60 border border-gold-DEFAULT/20 p-3 rounded-lg flex items-start gap-3 hover:border-gold-DEFAULT/40 transition-colors">
      <div className="text-gold-DEFAULT mt-1">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gold-DEFAULT/70 mb-1 font-medium">{label}</p>
        <div className="flex items-start justify-between gap-2">
          {isLink && displayValue !== 'N/A' ? 
            <a 
              href={isLink.startsWith('http') ? isLink : `https://${displayValue}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-gold-DEFAULT transition-colors flex-1 underline decoration-gold-DEFAULT/50 hover:decoration-gold-DEFAULT break-words"
            >
              {displayValue}
            </a> : 
            <p className={`text-white flex-1 ${isLongText ? 'break-words whitespace-pre-wrap' : 'truncate'}`}>
              {displayValue}
            </p>
          }
          {onCopy && displayValue !== 'N/A' && (
            <button 
              onClick={handleCopy} 
              className="text-gold-DEFAULT/60 hover:text-gold-DEFAULT transition-colors flex-shrink-0 p-1 hover:bg-gold-DEFAULT/10 rounded"
            >
              <Copy size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
