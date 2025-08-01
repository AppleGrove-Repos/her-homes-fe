import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactInfo() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="text-rose-700 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-medium">Office Address</h3>
            <p className="text-gray-600">
              15 Cedar Avenue, Ikoyi, Lagos, Nigeria
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="text-rose-700 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-medium">Phone Number</h3>
            <p className="text-gray-600">+234 701 234 5678</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Mail className="text-rose-700 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-medium">Email Address</h3>
            <p className="text-gray-600">info@herhomes.com</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Clock className="text-rose-700 h-5 w-5 mt-0.5" />
          <div>
            <h3 className="font-medium">Office Hours</h3>
            <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
          </div>
        </div>
      </div>
    </div>
  )
}
