"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createcontact = async (contactData: {
  clientId: string;
  driverId: string;
}) => {
  try {
    const newcontact = await prisma.contacts.create({
      data: {
        clientId: contactData.clientId,
        driverId: contactData.driverId,
      },
    });
    if (newcontact.Id) return { success: true, data: newcontact };
    else return { success: false };
  } catch (error) {
    return { success: false, error: "Error creating contact" };
  }
};

export const getcontactById = async (contactId: string) => {
  try {
    const contact = await prisma.contacts.findUnique({
      where: { Id: contactId },
    });
    if (contact) {
      return { success: true, data: contact };
    } else {
      return { success: false, error: "contact not found" };
    }
  } catch (error) {
    return { success: false, error: "Error retrieving contact by ID" };
  }
};

export const getAllcontacts = async () => {
  const contacts = await prisma.contacts.findMany(); // Remove where clause to get all contacts
  if (contacts.length > 0) {
    return { success: true, data: contacts };
  } else {
    return { success: false, error: "No contacts found" };
  }
};

export const deletecontact = async (contactId: string) => {
  try {
    const deletedcontact = await prisma.contacts.delete({
      where: { Id: contactId },
    });
    return { success: true, data: deletedcontact };
  } catch (error) {
    return { success: false, error: "Error deleting contact" };
  }
};
