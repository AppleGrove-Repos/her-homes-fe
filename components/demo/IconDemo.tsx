'use client'

import React from 'react'
import { getFeatureIcon, getSpecificationIcon, formatTextForDisplay } from '@/lib/utils/icon-utils'

export default function IconDemo() {
  const features = [
    'Swimming Pool',
    'Gym',
    'Security',
    'Parking',
    'Garden',
    'Modern Kitchen',
    'En-suite Bathroom',
    'POP Ceiling',
    'Marble Flooring',
    'CCTV Infrastructure',
    'Generator',
    'WiFi',
    'Air Conditioning',
    'Fireplace',
    'Balcony',
    'Terrace',
    'Study Room',
    'Dining Area',
    'Living Room',
    'Garage'
  ]

  const specifications = [
    'Bedrooms',
    'Bathrooms',
    'Area',
    'Floor',
    'Parking Slots',
    'Kitchen Size',
    'Balcony Area',
    'Terrace Size',
    'Study Room',
    'Dining Area'
  ]

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Icon Utility Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Features Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Features with Auto Icons</h2>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {getFeatureIcon(feature)}
                <span className="text-sm">{formatTextForDisplay(feature)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Specifications Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Specifications with Auto Icons</h2>
          <div className="space-y-3">
            {specifications.map((spec, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                {getSpecificationIcon(spec)}
                <span className="text-sm">{formatTextForDisplay(spec)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">How it works:</h3>
        <ul className="space-y-2 text-sm">
          <li>• Pass any text to <code className="bg-gray-200 px-1 rounded">getFeatureIcon()</code> or <code className="bg-gray-200 px-1 rounded">getSpecificationIcon()</code></li>
          <li>• The utility automatically matches keywords in the text to appropriate icons</li>
          <li>• Uses React Icons (FontAwesome) for consistent, high-quality icons</li>
          <li>• Falls back to a question mark icon if no match is found</li>
          <li>• <code className="bg-gray-200 px-1 rounded">formatTextForDisplay()</code> formats text for better display</li>
        </ul>
      </div>
    </div>
  )
} 