import { useState, useEffect, useCallback } from 'react';
import { supabase, SupabaseProduct } from '../supabaseClient';
import { PIZZAS, PizzaProductExtended, SizeOption } from '../constants';

interface UseProductsReturn {
    products: PizzaProductExtended[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Transform Supabase product to app product format
const transformProduct = (product: SupabaseProduct): PizzaProductExtended => ({
    id: product.id,
    name: product.name,
    tagline: product.tagline || '',
    description: product.description || '',
    price: product.size_options[0]?.price || 'Rs. 0',
    color: product.color,
    ingredients: product.ingredients || [],
    image: product.image_url || '',
    videoBackground: '',
    category: product.category as PizzaProductExtended['category'],
    sizeOptions: product.size_options as SizeOption[],
});

export const useProducts = (): UseProductsReturn => {
    const [products, setProducts] = useState<PizzaProductExtended[]>(PIZZAS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .eq('is_visible', true)
                .order('display_order', { ascending: true });

            if (fetchError) {
                console.warn('Supabase fetch error, using mock data:', fetchError.message);
                setProducts(PIZZAS);
                return;
            }

            if (data && data.length > 0) {
                const transformedProducts = data.map(transformProduct);
                setProducts(transformedProducts);
            } else {
                // No products in database, use mock data
                setProducts(PIZZAS);
            }
        } catch (err) {
            console.warn('Failed to fetch products, using mock data:', err);
            setProducts(PIZZAS);
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return { products, loading, error, refetch: fetchProducts };
};

// Hook for fetching raw products for admin
export const useAdminProducts = () => {
    const [products, setProducts] = useState<SupabaseProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('products')
                .select('*')
                .order('display_order', { ascending: true });

            if (fetchError) throw fetchError;
            setProducts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const deleteProduct = async (id: string) => {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) {
            setProducts(prev => prev.filter(p => p.id !== id));
        }
        return { error };
    };

    const toggleVisibility = async (id: string, isVisible: boolean) => {
        const { error } = await supabase
            .from('products')
            .update({ is_visible: isVisible })
            .eq('id', id);
        if (!error) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_visible: isVisible } : p));
        }
        return { error };
    };

    const toggleFeatured = async (id: string, isFeatured: boolean) => {
        const { error } = await supabase
            .from('products')
            .update({ is_featured: isFeatured })
            .eq('id', id);
        if (!error) {
            setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: isFeatured } : p));
        }
        return { error };
    };

    return {
        products,
        loading,
        error,
        refetch: fetchProducts,
        deleteProduct,
        toggleVisibility,
        toggleFeatured,
        updateDisplayOrder: async (items: { id: string; display_order: number }[]) => {
            // Optimistic update
            setProducts(prev => {
                const newProducts = [...prev];
                items.forEach(item => {
                    const idx = newProducts.findIndex(p => p.id === item.id);
                    if (idx !== -1) {
                        newProducts[idx] = { ...newProducts[idx], display_order: item.display_order };
                    }
                });
                return newProducts.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            });

            console.log('Sending reorder update to Supabase:', items);

            // Using sequential updates to ensure RLS/Constraint reliability
            // (Upsert can be tricky with partial data if not all required fields are present)
            let error = null;
            for (const item of items) {
                const { error: reqError } = await supabase
                    .from('products')
                    .update({ display_order: item.display_order }) // Explicitly update only this field
                    .eq('id', item.id);

                if (reqError) {
                    console.error('Failed to update order for item:', item.id, reqError);
                    error = reqError; // Capture last error
                }
            }

            return { error };
        }
    };
};
