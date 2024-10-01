import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createDriver = async (driverData: {
  email: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  idPhotoUrl: string;
  vehicleType: string;
  vehicleDetails: string[];
}) => {
  return await prisma.drivers.create({
    data: {
      email: driverData.email,
      phoneNumber: driverData.phoneNumber,
      firstName: driverData.firstName,
      lastName: driverData.lastName,
      photoUrl: driverData.photoUrl,
      idPhotoUrl: driverData.idPhotoUrl,
      vehicleType: driverData.vehicleType,
      vehicleDetails: driverData.vehicleDetails,
    },
  });
};


export const getdriverById = async (driverId: string) => {
  return await prisma.drivers.findUnique({
    where: { Id: driverId },
  });
};

export const updatedriver = async (driverId: string, driverData: Partial<any>) => {
  return await prisma.drivers.update({
    where: { Id: driverId },
    data: driverData,
  });
};

export const deletedriver = async (driverId: string) => {
  return await prisma.drivers.delete({
    where: { Id: driverId },
  });
};