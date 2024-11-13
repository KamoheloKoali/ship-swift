// app/client-profile/[id]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ClientProfileContent } from '../components/ClientProfileContent'
// import { Client } from '@/types/client'
import React from 'react'

interface ActiveJob {
    id: string
    // Add other job properties
  }
  
  interface CourierJob {
    id: string;
    title: string | null;
    description: string | null;
    budget: string | null;
    clientId: string;
    dropOff: string | null;
    districtDropOff: string | null;
    pickUp: string | null;
    districtPickUp: string | null;
    parcelSize: string | null;
    pickupPhoneNumber: string | null;
    dropoffPhoneNumber: string | null;
    dropOffEmail: string | null;
    collectionDate: Date;
    dateCreated: Date;
    packageStatus: string | null;
    approvedRequestId: string | null;
    dimensions: string | null;
    suitableVehicles: string | null;
    weight: string | null;
    isDirect: boolean;
    
    // Relations
    // activeJobs?: ActiveJobs[];
    // approvedRequest?: JobRequest | null;
    // client: Client;
    // directRequest?: DirectRequest[];
    // jobRequests?: JobRequest[];
  }

export interface Client {
    Id: string
    email: string
    phoneNumber: string
    firstName: string
    lastName: string
    photoUrl: string
    idPhotoUrl: string
    dateCreated: Date
    dateUpdated: Date
    isVerified: boolean
    selfieImage?: string
    activeJobs: ActiveJob[]
    courierJobs: CourierJob[]
  }

export default function ClientProfilePage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{ message: string } | undefined>(undefined)
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`/api/clients/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch client data')
        }
        const data = await response.json()
        setClient(data)
      } catch (err) {
        setError({ message: err instanceof Error ? err.message : 'An error occurred' })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchClientData()
    }
  }, [params.id])

  return (
    <ClientProfileContent
      loading={loading}
      error={error}
      client={client}
    />
  )
}