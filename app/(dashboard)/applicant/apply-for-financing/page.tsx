'use client'

import type React from 'react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, FileText } from 'lucide-react'
import { ApplicationReviewAnimation } from '@/components/applicants/applyfor'
import Header from '@/components/landing/header'
import { ArrowLeft } from 'lucide-react'

export default function ApplyFinancing() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    desiredLoanAmount: '',
    foundProperty: '',
    totalPropertyPrice: '',
    preferredRepaymentPeriod: '',
    maximumMonthlyPayment: '',
    ownExistingProperty: '',
    documents: [] as File[],
  })

  const [submitted, setSubmitted] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  // Back button handler
  const handleBack = () => {
    router.back()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement

    if (type === 'radio') {
      setFormData({
        ...formData,
        [name]: value,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        setFormData({
          ...formData,
          documents: [
            ...formData.documents,
            ...Array.from(e.target.files || []),
          ],
        })
        setIsUploading(false)
      }, 1000)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()

    if (e.dataTransfer.files) {
      setIsUploading(true)

      // Simulate upload delay
      setTimeout(() => {
        setFormData({
          ...formData,
          documents: [
            ...formData.documents,
            ...Array.from(e.dataTransfer.files),
          ],
        })
        setIsUploading(false)
      }, 1000)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeFile = (index: number) => {
    const newDocuments = [...formData.documents]
    newDocuments.splice(index, 1)
    setFormData({
      ...formData,
      documents: newDocuments,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setSubmitted(true)

    // You would typically send the form data to your backend here
    console.log('Form submitted:', formData)
  }

  const repaymentOptions = [
    { value: '5', label: '5 years' },
    { value: '10', label: '10 years' },
    { value: '15', label: '15 years' },
    { value: '20', label: '20 years' },
    { value: '25', label: '25 years' },
    { value: '30', label: '30 years' },
  ]

  if (submitted) {
    return <ApplicationReviewAnimation />
  }

  return (
    <div className="overflow-hidden">
      <Header />
      <div className="max-w-[500px] mx-auto bg-white p-6 rounded-lg shadow-sm">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-maroon-700 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        <motion.h1
          className="text-xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Secure your future with the right home financing
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              Phone*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label
                htmlFor="desiredLoanAmount"
                className="block text-sm font-medium mb-1"
              >
                Desired Loan Amount*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  NGN
                </span>
                <input
                  type="number"
                  id="desiredLoanAmount"
                  name="desiredLoanAmount"
                  value={formData.desiredLoanAmount}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Found a Property yet?
              </label>
              <div className="flex gap-4 mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="foundProperty"
                    value="yes"
                    checked={formData.foundProperty === 'yes'}
                    onChange={handleInputChange}
                    className="form-radio text-maroon-600"
                  />
                  <span className="ml-2 text-sm">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="foundProperty"
                    value="no"
                    checked={formData.foundProperty === 'no'}
                    onChange={handleInputChange}
                    className="form-radio text-maroon-600"
                  />
                  <span className="ml-2 text-sm">No</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="totalPropertyPrice"
              className="block text-sm font-medium mb-1"
            >
              Total Property Price*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                NGN
              </span>
              <input
                type="number"
                id="totalPropertyPrice"
                name="totalPropertyPrice"
                value={formData.totalPropertyPrice}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="preferredRepaymentPeriod"
              className="block text-sm font-medium mb-1"
            >
              Preferred Repayment Period (Max 30 years)*
            </label>
            <select
              id="preferredRepaymentPeriod"
              name="preferredRepaymentPeriod"
              value={formData.preferredRepaymentPeriod}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500 appearance-none bg-white"
            >
              <option value="" disabled>
                Make a selection
              </option>
              {repaymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="maximumMonthlyPayment"
              className="block text-sm font-medium mb-1"
            >
              Maximum Monthly Payment You Can Afford*
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                NGN
              </span>
              <input
                type="number"
                id="maximumMonthlyPayment"
                name="maximumMonthlyPayment"
                value={formData.maximumMonthlyPayment}
                onChange={handleInputChange}
                placeholder="0.00"
                required
                className="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-maroon-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Do You Own an Existing Property?
            </label>
            <div className="flex gap-4 mt-2">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="ownExistingProperty"
                  value="yes"
                  checked={formData.ownExistingProperty === 'yes'}
                  onChange={handleInputChange}
                  className="form-radio text-maroon-600"
                />
                <span className="ml-2 text-sm">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="ownExistingProperty"
                  value="no"
                  checked={formData.ownExistingProperty === 'no'}
                  onChange={handleInputChange}
                  className="form-radio text-maroon-600"
                />
                <span className="ml-2 text-sm">No</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Identification Documents*
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Make sure to upload both the front and back of the document for
              verification.
            </p>

            <div
              className={`border-2 border-dashed rounded-md p-4 text-center ${
                isUploading
                  ? 'border-maroon-300 bg-maroon-50'
                  : 'border-gray-300'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: 'linear',
                    }}
                  >
                    <Upload className="h-8 w-8 text-maroon-500" />
                  </motion.div>
                  <p className="mt-2 text-sm text-maroon-600">Uploading...</p>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    id="documents"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center py-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Drag and drop or browse your files
                      </p>
                    </div>
                  </label>
                </>
              )}
            </div>

            {formData.documents.length > 0 && (
              <ul className="mt-3 divide-y divide-gray-200 border rounded-md">
                {formData.documents.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between py-2 px-3"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-maroon-500 mr-2" />
                      <span className="text-sm truncate max-w-[180px]">
                        {file.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 bg-maroon-700 bg-[#7D1F2C] text-white rounded-md hover:bg-maroon-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Submit Application
          </motion.button>
        </form>
      </div>
    </div>
  )
}
