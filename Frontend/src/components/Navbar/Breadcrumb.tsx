import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { useLocation } from "react-router";
  
  const breadcrumbData = [
    {
      title: "Home",
      items: [
        { title: "Home", url: "/" },
        { title: "Users", url: "/user" },
        { title: "Roles", url: "/user-role" },
      ],
    },
    {
      title: "Customers",
      items: [{ title: "Customers", url: "/customer" }],
    },
    {
      title: "Product Catalogue",
      items: [
        { title: "Items", url: "/item" },
        { title: "Subscription Plans", url: "/subscription-plan" },
      ],
    },
    {
      title: "Sales",
      items: [
        { title: "Subscriptions", url: "/subscription" },
        { title: "Invoices", url: "/invoice" },
      ],
    },
    {
      title: "Expenses",
      items: [{ title: "Expenses", url: "/expense" }],
    },
    {
      title: "Reports",
      items: [{ title: "Dashboard", url: "/dashboard" }],
    },
  ];
  
  export default function BreadcrumbComponent() {
    const location = useLocation();
    const pathSegments = location.pathname.split("/").filter(Boolean); // Get path segments
  
    // Find breadcrumb items matching the current path
    const breadcrumbItems = pathSegments
      .map((segment, index) => {
        const fullPath = `/${pathSegments.slice(0, index + 1).join("/")}`;
        const item = breadcrumbData
          .flatMap((category) => category.items)
          .find((item) => item.url === fullPath);
        return item ? { title: item.title, url: fullPath } : null;
      })
      .filter(Boolean);
  
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item.url}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbItems.length - 1 ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={item.url}>{item.title}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }
  