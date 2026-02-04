import React, { useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '../supabaseClient';

interface OrderItem {
    id: string;
    n: string; // name
    q: number; // quantity
    s: string; // size
    options?: { group: string; choice: string }[];
}

interface Order {
    id: string;
    order_number: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    delivery_notes: string;
    kitchen_instructions: string;
    items: OrderItem[];
    total: number;
    payment_method: string;
    payment_screenshot: string | null;
    status: string;
    placed_at: string;
    updated_at: string;
}

interface Message {
    id: string;
    order_id: string;
    sender: string;
    message: string;
    created_at: string;
}

const STATUS_FLOW = ['pending', 'confirmed', 'cooking', 'ready', 'dispatched'];
const STATUS_LABELS: Record<string, string> = {
    pending: '⏳ Pending Confirmation',
    confirmed: '✅ Confirmed',
    cooking: '🍳 Cooking',
    ready: '📦 Ready for Delivery',
    dispatched: '🚀 Dispatched'
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    confirmed: 'bg-green-500/20 border-green-500/50 text-green-400',
    cooking: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    ready: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    dispatched: 'bg-purple-500/20 border-purple-500/50 text-purple-400'
};

const KitchenDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevOrderCountRef = useRef(0);

    const fetchOrders = useCallback(async () => {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('placed_at', { ascending: false });

        if (!error && data) {
            // Play sound if new order arrived
            if (data.length > prevOrderCountRef.current && prevOrderCountRef.current > 0) {
                playAlertSound();
            }
            prevOrderCountRef.current = data.length;
            setOrders(data);
        }
        setLoading(false);
    }, []);

    const fetchMessages = useCallback(async (orderId: string) => {
        const { data } = await supabase
            .from('order_messages')
            .select('*')
            .eq('order_id', orderId)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
    }, []);

    const playAlertSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => { });
        }
    };

    useEffect(() => {
        fetchOrders();

        // Real-time subscription
        const channel = supabase
            .channel('orders-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        // Poll every 10 seconds as backup
        const interval = setInterval(fetchOrders, 10000);

        return () => {
            channel.unsubscribe();
            clearInterval(interval);
        };
    }, [fetchOrders]);

    useEffect(() => {
        if (selectedOrder) {
            fetchMessages(selectedOrder.id);

            // Subscribe to messages for this order
            const msgChannel = supabase
                .channel(`messages-${selectedOrder.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages', filter: `order_id=eq.${selectedOrder.id}` }, () => {
                    fetchMessages(selectedOrder.id);
                })
                .subscribe();

            return () => { msgChannel.unsubscribe(); };
        }
    }, [selectedOrder, fetchMessages]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        fetchOrders();
        if (selectedOrder?.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedOrder) return;
        setSendingMessage(true);

        await supabase.from('order_messages').insert({
            order_id: selectedOrder.id,
            sender: 'store',
            message: newMessage.trim()
        });

        setNewMessage('');
        setSendingMessage(false);
    };

    const getNextStatus = (current: string) => {
        const idx = STATUS_FLOW.indexOf(current);
        return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    };

    const pendingOrders = orders.filter(o => o.status === 'pending');
    const activeOrders = orders.filter(o => ['confirmed', 'cooking', 'ready'].includes(o.status));
    const completedOrders = orders.filter(o => o.status === 'dispatched');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white/50 animate-pulse">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            {/* Audio element for alert */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-black text-yellow-400">{pendingOrders.length}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-yellow-400/60 mt-1">Pending</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-black text-orange-400">{activeOrders.length}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-orange-400/60 mt-1">In Progress</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                    <p className="text-4xl font-black text-green-400">{completedOrders.length}</p>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-green-400/60 mt-1">Completed</p>
                </div>
            </div>

            {/* Orders Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Pending Column */}
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400 mb-4 flex items-center gap-2">
                        <span className="animate-pulse">🔔</span> New Orders
                    </h2>
                    <div className="space-y-4">
                        {pendingOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onSelect={() => setSelectedOrder(order)}
                                onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                isNew
                            />
                        ))}
                        {pendingOrders.length === 0 && (
                            <p className="text-white/20 text-sm text-center py-8">No pending orders</p>
                        )}
                    </div>
                </div>

                {/* Active Column */}
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-4">🍳 In Progress</h2>
                    <div className="space-y-4">
                        {activeOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onSelect={() => setSelectedOrder(order)}
                                onStatusChange={(status) => updateOrderStatus(order.id, status)}
                            />
                        ))}
                        {activeOrders.length === 0 && (
                            <p className="text-white/20 text-sm text-center py-8">No active orders</p>
                        )}
                    </div>
                </div>

                {/* Completed Column */}
                <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-green-400 mb-4">✅ Completed</h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {completedOrders.slice(0, 10).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onSelect={() => setSelectedOrder(order)}
                                onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                isComplete
                            />
                        ))}
                        {completedOrders.length === 0 && (
                            <p className="text-white/20 text-sm text-center py-8">No completed orders</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-[#111] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-white/5 flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Order</p>
                                <h2 className="text-2xl font-black text-white">#{selectedOrder.order_number}</h2>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[selectedOrder.status]}`}>
                                {STATUS_LABELS[selectedOrder.status]}
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Customer</p>
                                    <p className="font-bold text-white">{selectedOrder.customer_name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Phone</p>
                                    <p className="font-bold text-white">{selectedOrder.customer_phone}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Address</p>
                                <p className="font-medium text-white/80">{selectedOrder.customer_address || 'N/A'}</p>
                            </div>

                            {selectedOrder.delivery_notes && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Delivery Notes</p>
                                    <p className="font-medium text-white/80">{selectedOrder.delivery_notes}</p>
                                </div>
                            )}

                            {selectedOrder.kitchen_instructions && (
                                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400 mb-1">👨‍🍳 Kitchen Instructions</p>
                                    <p className="font-bold text-orange-300">{selectedOrder.kitchen_instructions}</p>
                                </div>
                            )}

                            {/* Items */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Items</p>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-xl p-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-white">{item.q}x {item.n}</p>
                                                <p className="text-xs text-white/50">{item.s}</p>
                                                {item.options?.map((opt, i) => (
                                                    <p key={i} className="text-xs text-[#D97B8D]">{opt.group}: {opt.choice}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment */}
                            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Payment</p>
                                    <p className="font-bold text-white capitalize">{selectedOrder.payment_method}</p>
                                </div>
                                <p className="text-2xl font-black text-[#D97B8D]">Rs. {selectedOrder.total}</p>
                            </div>

                            {/* Payment Screenshot */}
                            {selectedOrder.payment_screenshot && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Payment Screenshot</p>
                                    <img
                                        src={selectedOrder.payment_screenshot}
                                        alt="Payment proof"
                                        className="w-full max-w-xs rounded-xl border border-white/10"
                                    />
                                </div>
                            )}

                            {/* Messages */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Messages</p>
                                <div className="bg-white/5 rounded-xl p-4 max-h-40 overflow-y-auto space-y-2">
                                    {messages.length === 0 && (
                                        <p className="text-white/30 text-sm text-center">No messages yet</p>
                                    )}
                                    {messages.map(msg => (
                                        <div key={msg.id} className={`p-2 rounded-lg text-sm ${msg.sender === 'store' ? 'bg-[#D97B8D]/20 text-[#D97B8D] ml-8' : 'bg-blue-500/20 text-blue-400 mr-8'}`}>
                                            <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1">{msg.sender}</p>
                                            {msg.message}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Send a remark..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#D97B8D]"
                                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={sendingMessage}
                                        className="bg-[#D97B8D] text-black px-4 py-2 rounded-xl font-bold text-xs uppercase hover:bg-[#D97B8D]/90 disabled:opacity-50"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>

                            {/* Status Actions */}
                            {getNextStatus(selectedOrder.status) && (
                                <button
                                    onClick={() => {
                                        const next = getNextStatus(selectedOrder.status);
                                        if (next) updateOrderStatus(selectedOrder.id, next);
                                    }}
                                    className="w-full bg-green-500 text-black py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-green-400 transition-all"
                                >
                                    Mark as {STATUS_LABELS[getNextStatus(selectedOrder.status)!]}
                                </button>
                            )}
                        </div>

                        <div className="p-4 border-t border-white/5 flex justify-end">
                            <button onClick={() => setSelectedOrder(null)} className="text-white/50 text-sm hover:text-white">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Order Card Component
const OrderCard: React.FC<{
    order: Order;
    onSelect: () => void;
    onStatusChange: (status: string) => void;
    isNew?: boolean;
    isComplete?: boolean;
}> = ({ order, onSelect, onStatusChange, isNew, isComplete }) => {
    const nextStatus = (() => {
        const idx = STATUS_FLOW.indexOf(order.status);
        return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    })();

    return (
        <div
            className={`bg-white/5 border rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all ${isNew ? 'border-yellow-500/50 animate-pulse' : isComplete ? 'border-green-500/30 opacity-60' : 'border-white/10'
                }`}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-3">
                <div>
                    <p className="font-black text-white text-lg">#{order.order_number}</p>
                    <p className="text-xs text-white/50">{order.customer_name}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[8px] font-bold uppercase border ${STATUS_COLORS[order.status]}`}>
                    {order.status}
                </div>
            </div>

            <div className="text-xs text-white/40 mb-3">
                {order.items.map((item, i) => (
                    <span key={i}>{i > 0 && ', '}{item.q}x {item.n}</span>
                ))}
            </div>

            <div className="flex justify-between items-center">
                <p className="text-[#D97B8D] font-black">Rs. {order.total}</p>
                {nextStatus && !isComplete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onStatusChange(nextStatus); }}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-white transition-all"
                    >
                        → {nextStatus}
                    </button>
                )}
            </div>
        </div>
    );
};

export default KitchenDashboard;
