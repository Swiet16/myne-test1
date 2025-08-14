-- Myne7x-Store Database Schema
-- Create all tables, RLS policies, and initial data

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role as enum ('admin', 'user');
CREATE TYPE public.order_status as enum ('pending', 'approved', 'rejected');

-- Create user roles table
CREATE TABLE public.user_roles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    role app_role not null default 'user',
    created_at timestamp with time zone default now(),
    unique (user_id, role)
);

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null unique,
    display_name text,
    avatar_url text,
    whatsapp_number text,
    telegram_handle text,
    facebook_link text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create products table
CREATE TABLE public.products (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    price decimal(10,2) not null,
    category text,
    tags text[],
    asset_url text,
    is_active boolean default true,
    created_by uuid references auth.users(id) not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create product images table
CREATE TABLE public.product_images (
    id uuid primary key default gen_random_uuid(),
    product_id uuid references public.products(id) on delete cascade not null,
    image_url text not null,
    is_primary boolean default false,
    sort_order integer default 0,
    created_at timestamp with time zone default now()
);

-- Create orders table
CREATE TABLE public.orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    total_amount decimal(10,2) not null,
    status order_status default 'pending',
    payment_method_description text not null,
    payment_proof_url text,
    contact_method text not null,
    notes text,
    approved_at timestamp with time zone,
    approved_by uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    CONSTRAINT payment_description_length CHECK (char_length(payment_method_description) >= 15)
);

-- Create order items table
CREATE TABLE public.order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) not null,
    quantity integer not null default 1,
    unit_price decimal(10,2) not null,
    total_price decimal(10,2) not null,
    download_url text,
    download_expires_at timestamp with time zone,
    created_at timestamp with time zone default now()
);

-- Create chats table
CREATE TABLE public.chats (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    last_message_at timestamp with time zone default now(),
    is_read_by_admin boolean default false,
    created_at timestamp with time zone default now()
);

-- Create messages table
CREATE TABLE public.messages (
    id uuid primary key default gen_random_uuid(),
    chat_id uuid references public.chats(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    content text not null,
    is_from_admin boolean default false,
    created_at timestamp with time zone default now()
);

-- Enable Row Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = user_uuid 
  ORDER BY created_at DESC 
  LIMIT 1;
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = user_uuid AND role = 'admin'
  );
$$;

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own role" ON public.user_roles
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert roles" ON public.user_roles
FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Products are viewable by everyone" ON public.products
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can view all products" ON public.products
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert products" ON public.products
FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can update products" ON public.products
FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can delete products" ON public.products
FOR DELETE USING (public.is_admin(auth.uid()));

-- RLS Policies for product_images
CREATE POLICY "Product images are viewable by everyone" ON public.product_images
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage product images" ON public.product_images
FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON public.orders
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own orders" ON public.orders
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Only admins can update orders" ON public.orders
FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for order_items
CREATE POLICY "Users can view their own order items" ON public.order_items
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all order items" ON public.order_items
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create order items for their orders" ON public.order_items
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);

CREATE POLICY "Only admins can update order items" ON public.order_items
FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats" ON public.chats
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chats" ON public.chats
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own chat" ON public.chats
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update chats" ON public.chats
FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their chats" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = messages.chat_id 
    AND chats.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can view all messages" ON public.messages
FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can send messages to their chats" ON public.messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chats 
    WHERE chats.id = messages.chat_id 
    AND chats.user_id = auth.uid()
  )
);

CREATE POLICY "Admins can send messages to any chat" ON public.messages
FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  
  -- Check if this is the admin email and assign admin role
  IF new.email = 'Myne7x@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (new.id, 'user');
  END IF;
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets (run these commands in Supabase dashboard)
INSERT INTO storage.buckets (id, name, public) VALUES ('public-products', 'public-products', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('private-attachments', 'private-attachments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage policies for public-products bucket
CREATE POLICY "Public product images are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'public-products');

CREATE POLICY "Only admins can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'public-products' AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Only admins can update product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'public-products' AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Only admins can delete product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'public-products' AND 
  public.is_admin(auth.uid())
);

-- Storage policies for private-attachments bucket
CREATE POLICY "Users can view their own payment proofs" ON storage.objects
FOR SELECT USING (
  bucket_id = 'private-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all private attachments" ON storage.objects
FOR SELECT USING (
  bucket_id = 'private-attachments' AND 
  public.is_admin(auth.uid())
);

CREATE POLICY "Users can upload their own payment proofs" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'private-attachments' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for assets bucket
CREATE POLICY "Assets are viewable by everyone" ON storage.objects
FOR SELECT USING (bucket_id = 'assets');

CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'assets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'assets' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can manage all assets" ON storage.objects
FOR ALL USING (
  bucket_id = 'assets' AND 
  public.is_admin(auth.uid())
);

-- Enable realtime for chat functionality
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;