
import React, { useState, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { supabase } from '../lib/supabase';

interface AuthOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any) => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useGSAP(() => {
    if (isOpen) {
      gsap.to(containerRef.current, { x: 0, duration: 0.8, ease: "expo.out" });
    } else {
      gsap.to(containerRef.current, { x: '100%', duration: 0.6, ease: "power4.in" });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (signUpError) throw signUpError;
        
        if (data.user) {
          // Manually insert profile since triggers are hard to setup via chat
          await supabase.from('profiles').insert([
            { id: data.user.id, email: email, role: role }
          ]);
        }
        
        alert("Account created! Please verify your email if required or proceed to log in.");
        setMode('login');
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) throw signInError;
        
        // Fetch full profile to verify role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        onLoginSuccess({ ...data.user, profile });
        onClose();
      }
    } catch (err: any) {
      setError(err.message || "An authentication error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={containerRef} className="fixed inset-0 z-[500] bg-[#1C1C1C] transform translate-x-full flex flex-col md:flex-row shadow-[-50px_0_100px_rgba(0,0,0,0.5)]">
      {/* Left Side: Brand Visual */}
      <div className="hidden md:flex flex-1 bg-[#D97B8D] items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <span key={i} className="absolute font-display text-9xl font-black uppercase text-[#1C1C1C]" style={{ top: `${i * 10}%`, left: `${(i % 5) * 20}%`, transform: 'rotate(-20deg)' }}>GRAVITY</span>
          ))}
        </div>
        <div className="relative z-10 text-[#1C1C1C] space-y-6">
          <h1 className="font-display text-8xl font-black leading-[0.8] tracking-tighter uppercase italic">Join the<br/>Studio</h1>
          <p className="font-black uppercase tracking-[0.4em] text-[12px] opacity-60">Sculpted by Heat. Defined by Gravity.</p>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 bg-[#FDFCFB] p-8 md:p-24 flex flex-col justify-center relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-4 bg-[#1C1C1C] text-white rounded-full hover:bg-[#D97B8D] transition-all active:scale-90">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        <div className="max-w-md w-full mx-auto space-y-12">
          <div className="space-y-4">
            <div className="flex gap-4">
              <button onClick={() => setRole('customer')} className={`font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-full transition-all ${role === 'customer' ? 'bg-[#D97B8D] text-white' : 'text-black/20 hover:text-black'}`}>CUSTOMER</button>
              <button onClick={() => setRole('admin')} className={`font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-full transition-all ${role === 'admin' ? 'bg-[#1C1C1C] text-white' : 'text-black/20 hover:text-black'}`}>ADMIN PANEL</button>
            </div>
            <h2 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-[#1C1C1C]">
              {mode === 'login' ? 'Welcome' : 'Sign Up'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20">Email Address</p>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase tracking-widest text-lg focus:border-[#D97B8D] transition-colors" 
              />
            </div>
            <div className="space-y-2">
              <p className="text-[8px] font-black uppercase tracking-[0.4em] text-black/20">Secret Key</p>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-transparent border-b-2 border-black/10 p-4 font-black uppercase tracking-widest text-lg focus:border-[#D97B8D] transition-colors" 
              />
            </div>

            {error && <p className="text-[#D97B8D] text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>}

            <button 
              disabled={isLoading}
              className="w-full bg-[#1C1C1C] text-[#D97B8D] py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] shadow-2xl hover:bg-[#D97B8D] hover:text-[#1C1C1C] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'WORKING...' : mode === 'login' ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="pt-8 flex flex-col items-center gap-4">
            <button 
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-[#D97B8D] transition-colors underline underline-offset-8"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
            {role === 'admin' && (
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#D97B8D] text-center max-w-[200px]">Unauthorized access to the admin forge is strictly monitored.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthOverlay;
