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

const STATUS_FLOW = ['pending', 'confirmed', 'cooking', 'ready', 'dispatched', 'delivered'];
const STATUS_LABELS: Record<string, string> = {
    pending: '⏳ Pending',
    confirmed: '✅ Confirmed',
    cooking: '🍳 Cooking',
    ready: '📦 Ready',
    dispatched: '🚀 Dispatched',
    delivered: '🏠 Delivered'
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
    const isFirstLoadRef = useRef(true);

    const [showHistory, setShowHistory] = useState(false);
    const [historyOrders, setHistoryOrders] = useState<Order[]>([]);
    const [showReports, setShowReports] = useState(false);

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

                if (newIds.length > 0 && !isFirstLoadRef.current) {
                    // Add to blinking set
                    newIds.forEach(id => newOrderIdsRef.current.add(id));
                    playAlertSound();

                    // Remove from blinking after 30 seconds
                    setTimeout(() => {
                        newIds.forEach(id => newOrderIdsRef.current.delete(id));
                        setOrders(prev => [...prev]); // Force re-render
                    }, 30000);
                }

                isFirstLoadRef.current = false;
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

    const ordersRef = useRef(orders);
    useEffect(() => {
        ordersRef.current = orders;
    }, [orders]);

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

        const tempId = 'temp-' + Date.now();
        const msgContent = newMessage.trim();
        const currentOrderId = messageOrderId; // Capture for closure

        // Optimistic update
        setMessages(prev => [...prev, {
            id: tempId,
            order_id: currentOrderId,
            sender: 'store',
            message: msgContent,
            created_at: new Date().toISOString()
        }]);

        setNewMessage('');
        setSendingMessage(true);

        const { error } = await supabase.from('order_messages').insert({
            order_id: currentOrderId,
            sender: 'store',
            message: msgContent
        });

        if (error) {
            // Revert on error (could add error toast here)
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } else {
            // Refetch to get real ID and confirm
            fetchMessages(currentOrderId);
            // Auto-close messages after sending (User request)
            setTimeout(() => {
                setShowMessages(false);
                setMessageOrderId(null);
            }, 1000);
        }

        setSendingMessage(false);
    };

    // Fetch history (delivered orders)
    const fetchHistory = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('orders')
            .select('*')
            .eq('status', 'delivered')
            .order('placed_at', { ascending: false })
            .limit(50);

        if (data) setHistoryOrders(data);
        setLoading(false);
    };

    // Export Sales Data (Full History)
    const exportSalesData = async (period: 'daily' | 'weekly' | 'monthly') => {
        const now = new Date();
        let startDate = new Date();

        if (period === 'daily') startDate.setHours(0, 0, 0, 0);
        if (period === 'weekly') startDate.setDate(now.getDate() - 7);
        if (period === 'monthly') startDate.setMonth(now.getMonth() - 1);

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .gte('placed_at', startDate.toISOString())
            .order('placed_at', { ascending: true });

        if (error || !data) {
            alert('Failed to fetch data');
            return;
        }

        // Generate CSV
        const headers = ['Order No', 'Date', 'Customer', 'Details', 'Total', 'Status', 'Payment'];
        const rows = data.map(o => [
            o.order_number,
            new Date(o.placed_at).toLocaleString(),
            `"${o.customer_name}"`,
            `"${o.items.map((i: any) => `${i.q}x ${i.n}`).join(', ')}"`,
            o.total,
            o.status,
            o.payment_method
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `sales_report_${period}_${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
    };

    const openMessagesAndClear = (order: Order) => {
        setMessageOrderId(order.id);
        fetchMessages(order.id); // Check history
        setShowMessages(true);
        // Clear from unread set
        setUnreadMessages(prev => {
            const next = new Set(prev);
            next.delete(order.id);
            return next;
        });
    };

    // Listen for any new customer messages to show popup notification
    useEffect(() => {
        const messageChannel = supabase
            .channel('all-customer-messages')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'order_messages' }, async (payload: any) => {
                // Only show popup for customer messages
                if (payload.new?.sender === 'customer') {
                    const orderId = payload.new.order_id;
                    // Find order to get order_number using Ref to avoid finding on stale state or re-subscribing
                    const order = ordersRef.current.find(o => o.id === orderId);
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
    }, []); // Stable subscription

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



    // Print thermal receipt (Matches Customer Overlay Style)
    const printOrder = (order: Order) => {
        const printWindow = window.open('', '_blank', 'width=300,height=600');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                <head>
                    <title>Receipt #${order.order_number}</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
                    <style>
                        @page { size: 80mm auto; margin: 0; }
                        body { 
                            width: 76mm;
                            margin: 0 auto; 
                            padding: 0; 
                            font-family: 'Courier Prime', monospace; 
                            text-align: center; 
                            color: black;
                            background: white;
                        }
                        h1.receipt-title { 
                            font-family: 'Dancing Script', cursive; 
                            font-size: 24pt; 
                            margin: 0 0 2mm 0; 
                            font-weight: 700; 
                        }
                        .logo-bw { width: 22mm; height: 22mm; margin: 0 auto 3mm; }
                        .separator { border-top: 1px dashed black; margin: 3mm 0; }
                        .flex-row { display: flex; justify-content: space-between; text-align: left; font-size: 10pt; }
                        .bold { font-weight: 700; }
                        .footer-text { font-size: 8pt; margin-top: 3mm; opacity: 0.8; font-weight: 700; }
                        .item-row { margin-bottom: 1.5mm; }
                    </style>
                </head>
                <body>
                    <h1 class="receipt-title">Receipt</h1>

                    <div class="logo-bw">
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="50" cy="50" r="45" fill="black" />
                            <circle cx="35" cy="35" r="5" fill="white" />
                            <circle cx="65" cy="40" r="6" fill="white" />
                            <circle cx="45" cy="65" r="7" fill="white" />
                            <circle cx="70" cy="70" r="4" fill="white" />
                            <circle cx="25" cy="60" r="4" fill="white" />
                        </svg>
                    </div>

                    <div class="bold" style="font-size: 16pt; letter-spacing: 2px; margin-bottom: 1mm;">GRAVITY STUDIO</div>
                    <div style="font-size: 10pt;">Phase 6, DHA, Karachi</div>
                    <div style="font-size: 10pt;">Tel: (850) GRAVITY-STUDIO</div>

                    <div class="separator"></div>
                    <div class="flex-row">
                        <span>Date: ${new Date(order.placed_at).toLocaleDateString()}</span>
                        <span>${new Date(order.placed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="separator"></div>

                    <div style="text-align: left; margin-bottom: 2mm;">
                        ${order.items.map(item => `
                            <div class="flex-row item-row">
                                <span>${item.q}x ${item.n} ${item.options ? `(${item.options.map((o: any) => o.choice).join(', ')})` : ''}</span>
                                <span>Rs.${(parseInt(item.s.replace(/\D/g, '')) * item.q) || 0}.00</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="separator"></div>

                    <div class="flex-row bold" style="font-size: 12pt;">
                        <span>TOTAL DUE</span>
                        <span>Rs.${order.total}.00</span>
                    </div>
                    <div class="flex-row" style="margin-top: 2mm;">
                        <span>Sub-total</span>
                        <span>Rs.${order.total}.00</span>
                    </div>
                    <div class="flex-row">
                        <span>Amount Paid</span>
                        <span>Rs.${order.payment_method === 'digital' ? `${order.total}.00` : '0.00'}</span>
                    </div>
                    <div class="flex-row">
                        <span>Balance Due</span>
                        <span>Rs.${order.payment_method === 'digital' ? '0.00' : `${order.total}.00`}</span>
                    </div>

                    ${(order.kitchen_instructions || order.delivery_notes) ? `
                        <div class="separator"></div>
                        <div style="text-align: left; font-size: 10pt;">
                            ${order.kitchen_instructions ? `
                                <div style="margin-bottom: 2mm;">
                                    <div class="bold">KITCHEN NOTE:</div>
                                    <div>${order.kitchen_instructions}</div>
                                </div>
                            ` : ''}
                            ${order.delivery_notes ? `
                                <div>
                                    <div class="bold">DELIVERY NOTE:</div>
                                    <div>${order.delivery_notes}</div>
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}

                    <div class="separator"></div>

                    <div style="text-align: left;">
                        <div class="bold" style="margin-bottom: 1.5mm;">DELIVER TO:</div>
                        <div class="bold" style="font-size: 11pt;">${order.customer_name}</div>
                        <div style="font-size: 10pt;">${order.customer_address}</div>
                        <div style="font-size: 10pt;">Contact: ${order.customer_phone}</div>
                    </div>

                    <div style="margin-top: 5mm;">
                         <svg width="100%" height="45" viewBox="0 0 200 45" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" width="2" height="45" fill="black" />
                            <rect x="4" width="1" height="45" fill="black" />
                            <rect x="7" width="3" height="45" fill="black" />
                            <rect x="12" width="1" height="45" fill="black" />
                            <rect x="15" width="2" height="45" fill="black" />
                            <rect x="20" width="1" height="45" fill="black" />
                            <rect x="23" width="4" height="45" fill="black" />
                            <rect x="29" width="1" height="45" fill="black" />
                            <rect x="32" width="2" height="45" fill="black" />
                            <rect x="36" width="3" height="45" fill="black" />
                            <rect x="41" width="1" height="45" fill="black" />
                            <rect x="44" width="2" height="45" fill="black" />
                            <rect x="48" width="1" height="45" fill="black" />
                            <rect x="51" width="4" height="45" fill="black" />
                            <rect x="57" width="1" height="45" fill="black" />
                            <rect x="60" width="2" height="45" fill="black" />
                            <rect x="64" width="3" height="45" fill="black" />
                            <rect x="69" width="1" height="45" fill="black" />
                            <rect x="72" width="2" height="45" fill="black" />
                            <rect x="76" width="1" height="45" fill="black" />
                            <rect x="79" width="4" height="45" fill="black" />
                            <rect x="85" width="1" height="45" fill="black" />
                            <rect x="88" width="2" height="45" fill="black" />
                            <rect x="92" width="3" height="45" fill="black" />
                            <rect x="97" width="1" height="45" fill="black" />
                            <rect x="100" width="2" height="45" fill="black" />
                            <rect x="104" width="1" height="45" fill="black" />
                            <rect x="107" width="4" height="45" fill="black" />
                            <rect x="113" width="1" height="45" fill="black" />
                            <rect x="116" width="2" height="45" fill="black" />
                            <rect x="120" width="3" height="45" fill="black" />
                            <rect x="125" width="1" height="45" fill="black" />
                            <rect x="128" width="2" height="45" fill="black" />
                            <rect x="132" width="1" height="45" fill="black" />
                            <rect x="135" width="4" height="45" fill="black" />
                            <rect x="141" width="1" height="45" fill="black" />
                            <rect x="144" width="2" height="45" fill="black" />
                            <rect x="148" width="3" height="45" fill="black" />
                            <rect x="153" width="1" height="45" fill="black" />
                            <rect x="156" width="2" height="45" fill="black" />
                            <rect x="160" width="1" height="45" fill="black" />
                            <rect x="163" width="4" height="45" fill="black" />
                            <rect x="169" width="1" height="45" fill="black" />
                            <rect x="172" width="2" height="45" fill="black" />
                            <rect x="176" width="3" height="45" fill="black" />
                            <rect x="181" width="1" height="45" fill="black" />
                            <rect x="184" width="2" height="45" fill="black" />
                            <rect x="188" width="1" height="45" fill="black" />
                            <rect x="191" width="4" height="45" fill="black" />
                            <rect x="197" width="3" height="45" fill="black" />
                         </svg>
                         <div style="font-size: 8pt; margin-top: 1.5mm; font-style: italic;">https://saadmughal-gravity.vercel.app/</div>
                         <div style="font-size: 9pt; margin-top: 1mm; font-weight: bold;">SCAN FOR STUDIO MENU</div>
                         <div class="footer-text">© GRAVITY STUDIO</div>
                    </div>
                    
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    // Memoized filtered lists
    const pendingOrders = useMemo(() => orders.filter(o => o.status === 'pending'), [orders]);
    const activeOrders = useMemo(() => orders.filter(o => ['confirmed', 'cooking', 'ready'].includes(o.status)), [orders]);
    // Only show Dispatched in "Completed Today" column (Delivered goes to History)
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
        <div className="h-screen overflow-y-auto bg-black text-white">
            {/* Audio */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="metadata" />

            {/* Header - Responsive */}
            <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/5 px-4 py-3 md:px-8 md:py-4 shadow-xl">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <div>
                            <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight">🍳 Kitchen</h1>
                            <p className="text-[10px] md:text-xs text-white/40 uppercase tracking-widest">Live Orders</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Stats Pills - Hidden on very small screens if needed, but vital for kitchen */}
                        <div className="hidden lg:flex gap-3 mr-4">
                            <div className={`px-3 py-1.5 rounded-full text-center ${pendingOrders.length > 0 ? 'bg-yellow-500/20 border border-yellow-500/50 animate-pulse' : 'bg-white/5 border border-white/10'}`}>
                                <span className="text-xl font-black text-yellow-400">{pendingOrders.length}</span>
                                <span className="text-[10px] uppercase tracking-wider text-yellow-400/60 ml-2">NEW</span>
                            </div>
                            <div className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-center">
                                <span className="text-xl font-black text-orange-400">{activeOrders.length}</span>
                                <span className="text-[10px] uppercase tracking-wider text-orange-400/60 ml-2">Active</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <button
                            onClick={() => { setShowHistory(true); fetchHistory(); }}
                            className="bg-white/5 hover:bg-white/10 px-3 py-2 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2 whitespace-nowrap"
                        >
                            📦 History
                        </button>

                        <div className="relative group">
                            <button
                                className="bg-[#D97B8D]/20 hover:bg-[#D97B8D]/30 text-[#D97B8D] px-3 py-2 md:px-4 md:py-2 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all border border-[#D97B8D]/30 flex items-center gap-2 whitespace-nowrap"
                            >
                                📊 Reports
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-40 bg-[#1C1C1C] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block z-50">
                                <button onClick={() => exportSalesData('daily')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-white/70 hover:text-white transition-colors">Today</button>
                                <button onClick={() => exportSalesData('weekly')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-white/70 hover:text-white transition-colors">This Week</button>
                                <button onClick={() => exportSalesData('monthly')} className="w-full text-left px-4 py-3 text-sm hover:bg-white/5 text-white/70 hover:text-white transition-colors">This Month</button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                    <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl w-full max-w-5xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-[fadeIn_0.3s_ease-out]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-widest text-[#D97B8D]">📦 Delivered History</h2>
                                <p className="text-xs text-white/40 mt-1">Archive of completed orders</p>
                            </div>
                            <button onClick={() => setShowHistory(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-white">✕</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {historyOrders.map(order => (
                                <OrderCard
                                    key={order.id}
                                    order={order}
                                    onSelect={() => setSelectedOrder(order)}
                                    onStatusChange={() => { }}
                                    onMessage={() => openMessagesAndClear(order)}
                                    onPrint={() => printOrder(order)}
                                    isComplete
                                    hasUnreadMessages={unreadMessages.has(order.id)}
                                />
                            ))}
                            {loading && <p className="col-span-full text-center py-10 text-white/30 animate-pulse">Loading archive...</p>}
                            {!loading && historyOrders.length === 0 && <p className="col-span-full text-center py-10 text-white/30">No delivered orders found</p>}
                        </div>
                    </div>
                </div>
            )}

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
                                    onClick={() => { openMessagesAndClear(selectedOrder); setSelectedOrder(null); }}
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
                                    className={`p-3 rounded-xl text-sm max-w-[85%] relative ${msg.sender === 'store'
                                        ? 'bg-[#D97B8D]/20 text-[#D97B8D] ml-auto'
                                        : 'bg-blue-500/20 text-blue-400 mr-auto'
                                        }`}
                                >
                                    <p className="text-[8px] uppercase tracking-widest opacity-60 mb-1 font-bold">
                                        {msg.sender === 'store' ? '🏪 You' : '👤 Customer'}
                                    </p>
                                    <p className="font-medium">{msg.message}</p>
                                    {msg.id.startsWith('temp-') && (
                                        <span className="absolute -bottom-2 right-1 text-[8px] opacity-70">⏳ Sending...</span>
                                    )}
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
                            if (order) openMessagesAndClear(order);
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

            {/* Audio for new order alerts */}
            <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
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
