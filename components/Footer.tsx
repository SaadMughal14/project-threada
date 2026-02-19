import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, X } from 'lucide-react';
import { InfoModal } from './InfoModal';

export const Footer: React.FC = () => {
    const [modalInfo, setModalInfo] = useState<{ title: string; content: string } | null>(null);

    const openModal = (title: string, content: string) => {
        setModalInfo({ title, content });
    };

    return (
        <footer className="bg-black text-white pt-16 pb-8 px-4 md:px-12 mt-20 relative z-40">
            {modalInfo && <InfoModal title={modalInfo.title} content={modalInfo.content} onClose={() => setModalInfo(null)} />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-16 border-b border-white/20 pb-12">
                {/* Brand */}
                <div>
                    <img src="/logo1.png" alt="Threada Logo" className="h-12 w-auto mb-6 invert brightness-0" />
                    <p className="text-xs text-gray-400 leading-relaxed mb-6 font-light">
                        128 Market St. 20193 <br /> San Fransisco California
                    </p>
                    <div className="flex gap-6 text-gray-400">
                        <Facebook className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <Twitter className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <Linkedin className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                        <Instagram className="w-4 h-4 cursor-pointer hover:text-white transition-colors" />
                    </div>
                </div>

                {/* Management */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">Management</h4>
                    <ul className="space-y-4 text-xs text-gray-400 font-light">
                        <li onClick={() => openModal('Features', 'Explore our cutting-edge features designed for modern living.')} className="hover:text-white transition-colors cursor-pointer">Features</li>
                        <li onClick={() => openModal('Blog', 'Read our latest stories, style guides, and design philosophy.')} className="hover:text-white transition-colors cursor-pointer">Blog</li>
                        <li onClick={() => openModal('Careers', 'Join our team. We are looking for creative minds.')} className="hover:text-white transition-colors cursor-pointer">Careers</li>
                        <li onClick={() => openModal('Privacy Policy', 'Your privacy is paramount. Read our commitment to data protection.')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                    </ul>
                </div>

                {/* Collections */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-6 text-white">Collections</h4>
                    <ul className="space-y-3 text-xs text-gray-300">
                        <Link to="/category/classic" className="block hover:text-white transition-colors">Classic</Link>
                        <Link to="/category/retro" className="block hover:text-white transition-colors">Retro</Link>
                        <Link to="/category/modern" className="block hover:text-white transition-colors">Modern</Link>
                        <Link to="/category/sporty" className="block hover:text-white transition-colors">Sporty</Link>
                        <Link to="/category/best-seller" className="block hover:text-white transition-colors">Best Seller</Link>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-sm font-bold uppercase mb-4 text-white">Contact Us</h4>
                    <p className="text-xs mb-6 text-gray-300">hello@threada.com</p>

                    <h4 className="text-sm font-bold uppercase mb-4 text-white">Newsletter</h4>
                    <p className="text-[10px] text-gray-300 mb-4 tracking-wider">SUBSCRIBE FOR EARLY ACCESS TO COLLECTIONS.</p>
                    <form className="flex border-b border-white/20 pb-2" onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="email"
                            placeholder="EMAIL ADDRESS"
                            className="bg-transparent border-none text-xs text-white placeholder-gray-500 focus:outline-none w-full uppercase"
                        />
                        <button type="submit" className="text-gray-300 hover:text-white transition-colors">
                            →
                        </button>
                    </form>
                </div>
            </div>

            <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest">
                <p>&copy; 2026 Threada • All rights reserved.</p>
                <div className="flex gap-4">
                    <span onClick={() => openModal('Terms', 'Terms and Conditions applied.')} className="cursor-pointer hover:text-white">Terms and Conditions</span>
                </div>
            </div>
        </footer>
    );
};
