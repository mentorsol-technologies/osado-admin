// utils/validationSchemas.js or schemas/auth.js
import { z } from 'zod'

// Common field schemas
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^\d{8}$/, 'Phone number must be exactly 8 digits (Kuwait format)')

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={[}\]|\\:;"'<>,.?/~`])/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  )

export const confirmPasswordSchema = (passwordField = 'password') =>
  z.string().min(1, 'Please confirm your password')

// Email schema for additional auth forms
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

// Name schemas
export const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .min(2, 'First name must be at least 2 characters')
  .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters and spaces')

export const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .min(2, 'Last name must be at least 2 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters and spaces')

// Composite schemas for different forms
export const loginSchema = z.object({
  phone: phoneSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
})

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters long')
    .refine((val) => val.trim().length >= 2, {
      message: 'Full name is required and must be at least 2 characters',
    }),
  phone: phoneSchema,
  password: passwordSchema,
})

export const forgotPasswordSchema = z.object({
  phone: phoneSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'], // This ensures the error appears under confirmPassword field
  })
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: confirmPasswordSchema(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  })

// OTP verification schema
export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP is required')
    .regex(/^\d{4,6}$/, 'OTP must be 4-6 digits'),
})

// Profile update schema
export const profileUpdateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters long')
    .refine((val) => val.trim().length >= 2, {
      message: 'Full name is required and must be at least 2 characters',
    }),
  phone: phoneSchema,
  email: emailSchema,
})
