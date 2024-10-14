import ImageCard from '@/components/ui/image-card'
import React from 'react'

function ShipmentsPage() {
  return (
    <div>
      <div className="flex items-center justify-center px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl w-full">
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Placed Orders"
          description="Parcel To be collected"
          href='/client/dashboard/shipments/placed-orders'
        />
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Collected"
          description="Collected Parcels and on Route"
          href='/client/dashboard/shipments/placed-orders'
        />
        <ImageCard
          imageSrc="/assets/client/images/deliver_no_bg.gif"
          imageAlt="gif"
          title="Delivered"
          description="Parcel delivered successfully"
          href='/client/dashboard/shipments/collected-orders'
        />
      </div>
    </div>
    </div>
  )
}

export default ShipmentsPage
