import React from "react";
import {
  User,
  Truck,
  CreditCard,
  Calendar,
  Star,
  MapPin,
  Shield,
  Award,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import CardStatus from "@/screens/courier/dashboard/components/CardStatus";
import ProfileButton from "../../profile/components/ProfileButton";

type InfoItemProps = {
  icon: React.ReactNode;
  label: string;
  value: string | number;
};

interface ProfileProps {
  onProfileClick: () => void;
  isProfileOpen: boolean;
}

const Profile: React.FC<ProfileProps> = ({ onProfileClick, isProfileOpen }) => {
  const courierData = {
    name: "Khiba Koenane",
    id: "CD123456",
    photoUrl:
      "https://media.licdn.com/dms/image/D4D03AQFK7cYf3VHK3A/profile-displayphoto-shrink_200_200/0/1723036619652?e=2147483647&v=beta&t=xTRVy-JtkBzHRU2WBBNDxX757ziL4x4G_PeCxM4GH80",
    driversLicense: "DL987654321",
    driversLicenseExpiration: "2025-12-31",
    licensePlate: "ABC 1234",
    vin: "1HGCM82633A004352",
    vehicleDiscExpiration: "2024-06-30",
    rating: 4.8,
    completedDeliveries: 1250,
    location: "Maseru, Lesotho",
    completionRate: 100,
    onTimeRate: 98,
    safetyScore: 100,
  };

  const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
    <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-2">
      {icon}
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );

  const PerformanceMetric: React.FC<{
    icon: React.ReactNode;
    value: number;
    label: string;
  }> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center">
      <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 text-primary mb-2">
        {icon}
      </div>
      <Progress value={value} className="w-12 sm:w-16 h-2 mb-1" />
      <div className="text-lg sm:text-xl font-bold">{value}%</div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </div>
  );

  return (
    <Card className="flex flex-col p-2 sm:p-4 border border-gray-200 rounded-lg mb-6 sm:mb-12">
      <CardHeader className="relative pb-0">
        <div className="absolute top-0 left-0 w-full h-16 sm:h-24 bg-gradient-to-r from-primary to-primary-foreground opacity-20 rounded-t-lg" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center sm:space-x-4">
            <Avatar className="w-24 h-24 sm:w-36 sm:h-36 border-4 border-background mb-4 sm:mb-0">
              <AvatarImage src={courierData.photoUrl} alt={courierData.name} />
              <AvatarFallback>
                {courierData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold">
                {courierData.name}
              </h2>
              <div className="flex items-center justify-center sm:justify-start mt-1 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-1" />
                {courierData.location}
              </div>
              <div className="flex items-center justify-center sm:justify-start mt-1">
                <Star className="w-4 h-4 text-yellow-500 mr-1" />
                <span className="font-medium">{courierData.rating}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  ({courierData.completedDeliveries} deliveries)
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="hidden md:block mylg:hidden justify-start mr-2 sm:mr-0 sm:mb-2">
              <CardStatus />
            </div>
            <ProfileButton
              onClick={onProfileClick}
              isProfileOpen={isProfileOpen}
            />
          </div>
        </div>
        <Badge
          variant="outline"
          className="absolute top-2 right-2 sm:top-4 sm:right-4"
        >
          ID: {courierData.id}
        </Badge>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6 pb-2 sm:pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 sm:mb-3">
              Driver Information
            </h3>
            <div className="space-y-2">
              <InfoItem
                icon={<CreditCard className="w-4 h-4 text-primary" />}
                label="License No."
                value={courierData.driversLicense}
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4 text-primary" />}
                label="Expires"
                value={courierData.driversLicenseExpiration}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 sm:mb-3">
              Vehicle Information
            </h3>
            <div className="space-y-2">
              <InfoItem
                icon={<Truck className="w-4 h-4 text-primary" />}
                label="Plate No."
                value={courierData.licensePlate}
              />
              <InfoItem
                icon={<Shield className="w-4 h-4 text-primary" />}
                label="VIN"
                value={courierData.vin}
              />
              <InfoItem
                icon={<Calendar className="w-4 h-4 text-primary" />}
                label="Disc Expires"
                value={courierData.vehicleDiscExpiration}
              />
            </div>
          </div>
        </div>

        <Separator className="my-4 sm:my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-3 sm:mb-4">
            Performance Metrics
          </h3>
          <div className="flex justify-around">
            <PerformanceMetric
              icon={<Award className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={courierData.completionRate}
              label="Completion"
            />
            <PerformanceMetric
              icon={<Clock className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={courierData.onTimeRate}
              label="On-Time"
            />
            <PerformanceMetric
              icon={<Shield className="w-5 h-5 sm:w-6 sm:h-6" />}
              value={courierData.safetyScore}
              label="Safety Score"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
