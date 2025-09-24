export interface DeveloperSignupData {
  fullName: string
  email: string
  phoneNumber: string
  password: string
  role: 'developer'
  companyName: string
  companyRegistrationNumber: string
  companyAddress: string
  certificateOfIncorporation: string // base64
  companyPortfolio: string // base64
}
export type UserRole = 'applicant' | 'developer' | 'admin'

export interface ContactUsDto {
  firstName: string
  lastName: string
  email: string
  phone?: string
  reason: string
  message: string
}

export interface ApplicantSignupData {
  email: string
  password: string
  role: 'applicant'
  termsAccepted: true
  fullName: string
}
export type ResetPassword = {
  password: string
  token: string
  credential: string
  confirmPassword: string
}
export type User = {
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}
export interface LoginType {
  credential: string
  password: string
  role: string
}
