import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Crown, 
  Star, 
  Trophy, 
  Users, 
  Heart,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  const achievements = [
    { icon: <Users className="w-8 h-8" />, title: "1000+", description: "Happy Customers" },
    { icon: <Star className="w-8 h-8" />, title: "4.9★", description: "Average Rating" },
    { icon: <Trophy className="w-8 h-8" />, title: "99%", description: "Success Rate" },
    { icon: <Shield className="w-8 h-8" />, title: "100%", description: "Secure" }
  ];

  const values = [
    {
      icon: <Crown className="w-12 h-12" />,
      title: "Premium Quality",
      description: "We curate only the finest digital products and services, ensuring every purchase meets our high standards of excellence."
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: "Lightning Fast",
      description: "Instant delivery and rapid customer support. Your time is valuable, and we respect that with our efficient processes."
    },
    {
      icon: <Heart className="w-12 h-12" />,
      title: "Customer First",
      description: "Every decision we make puts our customers at the center. Your satisfaction and success drive everything we do."
    },
    {
      icon: <Target className="w-12 h-12" />,
      title: "Innovation Focus",
      description: "We constantly evolve and adapt to bring you the latest and most innovative digital solutions available."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 animated-bg">
        <div className="container">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meet <span className="neon-text">Myne Winner</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              CEO & Founder of Myne7x Store
            </p>
            <div className="flex justify-center mb-12">
              <motion.div
                className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-neon p-1"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                  <Crown className="w-16 h-16 md:w-20 md:h-20 text-primary" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-6 text-lg leading-relaxed">
                  Founded with a vision to revolutionize the digital marketplace, Myne7x Store began as a dream to create 
                  a premium platform where quality meets innovation. Our CEO, Myne Winner, recognized the gap in the market 
                  for truly exceptional digital products and services.
                </p>
                <p className="mb-6 text-lg leading-relaxed">
                  What started as a small initiative has grown into a trusted marketplace serving thousands of customers 
                  worldwide. We believe that everyone deserves access to premium digital solutions, and we're committed 
                  to making that vision a reality.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, Myne7x Store stands as a testament to our dedication to excellence, innovation, and customer 
                  satisfaction. Every product in our collection is carefully selected to meet our stringent quality standards.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Achievements</h2>
            <p className="text-muted-foreground text-lg">Numbers that speak for themselves</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover-3d bg-gradient-card border-border/40">
                  <CardContent className="space-y-4">
                    <div className="text-primary mx-auto">
                      {achievement.icon}
                    </div>
                    <div className="text-3xl font-bold text-primary">
                      {achievement.title}
                    </div>
                    <div className="text-muted-foreground">
                      {achievement.description}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Myne7x Store
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-8 hover-3d bg-gradient-card border-border/40 h-full">
                  <CardContent className="space-y-4">
                    <div className="text-primary">
                      {value.icon}
                    </div>
                    <h3 className="text-2xl font-semibold">{value.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 animated-bg">
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
                  Ready to Experience Excellence?
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Join thousands of satisfied customers who trust Myne7x Store for their digital needs.
                  Start your premium shopping experience today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="gradient-neon hover:shadow-neon text-lg px-8"
                    asChild
                  >
                    <Link to="/shop">
                      Explore Products
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-primary/50 hover:border-primary text-lg px-8"
                    asChild
                  >
                    <Link to="/auth">
                      Get Started
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