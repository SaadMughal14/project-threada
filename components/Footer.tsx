import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer className="bg-black text-white pt-20 pb-8 px-4 md:px-6 mt-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-b border-white/20 pb-12">
                {/* Brand */}
                <div>
                    <h2 className="font-heading text-3xl uppercase font-black mb-6">Threada</h2>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">
                        128 Market St. 20193 <br /> San Fransisco California
                    </p>
                    <div className="flex gap-4 text-lg">
                        <i className="cursor-pointer hover:text-gray-300">fb</i>
                        <i className="cursor-pointer hover:text-gray-300">tw</i>
                        <i className="cursor-pointer hover:text-gray-300">in</i>
                        <i className="cursor-pointer hover:text-gray-300">ig</i>
                    </div>
                </div>

                {/* Management */}
                <div>
                    <h4 className="text-sm font-bold uppercase mb-4 text-gray-500">Management</h4>
                    <ul className="space-y-3 text-xs">
                        <li className="hover:text-gray-300 cursor-pointer">Features</li>
                        <li className="hover:text-gray-300 cursor-pointer">Blog</li>
                        <li className="hover:text-gray-300 cursor-pointer">Careers</li>
                        <li className="hover:text-gray-300 cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>

                {/* Minimalist */}
                <div>
                    <h4 className="text-sm font-bold uppercase mb-4 text-gray-500">Minimalist</h4>
                    <ul className="space-y-3 text-xs">
                        <li className="hover:text-gray-300 cursor-pointer">Classic</li>
                        <li className="hover:text-gray-300 cursor-pointer">Retro</li>
                        <li className="hover:text-gray-300 cursor-pointer">Modern</li>
                        <li className="hover:text-gray-300 cursor-pointer">Sporty</li>
                        <li className="hover:text-gray-300 cursor-pointer">Best Seller</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-sm font-bold uppercase mb-4 text-gray-500">Contact Us</h4>
                    <p className="text-xs mb-6">hello@threada.com</p>

                    <h4 className="text-sm font-bold uppercase mb-4 text-gray-500">Get the App</h4>
                    <button className="bg-white text-black px-4 py-2 text-xs font-bold uppercase w-full max-w-[150px]">
                        Download App
                    </button>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest">
                <p>&copy; 2026 Threada • All rights reserved.</p>
                <p>Terms and Conditions</p>
            </div>
        </footer>
    );
};
