import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { supabase } from '../supabaseClient';

interface OrderItem {
    id: string;
    n: string;
    q: number;
    s: string;
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
    pending: '⏳ Pending',
    confirmed: '✅ Confirmed',
    cooking: '🍳 Cooking',
    ready: '📦 Ready',
    dispatched: '🚀 Dispatched'
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
    confirmed: 'bg-green-500/20 border-green-500/50 text-green-400',
    cooking: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    ready: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    dispatched: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
    delivered: 'bg-pink-500/20 border-pink-500/50 text-pink-400'
};

// Color palette for order cards - rotates through
const ORDER_COLORS = [
    '#D97B8D', // Pink (brand)
    '#7BD98D', // Green
    '#7BB5D9', // Blue
    '#D9B77B', // Gold
    '#B77BD9', // Purple
    '#7BD9D9', // Cyan
    '#D97B7B', // Red
    '#9DA7FF', // Lavender
];

const KitchenDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showMessages, setShowMessages] = useState(false);
    const [messageOrderId, setMessageOrderId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [activeTab, setActiveTab] = useState<'pending' | 'active' | 'done'>('pending');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevOrderIdsRef = useRef<Set<string>>(new Set());
    const newOrderIdsRef = useRef<Set<string>>(new Set());

    // Popup message notification
    const [messagePopup, setMessagePopup] = useState<{ orderId: string; orderNumber: string; message: string; sender: string; color: string } | null>(null);

    // Optimized fetch - batch requests, debounced
    const fetchOrders = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('placed_at', { ascending: false })
                .limit(100); // Limit for performance

            if (!error && data) {
                const currentIds = new Set(data.map(o => o.id));
                const prevIds = prevOrderIdsRef.current;

                // Find actually new orders (not seen before)
                const newIds = data.filter(o => !prevIds.has(o.id) && o.status === 'pending').map(o => o.id);

                if (newIds.length > 0 && prevIds.size > 0) {
                    // Add to blinking set
                    newIds.forEach(id => newOrderIdsRef.current.add(id));
                    playAlertSound();

                    // Remove from blinking after 30 seconds
                    setTimeout(() => {
                        newIds.forEach(id => newOrderIdsRef.current.delete(id));
                        setOrders([...orders]); // Force re-render
                    }, 30000);
                }

                prevOrderIdsRef.current = currentIds;
                setOrders(data);
            }
        } catch (err) {
            console.error('Fetch orders error:', err);
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

        // Real-time subscription with error handling
        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        // Faster polling for rush scenarios (every 5 seconds)
        const interval = setInterval(fetchOrders, 5000);

        return () => {
            channel.unsubscribe();
            clearInterval(interval);
        };
    }, [fetchOrders]);

    useEffect(() => {
        if (messageOrderId) {
            fetchMessages(messageOrderId);

            const msgChannel = supabase
                .channel(`msg-${messageOrderId}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages', filter: `order_id=eq.${messageOrderId}` }, () => {
                    fetchMessages(messageOrderId);
                })
                .subscribe();

            return () => { msgChannel.unsubscribe(); };
        }
    }, [messageOrderId, fetchMessages]);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

        // Auto-clear messages when marking as delivered
        if (newStatus === 'delivered') {
            await supabase.from('order_messages').delete().eq('order_id', orderId);
        }

        // Optimistic update
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) {
            setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !messageOrderId) return;
        setSendingMessage(true);

        await supabase.from('order_messages').insert({
            order_id: messageOrderId,
            sender: 'store',
            message: newMessage.trim()
        });

        setNewMessage('');
        setSendingMessage(false);
    };

    const openMessages = (order: Order) => {
        setMessageOrderId(order.id);
        setShowMessages(true);
    };

    // Listen for any new customer messages to show popup notification
    useEffect(() => {
        const messageChannel = supabase
            .channel('all-customer-messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages' }, async (payload: any) => {
                // Only show popup for customer messages
                if (payload.new?.sender === 'customer') {
                    const orderId = payload.new.order_id;
                    // Find order to get order_number
                    const order = orders.find(o => o.id === orderId);
                    if (order) {
                        playAlertSound();
                        setMessagePopup({
                            orderId,
                            orderNumber: order.order_number,
                            message: payload.new.message,
                            sender: 'customer',
                            color: getOrderColor(orderId)
                        });
                        // Auto-dismiss after 8 seconds
                        setTimeout(() => setMessagePopup(null), 8000);
                    }
                }
            })
            .subscribe();

        return () => { messageChannel.unsubscribe(); };
    }, [orders]);

    const getNextStatus = (current: string) => {
        const idx = STATUS_FLOW.indexOf(current);
        return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    };

    // Get color for order based on its index (for differentiation)
    const getOrderColor = (orderId: string): string => {
        const allOrderIds = orders.map(o => o.id);
        const idx = allOrderIds.indexOf(orderId);
        return ORDER_COLORS[idx % ORDER_COLORS.length];
    };

    // Track unread messages per order
    const [unreadMessages, setUnreadMessages] = useState<Set<string>>(new Set());

    // Update unread messages when new customer message comes in
    useEffect(() => {
        const unreadChannel = supabase
            .channel('unread-tracker')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages' }, (payload: any) => {
                if (payload.new?.sender === 'customer') {
                    setUnreadMessages(prev => new Set([...prev, payload.new.order_id]));
                }
            })
            .subscribe();

        return () => { unreadChannel.unsubscribe(); };
    }, []);

    // Mark as read when opening messages
    const openMessagesAndClear = (order: Order) => {
        setUnreadMessages(prev => {
            const next = new Set(prev);
            next.delete(order.id);
            return next;
        });
        openMessages(order);
    };

    // Print thermal receipt
    const printOrder = (order: Order) => {
        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Order #${order.order_number}</title>
                    <style>
                        body { font-family: 'Courier New', monospace; font-size: 12px; padding: 10px; width: 270px; }
                        h1 { font-size: 16px; text-align: center; margin: 0 0 10px 0; }
                        .divider { border-top: 1px dashed #000; margin: 8px 0; }
                        .item { display: flex; justify-content: space-between; }
                        .total { font-weight: bold; font-size: 14px; }
                        .center { text-align: center; }
                    </style>
                </head>
                <body>
                    <h1>GUSTO PIZZERIA</h1>
                    <div class="center">Order #${order.order_number}</div>
                    <div class="divider"></div>
                    <p><strong>${order.customer_name}</strong></p>
                    <p>${order.customer_phone}</p>
                    <p>${order.customer_address}</p>
                    <div class="divider"></div>
                    ${order.items.map(item => `<div class="item"><span>${item.q}x ${item.n}</span><span>${item.s}</span></div>`).join('')}
                    <div class="divider"></div>
                    <div class="item total"><span>TOTAL</span><span>Rs. ${order.total}</span></div>
                    <div class="divider"></div>
                    <p><strong>Kitchen:</strong> ${order.kitchen_instructions || 'None'}</p>
                    <p><strong>Delivery:</strong> ${order.delivery_notes || 'None'}</p>
                    <div class="divider"></div>
                    <div class="center">${new Date().toLocaleString()}</div>
                </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    // Memoized filtered lists
    const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
    const activeOrders = useMemo(() => orders.filter(o => ['confirmed', 'cooking', 'ready'].includes(o.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => o.status === 'dispatched'), [orders]);

    const currentOrders = activeTab === 'pending' ? pendingOrders : activeTab === 'active' ? activeOrders : completedOrders;

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white/50 animate-pulse text-lg">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Audio */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />

            {/* Header - Responsive */}
            <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5 px-4 py-3 md:px-8 md:py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div>
                        <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight">🍳 Kitchen</h1>
                        <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Live Orders</p>
                    </div>

                    {/* Stats Pills - Responsive */}
                    <div className="flex gap-2 md:gap-3">
                        <div className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-center ${pendingOrders.length > 0 ? 'bg-yellow-500/20 border border-yellow-500/50 animate-pulse' : 'bg-white/5 border border-white/10'}`}>
                            <span className="text-lg md:text-2xl font-black text-yellow-400">{pendingOrders.length}</span>
                            <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-yellow-400/60 ml-1 hidden sm:inline">NEW</span>
                        </div>
                        <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-orange-500/10 border border-orange-500/30 text-center">
                            <span className="text-lg md:text-2xl font-black text-orange-400">{activeOrders.length}</span>
                            <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-orange-400/60 ml-1 hidden sm:inline">ACTIVE</span>
                        </div>
                        <div className="px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-green-500/10 border border-green-500/30 text-center hidden md:block">
                            <span className="text-lg md:text-2xl font-black text-green-400">{completedOrders.length}</span>
                            <span className="text-[8px] md:text-[10px] uppercase tracking-wider text-green-400/60 ml-1">DONE</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Tab Bar */}
            <div className="md:hidden sticky top-[60px] z-30 bg-black border-b border-white/5 flex">
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'pending' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white/40'}`}
                >
                    🔔 New ({pendingOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('active')}
                    className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'active' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-white/40'}`}
                >
                    🍳 Active ({activeOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('done')}
                    className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all ${activeTab === 'done' ? 'text-green-400 border-b-2 border-green-400' : 'text-white/40'}`}
                >
                    ✅ Done
                </button>
            </div>

            {/* Main Content */}
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {/* Desktop: 3 Column Grid / Mobile: Tab Content */}
                <div className="hidden md:grid md:grid-cols-3 gap-6">
                    {/* Pending Column */}
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-yellow-400 mb-4 flex items-center gap-2">
                            <span className="animate-bounce">🔔</span> New Orders
                            {pendingOrders.length > 0 && <span className="bg-yellow-500 text-black text-[10px] px-2 py-0.5 rounded-full animate-pulse">{pendingOrders.length}</span>}
                        </h2>
                        <div className="space-y-3">
                            {pendingOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onSelect={() => setSelectedOrder(order)}
                                    onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                    onMessage={() => openMessagesAndClear(order)}
                                    onPrint={() => printOrder(order)}
                                    isNew={newOrderIdsRef.current.has(order.id)}
                                    hasUnreadMessages={unreadMessages.has(order.id)}
                                />
                            ))}
                            {pendingOrders.length === 0 && <EmptyState text="No pending orders" />}
                        </div>
                    </div>

                    {/* Active Column */}
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-orange-400 mb-4">🍳 In Progress</h2>
                        <div className="space-y-3">
                            {activeOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onSelect={() => setSelectedOrder(order)}
                                    onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                    onMessage={() => openMessagesAndClear(order)}
                                    onPrint={() => printOrder(order)}
                                    hasUnreadMessages={unreadMessages.has(order.id)}
                                />
                            ))}
                            {activeOrders.length === 0 && <EmptyState text="No active orders" />}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-green-400 mb-4">✅ Completed Today</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-thin">
                            {completedOrders.slice(0, 15).map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onSelect={() => setSelectedOrder(order)}
                                    onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                    onMessage={() => openMessagesAndClear(order)}
                                    onPrint={() => printOrder(order)}
                                    isComplete
                                    hasUnreadMessages={unreadMessages.has(order.id)}
                                />
                            ))}
                            {completedOrders.length === 0 && <EmptyState text="No completed orders" />}
                        </div>
                    </div>
                </div>

                {/* Mobile: Single Column based on Tab */}
                <div className="md:hidden space-y-3">
                    {currentOrders.length === 0 ? (
                        <EmptyState text={`No ${activeTab} orders`} />
                    ) : (
                        currentOrders.slice(0, 20).map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                onSelect={() => setSelectedOrder(order)}
                                onStatusChange={(status) => updateOrderStatus(order.id, status)}
                                onMessage={() => openMessagesAndClear(order)}
                                onPrint={() => printOrder(order)}
                                isNew={activeTab === 'pending' && newOrderIdsRef.current.has(order.id)}
                                isComplete={activeTab === 'done'}
                                hasUnreadMessages={unreadMessages.has(order.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-end md:items-center justify-center" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="bg-[#0a0a0a] border border-white/10 rounded-t-3xl md:rounded-3xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-[#0a0a0a] p-4 md:p-6 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Order</p>
                                <h2 className="text-xl md:text-2xl font-black">#{selectedOrder.order_number}</h2>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase border ${STATUS_COLORS[selectedOrder.status]}`}>
                                {STATUS_LABELS[selectedOrder.status]}
                            </div>
                        </div>

                        <div className="p-4 md:p-6 space-y-4">
                            {/* Customer Info */}
                            <div className="grid grid-cols-2 gap-3">
                                <InfoBlock label="Customer" value={selectedOrder.customer_name} />
                                <InfoBlock label="Phone" value={selectedOrder.customer_phone} />
                            </div>
                            <InfoBlock label="Address" value={selectedOrder.customer_address || 'N/A'} />

                            {selectedOrder.kitchen_instructions && (
                                <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400 mb-1">👨‍🍳 Kitchen Note</p>
                                    <p className="font-bold text-orange-300 text-sm">{selectedOrder.kitchen_instructions}</p>
                                </div>
                            )}

                            {/* Items */}
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Items</p>
                                <div className="space-y-2">
                                    {selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="bg-white/5 rounded-lg p-3 flex justify-between">
                                            <div>
                                                <p className="font-bold text-sm">{item.q}x {item.n}</p>
                                                <p className="text-xs text-white/50">{item.s}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center bg-white/5 rounded-xl p-4">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Payment</p>
                                    <p className="font-bold capitalize text-sm">{selectedOrder.payment_method}</p>
                                </div>
                                <p className="text-2xl font-black text-[#D97B8D]">Rs. {selectedOrder.total}</p>
                            </div>

                            {/* Payment Screenshot */}
                            {selectedOrder.payment_screenshot && (
                                <div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-2">Payment Proof</p>
                                    <img src={selectedOrder.payment_screenshot} alt="Payment" className="w-full max-w-[200px] rounded-xl border border-white/10" />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { openMessages(selectedOrder); setSelectedOrder(null); }}
                                    className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                >
                                    💬 Message
                                </button>
                                {getNextStatus(selectedOrder.status) && (
                                    <button
                                        onClick={() => {
                                            const next = getNextStatus(selectedOrder.status);
                                            if (next) updateOrderStatus(selectedOrder.id, next);
                                        }}
                                        className="flex-1 bg-green-500 hover:bg-green-400 text-black py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                                    >
                                        → {getNextStatus(selectedOrder.status)}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Close Button */}
                        <div className="p-4 border-t border-white/5">
                            <button onClick={() => setSelectedOrder(null)} className="w-full py-3 text-white/50 text-sm hover:text-white transition-colors">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages Popup Modal */}
            {showMessages && messageOrderId && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setShowMessages(false)}>
                    <div
                        className="bg-[#0a0a0a] border border-white/10 rounded-t-3xl md:rounded-3xl w-full md:max-w-md max-h-[80vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-white/5 flex justify-between items-center">
                            <div>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">Messages</p>
                                <h2 className="font-black">Order #{orders.find(o => o.id === messageOrderId)?.order_number}</h2>
                            </div>
                            <button onClick={() => setShowMessages(false)} className="p-2 text-white/50 hover:text-white">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
                            {messages.length === 0 && (
                                <div className="text-center text-white/30 py-8">
                                    <p className="text-3xl mb-2">💬</p>
                                    <p className="text-sm">No messages yet</p>
                                    <p className="text-xs text-white/20 mt-1">Send a remark to the customer</p>
                                </div>
                            )}
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`p-3 rounded-xl text-sm max-w-[85%] ${msg.sender === 'store'
                                        ? 'bg-[#D97B8D]/20 text-[#D97B8D] ml-auto'
                                        : 'bg-blue-500/20 text-blue-400 mr-auto'
                                        }`}
                                >
                                    <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1">
                                        {msg.sender === 'store' ? '🏪 You' : '👤 Customer'}
                                    </p>
                                    {msg.message}
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-white/5 flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D97B8D]"
                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={sendingMessage}
                                className="bg-[#D97B8D] text-black px-5 py-3 rounded-xl font-bold text-xs uppercase hover:bg-[#D97B8D]/90 disabled:opacity-50 transition-all"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Message Popup Notification */}
            {messagePopup && (
                <div className="fixed bottom-4 right-4 left-4 md:left-auto md:w-96 z-[60] animate-[slide-up_0.3s_ease-out]">
                    <div
                        className="bg-[#1C1C1C] border-2 rounded-2xl p-4 shadow-2xl cursor-pointer hover:scale-[1.02] transition-transform"
                        style={{ borderColor: messagePopup.color }}
                        onClick={() => {
                            const order = orders.find(o => o.id === messagePopup.orderId);
                            if (order) openMessages(order);
                            setMessagePopup(null);
                        }}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
                                style={{ backgroundColor: `${messagePopup.color}30` }}
                            >
                                💬
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span
                                        className="text-xs font-bold uppercase tracking-widest"
                                        style={{ color: messagePopup.color }}
                                    >
                                        Order #{messagePopup.orderNumber.slice(-4)}
                                    </span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setMessagePopup(null); }}
                                        className="text-white/30 hover:text-white text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-white text-sm font-medium truncate">{messagePopup.message}</p>
                                <p className="text-white/40 text-[10px] mt-1">Tap to reply</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for animations */}
            <style>{`
                @keyframes urgent-pulse {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
                    50% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
                }
                .urgent-pulse {
                    animation: urgent-pulse 1s infinite;
                }
                @keyframes new-order-glow {
                    0%, 100% { border-color: rgba(234, 179, 8, 0.3); background-color: rgba(234, 179, 8, 0.05); }
                    50% { border-color: rgba(234, 179, 8, 0.8); background-color: rgba(234, 179, 8, 0.15); }
                }
                .new-order-glow {
                    animation: new-order-glow 0.8s infinite;
                }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes blink-message {
                    0%, 100% { background-color: rgba(217, 123, 141, 0.2); }
                    50% { background-color: rgba(217, 123, 141, 0.8); transform: scale(1.1); }
                }
                .blink-message {
                    animation: blink-message 0.6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

// Order Card Component - Mobile Optimized
const OrderCard: React.FC<{
    order: Order;
    onSelect: () => void;
    onStatusChange: (status: string) => void;
    onMessage: () => void;
    onPrint: () => void;
    isNew?: boolean;
    isComplete?: boolean;
    hasUnreadMessages?: boolean;
}> = ({ order, onSelect, onStatusChange, onMessage, onPrint, isNew, isComplete, hasUnreadMessages }) => {
    const nextStatus = (() => {
        const idx = STATUS_FLOW.indexOf(order.status);
        return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null;
    })();

    const timeSince = (date: string) => {
        const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        return `${Math.floor(mins / 60)}h ago`;
    };

    return (
        <div
            className={`
                rounded-2xl p-4 cursor-pointer transition-all border
                ${isNew ? 'new-order-glow urgent-pulse border-yellow-500 bg-yellow-500/10' :
                    isComplete ? 'border-white/5 bg-white/[0.02] opacity-60' :
                        'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'}
            `}
            onClick={onSelect}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    {isNew && <span className="text-xl animate-bounce">🔔</span>}
                    <div>
                        <p className="font-black text-base md:text-lg">#{order.order_number}</p>
                        <p className="text-xs text-white/50">{order.customer_name}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase border ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                    </div>
                    <span className="text-[10px] text-white/30">{timeSince(order.placed_at)}</span>
                </div>
            </div>

            <div className="text-xs text-white/40 mb-3 line-clamp-1">
                {order.items.map((item, i) => (
                    <span key={i}>{i > 0 && ', '}{item.q}x {item.n}</span>
                ))}
            </div>

            <div className="flex justify-between items-center gap-2">
                <p className="text-[#D97B8D] font-black text-sm md:text-base">Rs. {order.total}</p>

                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onPrint(); }}
                        className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                        title="Print Receipt"
                    >
                        🖨️
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMessage(); }}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${hasUnreadMessages ? 'blink-message text-white' : 'bg-white/10 hover:bg-white/20'}`}
                        title="Messages"
                    >
                        💬 {hasUnreadMessages && <span className="ml-1">!</span>}
                    </button>
                    {nextStatus && !isComplete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onStatusChange(nextStatus); }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${isNew
                                ? 'bg-green-500 text-black hover:bg-green-400'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            → {nextStatus}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// Empty State Component
const EmptyState: React.FC<{ text: string }> = ({ text }) => (
    <div className="text-center py-12 text-white/20">
        <p className="text-4xl mb-3">📭</p>
        <p className="text-sm">{text}</p>
    </div>
);

// Info Block Component
const InfoBlock: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">{label}</p>
        <p className="font-medium text-sm text-white/80">{value}</p>
    </div>
);

export default KitchenDashboard;
