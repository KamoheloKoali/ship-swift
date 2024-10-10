'use client'

import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "@clerk/nextjs"
import { courierJobSchema } from "../../../lib/zodSchema"
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
import { createJob } from '@/actions/courierJobsActions';

export default function ModernJobForm() {
  const { user, isLoaded } = useUser(); // Use the useUser hook to get the user object
  const [error, setError] = useState<string | null | undefined>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);

    // Ensure the user object is loaded and available
    if (isLoaded && user) {
      formData.append("clientId", "client_001"); // Append clientId from useUser to FormData
    } else {
      setError("User is not authenticated.");
      return;
    }

    const response = await createJob(formData);

    if (response.success) {
      setSuccess("Job created successfully!");
      setError(null);
      // Optionally, you can reset the form or navigate to another page
    } else {
      setError(response.error);
      setSuccess(null);
      console.log(Object.fromEntries(formData));
    }
  };

  return (
    <div>
  <form onSubmit={handleSubmit}>
    <h1>Create a Job</h1>
    
    <div>
      <label>Title:</label>
      <input type="text" name="title" required />
    </div>

    <div>
      <label>Description:</label>
      <textarea name="description" required />
    </div>

    <div>
      <label>Budget:</label>
      <input type="number" name="budget" required min="0" />
    </div>

    <div>
      <label>Drop Off:</label>
      <input type="text" name="DropOff" required />
    </div>

    <div>
      <label>Pick Up:</label>
      <input type="text" name="PickUp" required />
    </div>

    <div>
      <label>District Pickup:</label>
      <input type="text" name="districtpickup" required />
    </div>

    <div>
      <label>District Drop Off:</label>
      <input type="text" name="districtdropoff" required />
    </div>

    <div>
      <label>Parcel Size:</label>
      <input type="text" name="parcelsize" required />
    </div>

    <div>
      <label>Pickup Phone Number:</label>
      <input type="tel" name="pickupphonenumber" required pattern="[0-9]{10}" placeholder="1234567890" />
    </div>

    <div>
      <label>Dropoff Phone Number:</label>
      <input type="tel" name="dropoffphonenumber" required pattern="[0-9]{10}" placeholder="1234567890" />
    </div>

    <div>
      <label>Dropoff Email:</label>
      <input type="email" name="dropoffemail" required placeholder="example@example.com" />
    </div>

    <div>
      <label>Collection Date:</label>
      <input type="date" name="collectiondate" required />
    </div>

    <button type="submit">Create Job</button>

    {error && <p style={{ color: "red" }}>{error}</p>}
    {success && <p style={{ color: "green" }}>{success}</p>}
  </form>
</div>

  )
}