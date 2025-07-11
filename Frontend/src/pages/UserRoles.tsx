import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Briefcase } from "lucide-react";

const financePermissions = [
  "Manage Customers",
  "Manage Subscriptions",
  "Manage Invoices",
  "Manage Expenses",
  "View Analytics",
];

const roles = [
  {
    title: "Finance",
    icon: <Briefcase className="w-5 h-5 text-blue-600" />,
    description:
      "Access limited to financial modules like invoices, subscriptions, expenses, and reports.",
    permissions: financePermissions,
  },
  {
    title: "Admin",
    icon: <ShieldCheck className="w-5 h-5 text-green-600" />,
    description:
      "Full access including financial and administrative modules such as user and role management.",
    permissions: ["Manage Users", "Manage Roles", ...financePermissions],
  },
];

export default function UserRoles() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">User Roles</h1>
        <p className="text-muted-foreground">
          Learn about available roles and their permissions within the system.
        </p>
      </div>
      <Separator />
      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <Card
            key={role.title}
            className={`border-0 border-t-4 ${
              role.title === "Finance" ? "border-blue-500" : "border-green-600"
            }`}
          >
            <CardHeader className="flex items-center space-x-3">
              <div className="p-2 rounded-full bg-muted">{role.icon}</div>
              <div>
                <CardTitle>{role.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
              <div className="space-y-1">
                <p className="font-medium text-sm text-muted-foreground">
                  Permissions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((perm) => (
                    <Badge key={perm} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>
              </div>
              {role.title === "Admin" && (
                <p className="text-xs text-muted-foreground italic">
                  * Includes all Finance permissions.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
