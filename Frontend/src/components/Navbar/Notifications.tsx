import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Bell } from "lucide-react";
import React, { useState } from "react";
import no_notification_img from "../../assets/no_notification_img.gif";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const dummyNotifications: Notification[] = [
  // {
  //   id: "1",
  //   user_id: "123",
  //   type: "subscription_expiry",
  //   message: "Your subscription is expiring soon!",
  //   status: "unread",
  //   created_at: "2025-03-10T12:00:00Z",
  // },
  // {
  //   id: "2",
  //   user_id: "123",
  //   type: "new_purchase",
  //   message: "You have successfully purchased a new plan.",
  //   status: "read",
  //   created_at: "2025-03-09T15:30:00Z",
  // },
  // {
  //   id: "3",
  //   user_id: "123",
  //   type: "invoice_failed",
  //   message: "Your invoice payment failed. Please retry.",
  //   status: "unread",
  //   created_at: "2025-03-08T10:45:00Z",
  // },
];

interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  status: "unread" | "read";
  created_at: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, status: "read" }
          : notification
      )
    );
  };
  const unreadNotifications = notifications.filter(
    (n) => n.status === "unread"
  );
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <button className="hover:cursor-pointer">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="p-1.5 rounded-xl hover:bg-gray-100 relative">
                    <Bell strokeWidth={1.5} size={25} />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-[2px] right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
          </SheetHeader>
          {notifications.length === 0 ? (
            <div className="w-full flex flex-col gap-5 text-center text-gray-500">
              <img
                src={no_notification_img}
                alt="No notifications"
                className="w-50 mx-auto"
              />
              <p>Uhh... There are no notifications at the moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-3 rounded-lg ${
                    n.status === "unread" ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  <p className="font-medium">
                    <span
                      className={`text-${
                        n.type === "subscription_expiry" ||
                        n.type === "invoice_failed"
                          ? "red-500"
                          : "green-500"
                      }`}
                    >
                      {n.message}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(n.created_at).toLocaleString()}
                  </p>
                  {n.status === "unread" && (
                    <button
                      className="ml-1 text-xs text-blue-500 hover:underline"
                      onClick={() => markAsRead(n.id)}
                    >
                      Mark as Read
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Notifications;
