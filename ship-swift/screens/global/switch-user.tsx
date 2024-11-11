"use client";
import React, { useEffect, useState } from "react";
import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
} from "@/components/ui/menubar";
import { getDriverByID } from "@/actions/driverActions";
import { getClientById } from "@/actions/clientActions";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { updateUserRole, getUserRole } from "@/actions/roleAction";

const SwitchUser = () => {
  const [role, setRole] = useState<"driver" | "client" | null>(null);
  const { userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      if (userId) {
        const userRole = await getUserRole(userId);

        if (userRole?.driver) {
          setRole("driver");
        } else if (userRole?.client) {
          setRole("client");
        } else {
          setRole(null);
        }
      }
    };

    checkRole();
  }, [userId]);

  const checkDriver = async () => {
    if (userId) {
      const driver = await getDriverByID(userId);
      if (driver) {
        updateUserRole({
          userId,
          driver: true,
          client: false,
        });
        router.push("/driver/dashboard/find-jobs");
      } else {
        router.push("/onboarding/driver/registration");
      }
    }
  };

  const checkClient = async () => {
    if (userId) {
      const client = await getClientById(userId);
      if (client.success) {
        updateUserRole({
          userId,
          driver: false,
          client: true,
        });
        router.push("/client");
      } else {
        router.push("/onboarding/client");
      }
    }
  };

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Switch User</MenubarTrigger>
        <MenubarContent>
          {role === "client" ? (
            <MenubarItem onClick={checkDriver}>Driver</MenubarItem>
          ) : (
            <MenubarItem onClick={checkClient}>Client</MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export default SwitchUser;
