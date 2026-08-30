-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS (extends Supabase auth.users)
create type user_role as enum ('CUSTOMER', 'SELLER', 'ADMIN');
create table public.users (
  id uuid references auth.users not null primary key,
  role user_role default 'CUSTOMER',
  email varchar not null,
  first_name varchar,
  last_name varchar,
  phone_number varchar,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
-- Setup RLS
alter table public.users enable row level security;
create policy "Users can view own data" on public.users for select using (auth.uid() = id);

-- 2. PRODUCTS
create type product_condition as enum ('NEW', 'USED', 'REFURBISHED');
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name varchar not null,
  brand varchar not null,
  model varchar,
  condition product_condition default 'NEW',
  price numeric(10,2) not null,
  cost_price numeric(10,2),
  stock_quantity integer default 0,
  description text,
  images text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.products enable row level security;
create policy "Products are viewable by everyone" on public.products for select using (true);

-- 3. SALES
create type sale_status as enum ('PENDING', 'PAID', 'CANCELLED', 'REFUNDED');
create type payment_method as enum ('CASH', 'CREDIT_CARD', 'MOBILE_MONEY', 'INSTALLMENTS', 'TRADE_IN');
create table public.sales (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.users(id),
  seller_id uuid references public.users(id),
  total_amount numeric(10,2) not null,
  status sale_status default 'PENDING',
  payment_method payment_method not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SALE ITEMS
create table public.sale_items (
  id uuid default uuid_generate_v4() primary key,
  sale_id uuid references public.sales(id) on delete cascade,
  product_id uuid references public.products(id),
  quantity integer not null,
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

-- 5. CREDITS / INSTALLMENTS
create type credit_status as enum ('ACTIVE', 'COMPLETED', 'DEFAULTED');
create table public.credits (
  id uuid default uuid_generate_v4() primary key,
  sale_id uuid references public.sales(id),
  customer_id uuid references public.users(id),
  total_credit_amount numeric(10,2) not null,
  status credit_status default 'ACTIVE',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. INSTALLMENTS PAYMENTS
create type payment_status as enum ('PENDING', 'PAID', 'LATE');
create table public.installment_payments (
  id uuid default uuid_generate_v4() primary key,
  credit_id uuid references public.credits(id) on delete cascade,
  amount_due numeric(10,2) not null,
  amount_paid numeric(10,2) default 0,
  due_date date not null,
  paid_date date,
  status payment_status default 'PENDING'
);

-- 7. NEGOTIATIONS
create type negotiation_status as enum ('PENDING', 'ACCEPTED', 'REJECTED', 'COUNTER_OFFER');
create table public.negotiations (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id),
  customer_id uuid references public.users(id),
  proposed_price numeric(10,2) not null,
  seller_response numeric(10,2),
  status negotiation_status default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. TRADE_INS
create type trade_in_status as enum ('REQUESTED', 'INSPECTED', 'ACCEPTED', 'REJECTED');
create table public.trade_ins (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.users(id),
  sale_id uuid references public.sales(id),
  device_model varchar not null,
  device_condition varchar not null,
  estimated_value numeric(10,2),
  agreed_value numeric(10,2),
  status trade_in_status default 'REQUESTED',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. REVIEWS
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references public.products(id),
  customer_id uuid references public.users(id),
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  is_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. NOTIFICATIONS
create type notification_type as enum ('INFO', 'SALE', 'PAYMENT_REMINDER', 'TRADE_IN', 'NEGOTIATION');
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id),
  title varchar not null,
  message text not null,
  type notification_type default 'INFO',
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. STORAGE BUCKETS (product-images)
-- Assurez-vous d'activer l'extension "storage" ou que Supabase l'a activé par défaut.
insert into storage.buckets (id, name, public) 
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Stratégies RLS (Policies) pour le Bucket (Public pour lecture, tout le monde pour l'upload pour démo, à sécuriser plus tard)
create policy "Images publiques 1" on storage.objects for select using ( bucket_id = 'product-images' );
create policy "Uploads permis 1" on storage.objects for insert with check ( bucket_id = 'product-images' );
