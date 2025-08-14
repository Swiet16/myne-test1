import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';

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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.product_images?.find(img => img.is_primary)?.image_url 
    || product.product_images?.[0]?.image_url 
    || '/placeholder.svg';

  return (
    <motion.div
      className="group"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card className="overflow-hidden bg-gradient-card border-border/40 hover-3d shine">
        <CardContent className="p-0">
          <div className="relative overflow-hidden">
            <motion.img
              src={primaryImage}
              alt={product.title}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              whileHover={{ scale: 1.1 }}
            />
            
            {/* Overlay with actions */}
            <motion.div
              className="absolute inset-0 bg-black/60 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <Button size="sm" variant="secondary" className="neon-glow" asChild>
                <Link to={`/product/${product.id}`}>
                  <Eye className="w-4 h-4 mr-2" />
                  View
                </Link>
              </Button>
              <Button size="sm" className="gradient-neon" asChild>
                <Link to={`/checkout/${product.id}`}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy
                </Link>
              </Button>
            </motion.div>

            {/* Category badge */}
            {product.category && (
              <Badge 
                className="absolute top-2 left-2 gradient-gold text-gold-foreground"
                variant="secondary"
              >
                {product.category}
              </Badge>
            )}

            {/* Price badge */}
            <Badge 
              className="absolute top-2 right-2 bg-background/90 text-foreground font-bold"
              variant="outline"
            >
              ${product.price}
            </Badge>
          </div>

          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
              {product.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 border-primary/30"
                  >
                    {tag}
                  </Badge>
                ))}
                {product.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{product.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <motion.div 
            className="w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              className="w-full gradient-primary hover:shadow-glow transition-all duration-300" 
              asChild
            >
              <Link to={`/product/${product.id}`}>
                View Details
              </Link>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}