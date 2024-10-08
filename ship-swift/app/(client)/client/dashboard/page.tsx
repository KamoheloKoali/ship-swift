'use client'

import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "@clerk/nextjs"
import { createCourierJob, courierJobSchema } from "../../lib/zodSchema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function ModernJobForm() {
  const { user, isLoaded } = useUser()
  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(courierJobSchema),
    defaultValues: {
      Title: "",
      Description: "",
      Budget: "",
      DropOff: "",
      districtDropOff: "",
      districtDroppoff: "",
      PickUp: "",
      districtPickUp: "",
      parcelSize: "",
      pickupPhoneNumber: "",
      dropoffPhoneNumber: "",
      dropOffEmail: "",
      collectionDate: new Date(),
    }
  })

  const onSubmit = async (data) => {
    console.log('Hello')
    if (!isLoaded || !user) {
      alert("User information is not loaded")
      return
    }

    try {
      await createCourierJob({
        ...data,
        clientId: user.id,
      })
      alert("Job created successfully!")
      reset()
    } catch (error) {
      console.error("Error creating job:", error)
      alert("Failed to create job")
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create a Job</CardTitle>
        <CardDescription>Fill out the form below to create a new courier job.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="Title">Title</Label>
              <Input id="Title" {...register("Title")} />
              {errors.Title && <p className="text-sm text-red-500">{errors.Title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Budget">Budget</Label>
              <Input id="Budget" {...register("Budget")} />
              {errors.Budget && <p className="text-sm text-red-500">{errors.Budget.message}</p>}
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="Description">Description</Label>
              <Textarea id="Description" {...register("Description")} />
              {errors.Description && <p className="text-sm text-red-500">{errors.Description.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="PickUp">Pick Up Location</Label>
              <Input id="PickUp" {...register("PickUp")} />
              {errors.PickUp && <p className="text-sm text-red-500">{errors.PickUp.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="districtPickUp">District Pick Up</Label>
              <Input id="districtPickUp" {...register("districtPickUp")} />
              {errors.districtPickUp && <p className="text-sm text-red-500">{errors.districtPickUp.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="DropOff">Drop Off Location</Label>
              <Input id="DropOff" {...register("DropOff")} />
              {errors.DropOff && <p className="text-sm text-red-500">{errors.DropOff.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="districtDropOff">District Drop Off</Label>
              <Input id="districtDropOff" {...register("districtDropOff")} />
              {errors.districtDropOff && <p className="text-sm text-red-500">{errors.districtDropOff.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="parcelSize">Parcel Size</Label>
              <Input id="parcelSize" {...register("parcelSize")} />
              {errors.parcelSize && <p className="text-sm text-red-500">{errors.parcelSize.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickupPhoneNumber">Pickup Phone Number</Label>
              <Input id="pickupPhoneNumber" {...register("pickupPhoneNumber")} />
              {errors.pickupPhoneNumber && <p className="text-sm text-red-500">{errors.pickupPhoneNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropoffPhoneNumber">Dropoff Phone Number</Label>
              <Input id="dropoffPhoneNumber" {...register("dropoffPhoneNumber")} />
              {errors.dropoffPhoneNumber && <p className="text-sm text-red-500">{errors.dropoffPhoneNumber.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dropOffEmail">Drop Off Email</Label>
              <Input id="dropOffEmail" type="email" {...register("dropOffEmail")} />
              {errors.dropOffEmail && <p className="text-sm text-red-500">{errors.dropOffEmail.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="collectionDate">Collection Date</Label>
              <Controller
                name="collectionDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.collectionDate && <p className="text-sm text-red-500">{errors.collectionDate.message}</p>}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Job..." : "Create Job"}
        </Button>
      </CardFooter>
    </Card>
  )
}