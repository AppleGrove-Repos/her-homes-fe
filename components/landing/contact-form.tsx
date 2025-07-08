'use client'

import type React from 'react'

import { useState } from 'react'
import Button  from '@/components/common/button/index'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { contactUS } from '@/lib/services/auth.service'
// import { ContactUsDto } from '@/lib/types'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ContactUsDto {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string 
  inquiryReason: string
  message: string
}

interface ContactFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  reason: string
  message: string
}
export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    reason: '',
    message: '',
  })
   const contactMutation = useMutation({
     mutationFn: contactUS,
     onSuccess: (data) => {
       console.log('Contact form submitted successfully:', data)
       // Clear form on success
       setFormData({
         firstName: '',
         lastName: '',
         email: '',
         phone: '',
         reason: '',
         message: '',
       })
       // Success toast is already handled in the API function
     },
     onError: (error: Error) => {
       console.error('Contact form submission failed:', error)
       // Error toast is already handled in the API function
     },
   })

 const handleChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
   const { name, value } = e.target
   setFormData((prev) => ({ ...prev, [name]: value }))
 }

 const handleSelectChange = (value: string) => {
   setFormData((prev) => ({ ...prev, reason: value }))
 }

 const validateForm = (): boolean => {
   const requiredFields = [
     'firstName',
     'lastName',
     'email',
     'reason',
     'message',
   ]

   for (const field of requiredFields) {
     if (!formData[field as keyof ContactFormData]?.trim()) {
       toast.error(
         `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
       )
       return false
     }
   }

   // Email validation
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
   if (!emailRegex.test(formData.email)) {
     toast.error('Please enter a valid email address')
     return false
   }

   // Phone validation (if provided)
   if (formData.phone && formData.phone.trim()) {
     const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
     if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
       toast.error('Please enter a valid phone number')
       return false
     }
   }

   return true
 }

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()

   // Validate form
   if (!validateForm()) {
     return
   }

   // Prepare data for API
   const submitData: ContactUsDto = {
     firstName: formData.firstName.trim(),
     lastName: formData.lastName.trim(),
     email: formData.email.trim(),
     phoneNumber: formData.phone.trim(),
     inquiryReason: formData.reason,
     message: formData.message.trim(),
   }

   // Submit using mutation
   contactMutation.mutate(submitData)
 }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium mb-1">
            First Name
          </label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium mb-1">
            Last Name
          </label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>


        <div>
          <label htmlFor="reason" className="block text-sm font-medium mb-1">
            Reason for Inquiry
          </label>
          <Select onValueChange={handleSelectChange} value={formData.reason}>
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="property-inquiry">Property Inquiry</SelectItem>
              <SelectItem value="financing">Financing Options</SelectItem>
              <SelectItem value="appointment">Schedule Appointment</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className="min-h-[120px]"
            required
          />
        </div>

        <Button type="submit"  className="w-full min-w-[100%] text-center pl-40 text-white bg-rose-900 hover:bg-rose-800">
          Submit
        </Button>
      </div>
    </form>
  )
}
