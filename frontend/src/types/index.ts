export type User = {
  name: string
  email: string
  picture?: string
}

export type Equipment = {
  id: string
  title: string
  description?: string
  pricePerDay: number
  image?: string
  category: 'equipment' | 'lab'
}

export type RentalRequest = {
  id: string
  equipmentId: string
  equipmentTitle: string
  userEmail: string
  userName: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  status: 'pending' | 'approved' | 'disapproved'
  adminNote?: string
  createdAt: string
}