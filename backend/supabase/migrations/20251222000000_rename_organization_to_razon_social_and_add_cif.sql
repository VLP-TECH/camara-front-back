-- Rename organization column to razon_social
ALTER TABLE public.profiles
RENAME COLUMN organization TO razon_social;

-- Add CIF column
ALTER TABLE public.profiles
ADD COLUMN cif TEXT;

-- Create index for CIF lookups (optional, but useful for searches)
CREATE INDEX IF NOT EXISTS idx_profiles_cif ON public.profiles(cif);

