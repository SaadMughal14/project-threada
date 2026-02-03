
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
            Add New Artifact
          </button>
          <button onClick={onClose} className="p-4 bg-black/5 text-black rounded-full hover:bg-black hover:text-white transition-all">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 md:p-12 no-scrollbar bg-[#FDFCFB]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-20">
            <div className="w-12 h-12 border-4 border-[#D97B8D] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-black uppercase tracking-widest text-[10px]">Accessing Vault...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 opacity-20 text-center">
            <p className="font-black uppercase tracking-[0.5em] text-[12px]">The Vault is Empty.</p>
            <p className="text-[10px] mt-2">Start forging artifacts to populate the menu.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p.id} className="group bg-white border border-black/5 rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition-all duration-700 flex flex-col gap-5">
                <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-black/5">
                  <img src={p.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${p.is_visible ? 'bg-[#D97B8D] text-white' : 'bg-black/60 text-white opacity-40'}`}>
                    {p.is_visible ? 'VISIBLE' : 'HIDDEN'}
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <p className="text-[9px] font-black text-[#D97B8D] uppercase tracking-[0.4em]">{p.category}</p>
                  <h3 className="font-display text-3xl font-black text-[#1C1C1C] uppercase leading-none tracking-tighter truncate">{p.name}</h3>
                  <p className="text-[11px] font-bold text-black/40 line-clamp-2 leading-relaxed uppercase">{p.description}</p>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-20">Price</span>
                    <p className="font-display text-2xl font-black text-[#1C1C1C]">Rs. {p.price}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 pt-5 border-t border-black/5">
                  <button 
                    onClick={() => { setEditingProduct(p); setIsFormOpen(true); }}
                    className="p-4 bg-black/5 rounded-2xl hover:bg-[#D97B8D] hover:text-white transition-all flex items-center justify-center group/btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button 
                    onClick={() => toggleVisibility(p.id, p.is_visible)}
                    className="p-4 bg-black/5 rounded-2xl hover:bg-[#1C1C1C] hover:text-white transition-all flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      {p.is_visible ? (
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      ) : (
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      )}
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="p-4 bg-black/5 rounded-2xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Form Overlay */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[700] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="bg-[#FDFCFB] w-full max-w-2xl rounded-[3.5rem] p-8 md:p-16 overflow-y-auto max-h-[90vh] shadow-[0_50px_100px_rgba(0,0,0,0.5)] space-y-12 no-scrollbar animate-in zoom-in-95 duration-500">
            <div className="flex justify-between items-center">
               <div className="space-y-1">
                 <p className="text-[#D97B8D] font-black uppercase text-[10px] tracking-[0.4em]">Product Sculptor</p>
                 <h2 className="font-display text-5xl font-black text-[#1C1C1C] uppercase tracking-tighter">
                   {editingProduct ? 'Update' : 'Forge'}
                 </h2>
               </div>
               <button onClick={() => setIsFormOpen(false)} className="p-4 bg-black/5 text-black rounded-full hover:bg-red-500 hover:text-white transition-all">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>
            
            <form className="space-y-10" onSubmit={async (e) => {
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
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-black/20">Identity</p>
                  <input name="name" defaultValue={editingProduct?.name} placeholder="ARTIFACT NAME" required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-2xl focus:border-[#D97B8D] transition-colors" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-black/20">The Story</p>
                  <textarea name="description" defaultValue={editingProduct?.description} placeholder="DESCRIBE THE CREATION..." className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-sm h-24 focus:border-[#D97B8D] transition-colors resize-none" />
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-black/20">Value (Rs.)</p>
                    <input name="price" type="number" defaultValue={editingProduct?.price} placeholder="PRICE" required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-2xl focus:border-[#D97B8D] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-black/20">Collection</p>
                    <select name="category" defaultValue={editingProduct?.category || 'Cookies'} className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-lg focus:border-[#D97B8D] transition-colors cursor-pointer appearance-none">
                      <option value="Cookies">Cookies</option>
                      <option value="Brownies">Brownies</option>
                      <option value="Cakes">Cakes</option>
                      <option value="Coffee & Tea">Coffee & Tea</option>
                      <option value="Sides">Sides</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[8px] font-black uppercase tracking-[0.5em] text-black/20">Visual Archetype (URL)</p>
                  <input name="image_url" defaultValue={editingProduct?.image_url} placeholder="https://..." required className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase text-[10px] tracking-widest focus:border-[#D97B8D] transition-colors" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#1C1C1C] text-[#D97B8D] py-8 rounded-[2rem] font-black uppercase tracking-[0.5em] text-[12px] shadow-2xl hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all active:scale-[0.98]">
                {editingProduct ? 'UPDATE ARCHIVE' : 'FORGE ARTIFACT'}
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
