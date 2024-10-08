import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth, useUser } from '@clerk/nextjs';
// Define the schema here as well if not imported
const driverSchema = z.object({
  clerkId: z.string().min(1, "Clerk ID is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  photoUrl: z.string().url("Invalid URL"),
  idPhotoUrl: z.string().url("Invalid URL"),
  idNumber: z.string().optional(),
  licenseNumber: z.string().optional(),
  licenseExpiry: z.string().optional(),
  vehicleType: z.string().optional(),
  plateNumber: z.string().optional(),
  VIN: z.string().optional(),
  diskExpiry: z.string().optional(),
});

type DriverData = z.infer<typeof driverSchema>;

interface DriverDetailsFormProps {
  onSubmit: (data: DriverData) => void;
}

export default function DriverDetailsForm({ onSubmit }: DriverDetailsFormProps) {
  const { userId } = useAuth();
  const { isSignedIn, user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
        <CardDescription>Please fill in the driver's information</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clerkId">Clerk ID</Label>
            <Input id="clerkId" {...register("clerkId")} value={userId || undefined} readOnly/>  
            {errors.clerkId && <p className="text-sm text-red-500">{errors.clerkId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")}  value={user?.emailAddresses[0].emailAddress || undefined} />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register("phoneNumber")} />
            {errors.phoneNumber && <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" {...register("photoUrl")} value={user?.imageUrl || undefined} />
            {errors.photoUrl && <p className="text-sm text-red-500">{errors.photoUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idPhotoUrl">ID Photo URL</Label>
            <Input id="idPhotoUrl" {...register("idPhotoUrl")} value={user?.imageUrl || undefined}/>
            {errors.idPhotoUrl && <p className="text-sm text-red-500">{errors.idPhotoUrl.message}</p>}
          </div>

          {/* Add more fields as needed */}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Create Driver</Button>
        </CardFooter>
      </form>
    </Card>
  );
}