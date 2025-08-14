import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  MessageCircle,
  Crown 
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserRole {
  role: 'admin' | 'user';
}

export default function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single();
    
    setUserRole(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
  ];

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.div
            className="text-2xl font-bold neon-text"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Myne7x
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full"
                  layoutId="activeTab"
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Chat icon for authenticated users */}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/chat">
                  <MessageCircle className="h-5 w-5" />
                </Link>
              </Button>

              {/* Admin dashboard link */}
              {userRole?.role === 'admin' && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin" className="flex items-center space-x-1">
                    <Crown className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}

              {/* User menu */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline ml-2">Profile</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link to="/auth?mode=signup">Sign Up</Link>
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="md:hidden border-t border-border/40 bg-background"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}