// app/components/NotificationButton.js
"use client";

import { createFCMToken } from "@/actions/FCMTokenActions";
import { toast } from "@/hooks/use-toast";
import { messaging } from "@/lib/firebase";
import { currentUser } from "@clerk/nextjs/server";
import { getToken } from "firebase/messaging";

function requestPermission() {
    console.log("Requesting notification permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");
            getRegistrationToken(); // Proceed if permission is granted
        } else {
            console.log("Notification permission denied.");
        }
    });
}

async function getRegistrationToken() {
    const vapidKey = String(process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY); // Replace with your VAPID key
    const  user  = await currentUser()

    if (!user) return;

    try {
        const currentToken = await getToken(messaging, { vapidKey });
        if (currentToken) {
            console.log("Generated FCM Token:", currentToken);
            // Send token to your server for later use
            const response = await createFCMToken({userId: user.id, token: currentToken});

            if (!response.success) {
                toast({
                    title: "Error",
                    description: "Error creating FCMToken",
                    variant: "destructive",
                })
            }
        } else {
            console.log("No registration token available. Request permission to generate one.");
        }
    } catch (error) {
    console.error("Error retrieving token:", error);
}
}

export default function NotificationButton() {
    return (
        <button onClick={requestPermission}>
      Enable Notifications
    </button>
  );
}
