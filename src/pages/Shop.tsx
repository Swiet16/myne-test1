import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  created_at: string;
  product_images: { image_url: string; is_primary: boolean }[];
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('is_active', true);

      if (error) throw error;
      
      setProducts(products || []);
      
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(products?.map(p => p.category).filter(Boolean))
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    setFilteredProducts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('newest');
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="neon-text">Premium</span> Digital Store
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our collection of exclusive digital products and services
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-card border-border/40">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* Clear Filters */}
                <Button variant="outline" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </p>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-card animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or filters
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}