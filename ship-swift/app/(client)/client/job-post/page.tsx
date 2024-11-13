"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import type { E164Number } from "libphonenumber-js/core";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarIcon,
  Package,
  Truck,
  Box,
  Forklift,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  PhoneInput,
  phoneNumberSchema,
  ValidationResult,
} from "@/screens/global/phone-input";
import { z } from "zod";
import { createJob } from "@/actions/courierJobsActions";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { getClientById } from "@/actions/clientActions";
import { createJobAndDirectRequest } from "@/screens/client/utils/directRequests";

const packageSizes = [
  {
    id: 1,
    name: "Small Packages",
    description:
      "Lightweight and compact, generally small enough to be held in one hand or easily carried by one person.",
    dimensions: "Up to 30 x 30 x 30 cm",
    weight: "Up to 4.5 kg",
    examples: "Envelopes, small electronics, compact boxes",
    vehicles: "Bicycles, Motorbikes or Scooters, Compact Cars",
    icon: Package,
    price: 80, // Example fixed price
  },
  {
    id: 2,
    name: "Medium Packages",
    description:
      "Bulkier and heavier than small packages but still manageable by one person with ease.",
    dimensions: "30 to 60 cm on any side",
    weight: "4.5 - 18 kg",
    examples: "Shoe boxes, small appliance boxes, parcels",
    vehicles:
      "Motorbikes or Scooters (for lighter medium items), Compact to Mid-sized Cars, Small Vans",
    icon: Box,
    price: 150, // Example fixed price
  },
  {
    id: 3,
    name: "Large Packages",
    description:
      "Substantially large, requiring two people to carry or a vehicle for transport. These packages might not fit into standard car trunks.",
    dimensions: "60 to 120 cm on any side",
    weight: "18 - 45 kg",
    examples: "Furniture pieces, large appliances, bulkier electronics",
    vehicles:
      "Mid-sized Cars or Large Sedans (only if they fit), Large Vans, Pickup Trucks",
    icon: Truck,
    price: 250, // Example fixed price
  },
  {
    id: 4,
    name: "Extra-Large Packages",
    description:
      "Oversized packages that are heavy and require specialized handling, often more than two people to load.",
    dimensions: "Over 120 cm on any side",
    weight: "Over 45 kg",
    examples: "Mattresses, large appliances, large furniture",
    vehicles: "Pickup Trucks, Cargo Vans, Box Trucks",
    icon: Truck,
    price: 450, // Example fixed price
  },
  // {
  //   id: 5,
  //   name: "Freight Packages",
  //   description:
  //     "Industrial or commercial packages, often palletized, requiring forklifts or lift gates.",
  //   dimensions:
  //     "Typically measured by pallet size (100 x 120 cm, up to 244 cm tall) or crate dimensions.",
  //   weight: "Generally over 68 kg",
  //   examples: "Palletized goods, bulk products, industrial supplies",
  //   vehicles: "Box Trucks, Freight Trucks",
  //   icon: Forklift,
  //   price: 100, // Example fixed price
  // },
];

export default function PostJobWizard() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();
  const searchParams = useSearchParams();
  const driverId = searchParams.get("driverId");
  const formSchema = z.object({
    packageSize: z.number().min(1).max(5),
    title: z
      .string()
      .min(10, "Title must be at least 10 characters long")
      .max(100, "Title must not exceed 100 characters"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters long")
      .max(1000, "Description must not exceed 1000 characters"),
    budget: z.string(),
    pickUp: z.string().min(5, "Pickup address must be at least 5 characters long"),
    dropOff: z.string().min(5, "Dropoff address must be at least 5 characters long"),
    districtPickup: z.string().min(2, "District pickup must be at least 2 characters long"),
    districtDropoff: z.string().min(2, "District dropoff must be at least 2 characters long"),
    weight: z.string(),
    dimensions: z.string(),
    suitableVehicles: z.string(),
    parcelSize: z.string(),
    pickupPhoneNumber: phoneNumberSchema,
    dropoffPhoneNumber: phoneNumberSchema,
    dropoffEmail: z.string().email("Invalid email address"),
    collectionDate: z.date().min(new Date(), "Collection date must be in the future"),
  })
  
  type FormData = z.infer<typeof formSchema>
    const [formData, setFormData] = useState<FormData>({
      packageSize: 1,
      title: '',
      description: '',
      budget: '80',
      pickUp: '',
      dropOff: '',
      districtPickup: '',
      districtDropoff: '',
      parcelSize: '',
      pickupPhoneNumber: '' as E164Number,
      dropoffPhoneNumber: '' as E164Number,
      dropoffEmail: '',
      collectionDate: null as unknown as Date,
      weight: '',
      dimensions: '',
      suitableVehicles: '',
    })
  
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  const totalSteps = 6;
  const exampleTitles = [
    "Need courier for same-day delivery in Maseru",
    "Looking for reliable driver to transport fragile items",
    "Urgent: Package delivery needed from Moshoeshoe 2 to Maputsoe",
  ];

  const validateStep = (stepNumber: number) => {
    let stepSchema: z.ZodType<any>;
    switch (stepNumber) {
      case 1:
        stepSchema = formSchema.pick({ packageSize: true });
        break;
      case 2:
        stepSchema = formSchema.pick({ title: true });
        break;
      case 3:
        stepSchema = formSchema.pick({ description: true });
        break;
      case 4:
        stepSchema = formSchema.pick({
          pickUp: true,
          dropOff: true,
          districtPickup: true,
          districtDropoff: true,
        });
        break;
      case 5:
        stepSchema = formSchema.pick({
          pickupPhoneNumber: true,
          dropoffPhoneNumber: true,
          dropoffEmail: true,
        });
        break;
      case 6:
        stepSchema = formSchema.pick({ collectionDate: true });
        break;
      default:
        return true;
    }

    try {
      stepSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0] as keyof FormData] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange =
    (type: "pickup" | "dropoff") =>
    (value: E164Number, validation: ValidationResult) => {
      setFormData((prevData) => ({
        ...prevData,
        [`${type}PhoneNumber`]: value,
      }));
      if (!validation.success) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`${type}PhoneNumber`]: validation.error,
        }));
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[`${type}PhoneNumber` as keyof FormData];
          return newErrors;
        });
      }
    };

  const handleNext = async () => {
    if (validateStep(step)) {
      if (step < totalSteps) {
        setStep(step + 1);
      } else {
        setIsSubmitting(true);
        // check if user is verified
        const client = await getClientById(userId || "");
        if (!client.data?.isVerified) {
          setIsSubmitting(false);
          toast({
            title: "You must be verified to post a job",
            description:
              "Please wait until your account is verified to post a job",
            variant: "destructive", // Use the 'destructive' variant for error messages
          });
          return;
        }
        // submit form data
        const formDataToSubmit = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (typeof value === "string" || value instanceof Blob) {
            formDataToSubmit.append(key, value);
          } else if (typeof value === "number" || value instanceof Date) {
            formDataToSubmit.append(key, value.toString());
          }
        });
        formDataToSubmit.append("clientId", userId || "");

        const response = await createJob(formDataToSubmit);

        if (response.success) {
          toast({
            description: "Job created successfully!",
          });
          router.push("/client");
        } else {
          toast({
            description: response.error,
            variant: "destructive",
          });
        }
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleDirectRequest = async () => {
    if (driverId) {
      const formDataToSubmit = new FormData();

      // Log formData and userId for debugging purposes
      console.log(formData);
      console.log(userId);

      // Add form data entries to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string" || value instanceof Blob) {
          formDataToSubmit.append(key, value);
        } else if (typeof value === "number" || value instanceof Date) {
          formDataToSubmit.append(key, value.toString());
        }
      });

      // Append userId (clientId) to the form data
      formDataToSubmit.append("clientId", userId || "");

      // Call createJobAndDirectRequest with the updated formDataToSubmit
      const response = await createJobAndDirectRequest(
        formDataToSubmit,
        userId || "",
        driverId
      );

      if (response.success) {
        toast({
          description: "Job created successfully!",
        });
        router.push("/client");
      } else {
        toast({
          description: response.error,
          variant: "destructive",
        });
      }
    }
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Select your package size
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the size that best fits your delivery needs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packageSizes.map((size) => (
                <Card
                  key={size.id}
                  className={cn(
                    "cursor-pointer hover:border-primary transition-colors",
                    formData.packageSize === size.id && "border-primary"
                  )}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      packageSize: size.id,
                      budget: size.price.toString(),
                      parcelSize: size.name.toLowerCase().replace(/\s/g, "").replace("-", ""),
                      weight: size.weight,
                      dimensions: size.dimensions,
                      suitableVehicles: size.vehicles,
                    })
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <size.icon className="w-8 h-8" />
                      <span className="text-2xl font-bold">M{size.price}.00</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{size.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {size.description}
                    </p>
                    <p className="text-sm">
                      <strong>Dimensions:</strong> {size.dimensions}
                    </p>
                    <p className="text-sm">
                      <strong>Weight:</strong> {size.weight}
                    </p>
                    <p className="text-sm">
                      <strong>Examples:</strong> {size.examples}
                    </p>
                    <p className="text-sm">
                      <strong>Suitable Vehicles:</strong> {size.vehicles}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Let's start with a strong title.
              </h1>
              <p className="text-lg text-muted-foreground">
                This helps your job post stand out to the right couriers. It's
                the first thing they'll see, so make it count!
              </p>
            </div>
            <Input
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="text-lg py-6"
              placeholder="Write a title for your job post"
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
            <div className="space-y-4">
              <h2 className="text-sm font-medium">Example titles</h2>
              <ul className="space-y-3">
                {exampleTitles.map((title, index) => (
                  <li
                    key={index}
                    className="text-primary cursor-pointer hover:underline"
                    onClick={() => setFormData({ ...formData, title: title })}
                  >
                    {title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                List the items for delivery
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide details of the items to be delivered.
              </p>
            </div>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[200px]"
              placeholder="List the items for delivery, e.g., 2 Hisense TVs, 1 laptop, etc."
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Specify pickup and dropoff locations
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide accurate addresses for pickup and delivery.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pickup Location</h2>
              <Input
                name="pickUp"
                value={formData.pickUp}
                onChange={handleInputChange}
                placeholder="Enter pickup address... e.g., letamong, Maqhaka, Berea, Lesotho"
              />
              {errors.pickUp && (
                <p className="text-sm text-red-500">{errors.pickUp}</p>
              )}
              <Input
                name="districtPickup"
                value={formData.districtPickup}
                onChange={handleInputChange}
                placeholder="Enter pickup district/province... e.g., Berea"
              />
              {errors.districtPickup && (
                <p className="text-sm text-red-500">{errors.districtPickup}</p>
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dropoff Location</h2>
              <Input
                name="dropOff"
                value={formData.dropOff}
                onChange={handleInputChange}
                placeholder="Enter dropoff address... e.g., Moshoeshoe 2 masoleng, Maseru, Lesotho"
              />
              {errors.dropOff && (
                <p className="text-sm text-red-500">{errors.dropOff}</p>
              )}
              <Input
                name="districtDropoff"
                value={formData.districtDropoff}
                onChange={handleInputChange}
                placeholder="Enter dropoff district/province... e.g., Maseru"
              />
              {errors.districtDropoff && (
                <p className="text-sm text-red-500">{errors.districtDropoff}</p>
              )}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Contact information
              </h1>
              <p className="text-lg text-muted-foreground">
                Provide contact details for pickup and delivery.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Pickup Contact</h2>
              <PhoneInput
                value={formData.pickupPhoneNumber}
                onChange={(value) =>
                  handlePhoneChange("pickup")(value as E164Number, {
                    success: true,
                  })
                }
                onValueChange={({ phoneNumber, validation }) =>
                  handlePhoneChange("pickup")(
                    phoneNumber as E164Number,
                    validation
                  )
                }
              />
              {errors.pickupPhoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.pickupPhoneNumber}
                </p>
              )}
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Dropoff Contact</h2>
              <PhoneInput
                value={formData.dropoffPhoneNumber}
                onChange={(value) =>
                  handlePhoneChange("dropoff")(value as E164Number, {
                    success: true,
                  })
                }
                onValueChange={({ phoneNumber, validation }) =>
                  handlePhoneChange("dropoff")(
                    phoneNumber as E164Number,
                    validation
                  )
                }
              />
              {errors.dropoffPhoneNumber && (
                <p className="text-sm text-red-500">
                  {errors.dropoffPhoneNumber}
                </p>
              )}

              <Input
                name="dropoffEmail"
                type="email"
                value={formData.dropoffEmail}
                onChange={handleInputChange}
                placeholder="Dropoff email address... e.g., example@example.com"
              />
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-semibold tracking-tight">
                Set collection date/End Date
              </h1>
              <p className="text-lg text-muted-foreground">
                Choose the date when the item should be collected.
              </p>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.collectionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.collectionDate ? (
                    format(formData.collectionDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.collectionDate || undefined}
                  onSelect={(date) =>
                    setFormData({ ...formData, collectionDate: date ? new Date(date.setHours(0, 0, 0, 0)) : new Date(new Date().setHours(0, 0, 0, 0)) })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.collectionDate && (
              <p className="text-sm text-red-500">{errors.collectionDate}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center text-sm text-muted-foreground">
          <span>
            {step}/{totalSteps}
          </span>
          <span className="ml-2">Job post</span>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between pt-8">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2"
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={
              step === totalSteps && driverId ? handleDirectRequest : handleNext
            }
            disabled={
              (step === 1 && !formData.packageSize) ||
              (step === 2 && !formData.title) ||
              isSubmitting
            }
          >
            {step === totalSteps ? (
              driverId ? (
                isSubmitting ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <Send className="w-8 h-8" />
                )
              ) : isSubmitting ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Send className="w-12 h-12" />
              )
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

{
  /*
  {
    "packageSize": 2,
    "title": "Need courier for same-day delivery in Maseru",
    "description": "2 Hisense TVs",
    "budget": "20",
    "pickUp": "Maqhaka, Berea, Lesotho",
    "dropOff": "Moshoeshoe 2, Maseru, Lesotho",
    "districtPickup": "Berea",
    "districtDropoff": "Maseru",
    "parcelSize": "mediumpackages",
    "pickupPhoneNumber": "",
    "dropoffPhoneNumber": "",
    "dropoffEmail": "kamohelokoali201@gmail.com",
    "collectionDate": "2024-11-20T10:00:00.000Z"
}
  */
}
