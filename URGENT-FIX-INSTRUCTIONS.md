# 🚨 URGENT FIX INSTRUCTIONS

## Issue: Weight Entries Table Missing

The `weight_entries` table was not created properly, causing 404 errors.

## 🎯 SOLUTION 1: Create Weight Entries Table (Recommended)

### Step 1: Create the Table
1. **Go to:** https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/sql
2. **Copy and paste this SQL EXACTLY:**

```sql
CREATE TABLE public.weight_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  weight NUMERIC NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight entries" 
  ON public.weight_entries FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries" 
  ON public.weight_entries FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX weight_entries_user_id_date_idx 
  ON public.weight_entries (user_id, date DESC);
```

3. **Click "Run"**
4. **Look for "Success" message**

---

## 🔧 SOLUTION 2: Fix Anni's Email (REQUIRED)

### Step 1: Confirm Anni's Email
1. **Go to:** https://supabase.com/dashboard/project/rjppzjhkarsgzvemdkqf/auth/users
2. **Find:** nopanenanni7@gmail.com
3. **Click the three dots (⋯)** next to her user
4. **Select "Confirm User"**

---

## 🧪 TEST AFTER FIXING

1. **Go to:** https://honeymoon-shape.vercel.app
2. **Login as Anni:** nopanenanni7@gmail.com / Kuntoon2026
3. **Go to Weight tab**
4. **Try adding a weight entry**
5. **Should work without errors!**

---

## ⚡ ALTERNATIVE: Quick Fix (If SQL doesn't work)

If the SQL fails, I can modify the app to use the existing `profiles` table for weight storage instead of creating a new table. Let me know if you need this approach.
