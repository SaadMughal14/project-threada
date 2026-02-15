import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Order } from '../types';

const FulfillmentDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    // Stages: Processing -> Quality Check -> Packed -> Out for Delivery
    const stages = ['Processing', 'Quality Check', 'Packed', 'Out for Delivery'];

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .order('placed_at', { ascending: false });
            if (data) setOrders(data as Order[]);
        };
        fetchOrders();

        const subscription = supabase
            .channel('public:orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => { subscription.unsubscribe(); };
    }, []);

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    };

    return (
        <div className="min-h-screen bg-[#F5F5F5] text-[#1C1C1C] font-mono p-6">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-black uppercase tracking-tight">Fulfillment Dashboard</h1>
                <div className="flex gap-4">
                    <div className="px-4 py-2 bg-white border border-gray-300 shadow-sm rounded">
                        <span className="text-xs uppercase text-gray-500 block">Active Orders</span>
                        <span className="text-xl font-bold">{orders.filter(o => o.status !== 'delivered').length}</span>
                    </div>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 overflow-x-auto pb-4">
                {stages.map(stage => {
                    const stageOrders = orders.filter(o => (o.status || 'Processing') === stage);
                    return (
                        <div key={stage} className="min-w-[300px] bg-white border border-gray-200 shadow-sm rounded-lg flex flex-col h-[70vh]">
                            <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg flex justify-between items-center">
                                <h3 className="font-bold uppercase text-xs tracking-widest">{stage}</h3>
                                <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{stageOrders.length}</span>
                            </div>
                            <div className="flex-1 p-2 overflow-y-auto space-y-3 bg-gray-100/50">
                                {stageOrders.map(order => (
                                    <div key={order.id} className="bg-white p-4 border border-gray-200 shadow-sm rounded hover:shadow-md transition-shadow cursor-pointer relative group">
                                        <div className="flex justify-between mb-2">
                                            <span className="font-bold text-sm">#{String(order.id).slice(0, 5)}...</span>
                                            <span className="text-xs text-gray-500">{new Date(order.placed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="mb-3">
                                            {order.items && order.items.map((item: any, i: number) => (
                                                <div key={i} className="text-xs text-gray-600 flex justify-between">
                                                    <span>{item.quantity}x {item.name}</span>
                                                    <span className="opacity-50">{item.size || '-'}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2 mt-4">
                                            {stage !== 'Out for Delivery' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, stages[stages.indexOf(stage) + 1])}
                                                    className="flex-1 bg-black text-white text-[10px] uppercase font-bold py-2 rounded hover:bg-gray-800"
                                                >
                                                    Advance
                                                </button>
                                            )}
                                            <button
                                                onClick={() => window.print()}
                                                className="bg-white border border-gray-300 text-[10px] uppercase font-bold py-2 px-3 rounded hover:bg-gray-50"
                                            >
                                                Print
                                            </button>
                                        </div>
                                        {/* Hidden Packing Slip logic would go here or via print styles */}
                                    </div>
                                ))}
                                {stageOrders.length === 0 && (
                                    <div className="h-full flex items-center justify-center text-gray-400 text-xs italic">
                                        No orders
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FulfillmentDashboard;
