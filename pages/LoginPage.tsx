import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col md:flex-row pt-20">
            {/* Left: Lifestyle Image (Desktop Only) */}
            <div className="hidden md:block w-1/2 relative bg-gray-100">
                <img
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=2000"
                    alt="Login Lifestyle"
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 bg-black/10"></div>

                {/* Quote or Brand text on image */}
                <div className="absolute bottom-12 left-12 text-white">
                    <h2 className="font-heading font-black text-4xl uppercase leading-none mb-2">Join the <br /> Movement</h2>
                    <p className="font-mono text-xs opacity-80 tracking-widest">SCULPTED BY HEAT</p>
                </div>
            </div>

            {/* Right: Form Section */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-24 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-2">Account</h1>
                        <p className="font-mono text-gray-400 text-xs tracking-widest">
                            PLEASE SIGN IN TO ACCESS YOUR EXCLUSIVE BENEFITS.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-black transition-colors">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                                placeholder="NAME@EXAMPLE.COM"
                            />
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-focus-within:text-black transition-colors">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder-gray-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer hover:text-black transition-colors">
                                <input type="checkbox" className="accent-black w-3 h-3" />
                                Remember Me
                            </label>
                            <button type="button" className="hover:text-black transition-colors">Forgot Password?</button>
                        </div>

                        <button className="w-full bg-black text-white py-5 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors mt-8">
                            Sign In
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col items-center gap-4">
                        <p className="text-xs text-gray-500">NOT A MEMBER YET?</p>
                        <Link to="/register" className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
                            Create an Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
