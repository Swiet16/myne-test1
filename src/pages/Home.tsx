import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingBag, 
  Zap, 
  Shield, 
  Crown,
  Star,
  TrendingUp
} from 'lucide-react';

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

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (*)
        `)
        .eq('is_active', true)
        .limit(6);

      if (error) throw error;
      setFeaturedProducts(products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Delivery",
      description: "Get your digital products instantly after purchase approval"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Multiple payment methods with secure verification process"
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: "Premium Quality",
      description: "Hand-picked premium digital products and services"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 animated-bg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-gold/20 backdrop-blur-sm" />
        
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="neon-text">Myne7x</span>{' '}
                <span className="gold-text">Store</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-2xl mx-auto">
                Premium digital marketplace for exclusive products and services
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button 
                  size="lg" 
                  className="gradient-primary hover:shadow-glow text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/shop">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Explore Store
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/50 hover:border-primary text-lg px-8 py-6"
                  asChild
                >
                  <Link to="/about">
                    Learn More
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
                {[
                  { label: "Products", value: "100+" },
                  { label: "Happy Customers", value: "1000+" },
                  { label: "Success Rate", value: "99%" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-3xl font-bold text-primary mb-1">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose <span className="text-primary">Myne7x Store</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience the future of digital commerce with our cutting-edge platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-8 hover-3d bg-gradient-card border-border/40">
                  <CardContent className="space-y-4">
                    <div className="text-primary mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Star className="inline w-8 h-8 text-gold mr-2" />
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our most popular and trending digital products
            </p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-card animate-pulse rounded-lg" />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products available at the moment. Check back soon!
              </p>
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Button 
              size="lg" 
              className="gradient-gold hover:shadow-gold-glow" 
              asChild
            >
              <Link to="/shop">
                <TrendingUp className="w-5 h-5 mr-2" />
                View All Products
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="p-12 bg-gradient-card border-border/40 hover-3d">
              <CardContent className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Ready to Start Shopping?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Join thousands of satisfied customers and discover premium digital products at Myne7x Store
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gradient-neon hover:shadow-neon text-lg px-8"
                    asChild
                  >
                    <Link to="/auth?mode=signup">
                      Get Started Now
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary/50 hover:border-primary text-lg px-8"
                    asChild
                  >
                    <Link to="/about">
                      Learn About Us
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
}