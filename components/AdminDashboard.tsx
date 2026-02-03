
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PizzaProductExtended } from '../constants';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (isOpen) fetchProducts();
  }, [isOpen]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error) setProducts(data || []);
    setLoading(false);
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    const { error } = await supabase.from('products').update({ is_visible: !current }).eq('id', id);
    if (!error) fetchProducts();
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure? This action is irreversible.")) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchProducts();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[600] bg-[#FDFCFB] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header className="p-6 md:p-12 flex justify-between items-end border-b border-black/5 bg-white z-10">
        <div className="space-y-1">
          <p className="font-black text-[#D97B8D] text-[9px] tracking-[0.4em] uppercase">Control Center</p>
          <h1 className="font-display text-4xl md:text-7xl font-black text-[#1C1C1C] leading-none tracking-tighter uppercase">Forge <span className="text-[#D97B8D]">Manager</span></h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => { setEditingProduct(null); setIsFormOpen(true); }}
            className="bg-[#1C1C1C] text-[#D97B8D] px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all"
          >
            Add New Product
          </button>
          <button onClick={onClose} className="p-4 bg-black/5 text-black rounded-full hover:bg-black hover:text-white transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-20">
            <div className="w-12 h-12 border-4 border-[#D97B8D] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Loading Inventory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="group bg-white border border-black/5 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col gap-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-black/5">
                  <img src={p.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${p.is_visible ? 'bg-[#D97B8D] text-white' : 'bg-black text-white opacity-40'}`}>
                    {p.is_visible ? 'Visible' : 'Hidden'}
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[8px] font-black text-[#D97B8D] uppercase tracking-[0.3em]">{p.category}</p>
                  <h3 className="font-display text-2xl font-black text-[#1C1C1C] uppercase leading-none truncate">{p.name}</h3>
                  <p className="text-[10px] font-medium opacity-40 line-clamp-2">{p.description}</p>
                  <p className="font-display text-xl font-black text-[#1C1C1C]">Rs. {p.price}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-black/5">
                  <button 
                    onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                    className="p-3 bg-black/5 rounded-xl hover:bg-[#D97B8D] hover:text-white transition-all flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button 
                    onClick={() => toggleVisibility(p.id, p.is_visible)}
                    className="p-3 bg-black/5 rounded-xl hover:bg-[#1C1C1C] hover:text-white transition-all flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-3 bg-black/5 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[700] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-[#FDFCFB] w-full max-w-2xl rounded-[3rem] p-8 md:p-12 overflow-y-auto max-h-[90vh] shadow-2xl space-y-8 no-scrollbar animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
               <h2 className="font-display text-4xl font-black text-[#1C1C1C] uppercase tracking-tighter">
                 {editingProduct ? 'Edit Artifact' : 'New Artifact'}
               </h2>
               <button onClick={() => setIsFormOpen(false)} className="text-black/20 hover:text-red-500 transition-colors">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>
            
            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const payload = {
                name: fd.get('name'),
                description: fd.get('description'),
                price: fd.get('price'),
                category: fd.get('category'),
                image_url: fd.get('image_url'),
                is_visible: true
              };
              
              const { error } = editingProduct 
                ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
                : await supabase.from('products').insert([payload]);
                
              if (!error) {
                setIsFormOpen(false);
                fetchProducts();
              }
            }}>
              <div className="grid gap-6">
                <input name="name" defaultValue={editingProduct?.name} placeholder="PRODUCT NAME" required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-xl focus:border-[#D97B8D] transition-colors" />
                <textarea name="description" defaultValue={editingProduct?.description} placeholder="STORY / DESCRIPTION" className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-sm h-24 focus:border-[#D97B8D] transition-colors resize-none" />
                <div className="grid grid-cols-2 gap-6">
                  <input name="price" defaultValue={editingProduct?.price} placeholder="PRICE (RS.)" required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-xl focus:border-[#D97B8D] transition-colors" />
                  <select name="category" defaultValue={editingProduct?.category || 'Cookies'} className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-lg focus:border-[#D97B8D] transition-colors cursor-pointer">
                    <option value="Cookies">Cookies</option>
                    <option value="Brownies">Brownies</option>
                    <option value="Cakes">Cakes</option>
                    <option value="Coffee & Tea">Coffee & Tea</option>
                    <option value="Sides">Sides</option>
                  </select>
                </div>
                <input name="image_url" defaultValue={editingProduct?.image_url} placeholder="IMAGE URL (UNSPLASH OR IMGUR)" required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-sm focus:border-[#D97B8D] transition-colors" />
              </div>
              <button type="submit" className="w-full bg-[#1C1C1C] text-[#D97B8D] py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all">
                {editingProduct ? 'UPDATE ARTIFACT' : 'FORGE PRODUCT'}
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
