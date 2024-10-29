import { Package } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function PublicNavBar() {
  return (
    <div>
        <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <a className="flex items-center justify-center" href="#">
          <Package className="h-6 w-6" />
          <span className="ml-2 text-2xl font-bold">ShipSwift</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/public">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/public/how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
    </div>
  )
}

export default PublicNavBar