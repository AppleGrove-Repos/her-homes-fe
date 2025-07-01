'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Rocket, Puzzle, Users } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export function PartnershipContent() {
  const [formData, setFormData] = useState({
    institutionName: '',
    contactPerson: '',
    contactRole: '',
    email: '',
    phoneNumber: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const benefits = [
    {
      image: '/assets/images/acc-icon.png',
      title: 'Accelerated Growth',
      description:
        "Leverage our platform and expertise to accelerate your institution's digital transformation and growth initiatives.",
    },
    {
      image: '/assets/images/custom-icon.png',
      title: 'Custom Solutions',
      description:
        "Receive tailored solutions and dedicated support designed specifically for your institution's unique needs.",
    },
    {
      image: '/assets/images/network-icon.png',
      title: 'Network Access',
      description:
        'Connect with our extensive network of partners, experts, and resources to expand your reach and capabilities.',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-[#546B2F]/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-[35px] font-bold text-gray-900 mb-6">
            Partner With Us
          </h1>
          <p className="md:text-[16px] text-[12px] text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join our network of institutional partners and unlock new
            opportunities for collaboration and growth
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-[5px] shadow-sm">
            <span className="text-[12px] text-[#4CAF50] font-medium">
              Trusted by 50+ institutions worldwide
            </span>
          </div>
        </div>
      </section>

      {/* Partnership Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-[27px] font-semibold text-gray-900 mb-4">
                Start your partnership journey
              </h2>
              <p className="text-gray-600 text-[12px] md:text-[15px] font-light leading-relaxed">
                We're excited to explore partnership opportunities with your
                institution. Fill out the form and our partnership team will get
                back to you within 24 hours.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-[#546B2F]/5 rounded-lg p-8 shadow-sm"
            >
              <div className="space-y-6">
                {/* Institution Name */}
                <div>
                  <Label
                    htmlFor="institutionName"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Institution Name*
                  </Label>
                  <Input
                    id="institutionName"
                    type="text"
                    placeholder="Enter your institution name"
                    value={formData.institutionName}
                    onChange={(e) =>
                      handleInputChange('institutionName', e.target.value)
                    }
                    className="w-full h-12 px-4 border bg-white border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Contact Person */}
                <div>
                  <Label
                    htmlFor="contactPerson"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Contact Person*
                  </Label>
                  <Input
                    id="contactPerson"
                    type="text"
                    placeholder="John Smith"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      handleInputChange('contactPerson', e.target.value)
                    }
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Contact Person's Role */}
                <div>
                  <Label
                    htmlFor="contactRole"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Contact Person's Role*
                  </Label>
                  <Input
                    id="contactRole"
                    type="text"
                    placeholder="Director of Partnerships"
                    value={formData.contactRole}
                    onChange={(e) =>
                      handleInputChange('contactRole', e.target.value)
                    }
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email Address */}
                <div>
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Email Address*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@institution"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full h-12 px-4 bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700 mb-2 block"
                  >
                    Phone number*
                  </Label>
                  <PhoneInput
                    country={'ng'}
                    value={formData.phoneNumber}
                    onChange={(value) =>
                      setFormData((prev) => ({ ...prev, phoneNumber: value }))
                    }
                    enableSearch={true}
                    inputProps={{
                      name: 'phoneNumber',
                      required: true,
                      id: 'phoneNumber',
                      autoFocus: false,
                    }}
                    containerClass="!w-full px-4 bg-white !rounded-md !border !border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    inputClass="!w-full !py-4 !pl-16 !pr-4 !text-sm !rounded-md !border-none focus:!outline-none"
                    buttonClass="!bg-transparent !border-none"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#546B2F] hover:bg-green-800 text-white font-medium rounded-md flex items-center justify-center gap-2"
                >
                  <Image
                    src="/assets/images/message-icon.png"
                    alt="Check"
                    width={20}
                    height={20}
                  />
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-[#546B2F]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Partnership Benefits
            </h2>
            <p className="text-gray-600 max-w-2xl md:text-[15px] text-[12px] mx-auto leading-relaxed">
              Discover the advantages of partnering with us and how we can help
              your institution thrive
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-52 max-w-[1200px] mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-left rounded-[10px] bg-white px-10 py-6 shadow-sm w-[400px] mx-auto"
              >
                {/* <div className="w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6 bg-blue-50"> */}
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                {/* </div> */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 mt-4" >
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-[13px] leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
