-- Create super admin script
-- This script creates valancikas@gmail.com as super admin

-- First, check if user exists and create if not
INSERT INTO users (id, email, password, name, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::text,
  'valancikas@gmail.com',
  -- Password: Admin123! (bcrypt hashed)
  '$2b$10$YourHashedPasswordHere', 
  'Super Admin',
  'super_admin',
  NOW(),
  NOW()
)
ON CONFLICT (email) 
DO UPDATE SET 
  role = 'super_admin',
  name = 'Super Admin',
  "updatedAt" = NOW();

-- Confirm
SELECT id, email, name, role, "createdAt" 
FROM users 
WHERE email = 'valancikas@gmail.com';
