"use client"
import { Card } from '@/components/ui/card'
import { useNavigation } from '@/hooks/useNavigation'
import React from 'react'

const DesktopNav = () => {
    const paths = useNavigation()
  return (
    <Card>Nav</Card>
  )
}

export default DesktopNav