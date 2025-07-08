export interface DeveloperSignupData {
  email: string
  phoneNumber: string
  password: string
  role: 'developer'
  companyName: string
  companyLogo: string
  companyDescription: string
  yearsOfExperience: string
  website: string
  portfolio: string
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
  phoneNumber: string
  password: string
  role: 'applicant'
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'other'
  dateOfBirth: string
  employmentStatus: string
  location: string
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
  