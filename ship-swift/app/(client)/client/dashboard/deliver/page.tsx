'use client'

import React, { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { createJob } from '@/actions/courierJobsActions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export default function ModernJobForm() {
  const { user, isLoaded } = useUser()
  const [error, setError] = useState<string | null | undefined>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [date, setDate] = useState<Date>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    const formData = new FormData(event.currentTarget)

    if (isLoaded && user) {
      formData.append("clientId", "client_001")
    } else {
      setError("User is not authenticated.")
      return
    }

    const response = await createJob(formData)

    if (response.success) {
      setSuccess("Job created successfully!")
      setError(null)
      event.currentTarget.reset()
      setDate(undefined)
    } else {
      setError(response.error)
      setSuccess(null)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Job</CardTitle>
        <CardDescription>Fill out the form below to create a new courier job.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget</Label>
            <Input id="budget" name="budget" type="number" min="0" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="PickUp">Pick Up</Label>
              <Input id="PickUp" name="PickUp" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="DropOff">Drop Off</Label>
              <Input id="DropOff" name="DropOff" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="districtpickup">District Pickup</Label>
              <Input id="districtpickup" name="districtpickup" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="districtdropoff">District Drop Off</Label>
              <Input id="districtdropoff" name="districtdropoff" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parcelsize">Parcel Size</Label>
            <Input id="parcelsize" name="parcelsize" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupphonenumber">Pickup Phone Number</Label>
              <Input id="pickupphonenumber" name="pickupphonenumber" type="tel"placeholder="1234567890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffphonenumber">Dropoff Phone Number</Label>
              <Input id="dropoffphonenumber" name="dropoffphonenumber" type="tel" placeholder="1234567890" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dropoffemail">Dropoff Email</Label>
            <Input id="dropoffemail" name="dropoffemail" type="email" required placeholder="example@example.com" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectiondate">Collection Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input 
              id="collectiondate" 
              name="collectiondate" 
              type="hidden" 
              value={date ? format(date, "yyyy-MM-dd") : ''} 
              required 
            />
          </div>

          <Button type="submit" className="w-full">Create Job</Button>
        </form>
      </CardContent>
      <CardFooter>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </CardFooter>
    </Card>
  )
}