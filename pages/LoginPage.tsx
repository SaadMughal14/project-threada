import React from 'react';
import { Link } from 'react-router-dom';

export const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col pt-32 pb-20 px-4 items-center justify-center bg-white">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-heading font-black text-4xl uppercase tracking-tighter mb-2">Account</h1>
                    <p className="font-mono text-gray-400 text-xs tracking-widest">
                        SIGN IN TO ACCESS YOUR PROFILE
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                        <input
                            type="email"
                            className="w-full border-b border-black py-2 text-sm focus:outline-none focus:border-gray-300 transition-colors"
                            placeholder="NAME@EXAMPLE.COM"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-gray-500">Password</label>
                        <input
                            type="password"
                            className="w-full border-b border-black py-2 text-sm focus:outline-none focus:border-gray-300 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
                        <label className="flex items-center gap-2 cursor-pointer hover:text-black">
                            <input type="checkbox" className="accent-black" />
                            Remember Me
                        </label>
                        <button type="button" className="hover:text-black">Forgot Password?</button>
                    </div>

                    <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors">
                        Sign In
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-gray-500 mb-4">DON'T HAVE AN ACCOUNT?</p>
                    <Link to="/register" className="inline-block border text-black border-black px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
};
