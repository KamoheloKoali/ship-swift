import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useAuth, useUser } from "@clerk/nextjs";

// Define the schema here
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

export default function DriverDetailsForm({
  onSubmit,
}: DriverDetailsFormProps) {
  const { userId } = useAuth();
  const { isSignedIn, user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<DriverData>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      clerkId: userId || "", // Set default clerk ID
      email: user?.emailAddresses[0]?.emailAddress || "", // Set default email
      phoneNumber: "", // Initialize with empty string
      firstName: "", // Initialize with empty string
      lastName: "", // Initialize with empty string
      photoUrl: user?.imageUrl || "", // Set default photo URL
      idPhotoUrl: user?.imageUrl || "", // Set default ID photo URL
      idNumber: "", // Initialize with empty string
      licenseNumber: "", // Initialize with empty string
      licenseExpiry: "", // Initialize with empty string
      vehicleType: "", // Initialize with empty string
      plateNumber: "", // Initialize with empty string
      VIN: "", // Initialize with empty string
      diskExpiry: "", // Initialize with empty string
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Driver Details</CardTitle>
        <CardDescription>
          Please fill in the driver's information
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2 hidden">
            <Label htmlFor="clerkId">Clerk ID</Label>
            <Input id="clerkId" {...register("clerkId")} readOnly />
            {errors.clerkId && (
              <p className="text-sm text-red-500">{errors.clerkId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                {...register("firstName")}
                value={user?.firstName || ""}
                readOnly
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                {...register("lastName")}
                value={user?.lastName || ""}
                readOnly
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              value={user?.emailAddresses[0]?.emailAddress || ""}
              readOnly
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" {...register("phoneNumber")} />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="photoUrl">Photo URL</Label>
            <Input id="photoUrl" {...register("photoUrl")} />
            {errors.photoUrl && (
              <p className="text-sm text-red-500">{errors.photoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idPhotoUrl">ID Photo URL</Label>
            <Input id="idPhotoUrl" {...register("idPhotoUrl")} />
            {errors.idPhotoUrl && (
              <p className="text-sm text-red-500">
                {errors.idPhotoUrl.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="idNumber">ID Number</Label>
            <Input id="idNumber" {...register("idNumber")} />
            {errors.idNumber && (
              <p className="text-sm text-red-500">{errors.idNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" {...register("licenseNumber")} />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500">
                {errors.licenseNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseExpiry">License Expiry</Label>
            <Input id="licenseExpiry" {...register("licenseExpiry")} />
            {errors.licenseExpiry && (
              <p className="text-sm text-red-500">
                {errors.licenseExpiry.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Input id="vehicleType" {...register("vehicleType")} />
            {errors.vehicleType && (
              <p className="text-sm text-red-500">
                {errors.vehicleType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="plateNumber">Plate Number</Label>
            <Input id="plateNumber" {...register("plateNumber")} />
            {errors.plateNumber && (
              <p className="text-sm text-red-500">
                {errors.plateNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="VIN">VIN</Label>
            <Input id="VIN" {...register("VIN")} />
            {errors.VIN && (
              <p className="text-sm text-red-500">{errors.VIN.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="diskExpiry">Disk Expiry</Label>
            <Input id="diskExpiry" {...register("diskExpiry")} />
            {errors.diskExpiry && (
              <p className="text-sm text-red-500">
                {errors.diskExpiry.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Confirm
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
