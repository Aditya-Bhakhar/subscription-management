"use client";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  ClipboardPen,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import {
  CreateAssignSubscriptionDTO,
  AssignSubscription,
  AssignSubscriptionData,
  UpdateAssignSubscriptionDTO,
} from "@/types/assignSubscriptionTypes";
import {
  useCreateAssignSubscription,
  useDeleteAssignSubscription,
  useGetAllAssignSubscriptions,
  usePatchUpdateAssignSubscription,
} from "@/hooks/useAssignSubscription";
import { useGetAllCustomers } from "@/hooks/useCustomer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateSubscriptionForm from "@/components/Forms/CreateSubscriptionForm.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Customer } from "@/types/customerTypes";
import { useGetAllSubscriptionPlans } from "@/hooks/useSubscriptionPlan";
import { SubscriptionPlan } from "@/types/subScriptionPlanTypes";
import { useGetAllItems } from "@/hooks/useItem";
import { Item } from "@/types/itemTypes";
import { ScrollArea } from "@/components/ui/scroll-area";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<AssignSubscriptionData> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent = `${row.original.customer.customer_name} ${
    row.original.plan.plan_name
  } ${row.original.items
    .map((item) => item.item_name)
    .join(" ")}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<AssignSubscriptionData> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

const autoRenewFilterFn: FilterFn<AssignSubscriptionData> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const auto_renew = row.getValue(columnId) as string;
  return filterValue.includes(auto_renew);
};

export default function Subscriptions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignedSubscription, setSelectedAssignedSubscription] =
    useState<AssignSubscriptionData | null>(null);
  const handleOpenModal = (assignedSubscription?: AssignSubscriptionData) => {
    setSelectedAssignedSubscription(assignedSubscription || null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAssignedSubscription(null);
  };

  const createAssignSubscriptionMutation = useCreateAssignSubscription();
  const updateAssignSubscriptionMutation = usePatchUpdateAssignSubscription();

  const handleCreateAssignSubscription = (
    data: CreateAssignSubscriptionDTO
  ) => {
    createAssignSubscriptionMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  const handleEditAssignedSubscription = (
    data: Partial<UpdateAssignSubscriptionDTO>
  ) => {
    if (!selectedAssignedSubscription) return;

    updateAssignSubscriptionMutation.mutate(
      {
        id: selectedAssignedSubscription.id,
        subscriptionData: data,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
        },
      }
    );
  };

  const columns: ColumnDef<AssignSubscriptionData>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      size: 28,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Customer",
      accessorKey: "customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as {
          customer_id: string;
          customer_name: string;
        };

        if (!customer || !customer.customer_name) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }

        return <div className="font-medium">{customer.customer_name}</div>;
      },
      size: 150,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Plan",
      accessorKey: "plan",
      cell: ({ row }) => {
        const plan = row.getValue("plan") as {
          plan_id: string;
          plan_name: string;
        };

        if (!plan || !plan.plan_name) {
          return <span className="text-sm text-muted-foreground">-</span>;
        }

        return <div className="font-medium">{plan.plan_name}</div>;
      },
      size: 150,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
            row.getValue("status") === "pending" &&
              "bg-yellow-200 text-yellow-800",
            row.getValue("status") === "active" &&
              "bg-green-200 text-green-800",
            row.getValue("status") === "suspended" &&
              "bg-orange-200 text-orange-800",
            row.getValue("status") === "expired" && "bg-red-200 text-red-800",
            row.getValue("status") === "canceled" &&
              "bg-gray-200 text-gray-800",
            row.getValue("status") === "renewed" && "bg-blue-200 text-blue-800",
            row.getValue("status") === "failed" &&
              "bg-purple-200 text-purple-800"
          )}
        >
          {row.getValue("status")}
        </Badge>
      ),
      size: 80,
      filterFn: statusFilterFn,
    },
    {
      header: "Starts at",
      accessorKey: "start_date",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const startDate = row.getValue("start_date") as string;
        return startDate ? formatDate(startDate) : "-";
      },
    },
    {
      header: "Ends at",
      accessorKey: "end_date",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const endDate = row.getValue("end_date") as string;
        return endDate ? formatDate(endDate) : "-";
      },
    },
    {
      header: "Items",
      accessorKey: "items",
      cell: ({ row }) => {
        const items = row.getValue("items") as {
          item_name: string;
          quantity: number;
        }[];

        if (!Array.isArray(items) || items.length === 0) {
          return (
            <span className="text-sm text-muted-foreground">No items</span>
          );
        }
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-auto py-1 px-2">
                {items.length} items <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0">
              <ScrollArea className="max-h-40 overflow-auto">
                <div className="p-3">
                  <h4 className="font-medium mb-2">Item List</h4>
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm border-b pb-1 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{index + 1}.</span>
                          <span>{item.item_name}</span>
                        </div>
                        <Badge variant="outline">x{item.quantity}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        );
      },
      size: 100,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Auto renew",
      accessorKey: "auto_renew",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
            row.getValue("auto_renew") === true &&
              "bg-green-200 text-green-800",
            row.getValue("auto_renew") === false && "bg-red-200 text-red-800"
          )}
        >
          {row.getValue("auto_renew") ? "Enabled" : "Disabled"}
        </Badge>
      ),
      size: 100,
      filterFn: autoRenewFilterFn,
    },
    {
      header: "Created at",
      accessorKey: "created_at",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const createdDate = row.getValue("created_at") as string;
        return createdDate ? formatDate(createdDate) : "-";
      },
      size: 90,
    },
    {
      header: "Updated at",
      accessorKey: "updated_at",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const updatedDate = row.getValue("updated_at") as string;
        return updatedDate ? formatDate(updatedDate) : "-";
      },
      size: 110,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          handleOpenModal={(assignSubscription: AssignSubscription) =>
            handleOpenModal(assignSubscription)
          }
        />
      ),
      size: 60,
      enableHiding: false,
    },
  ];

  const id = useId();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updated_at",
      desc: true,
    },
  ]);

  const {
    data: assignSubscriptionsRes,
    isLoading: subscriptionsLoading,
    error: subscriptionsError,
  } = useGetAllAssignSubscriptions();

  const [assignSubscriptionData, setAssignSubscriptionData] = useState<
    AssignSubscription[]
  >([]);

  const {
    data: customersRes,
    isLoading: customersLoading,
    isError: customersError,
  } = useGetAllCustomers();
  const customerOptions = customersRes?.data?.customers?.map(
    (customer: Customer) => ({
      value: customer.id,
      label: `${customer.firstname} ${customer.lastname}`,
    })
  );

  const {
    data: subscriptionPlansRes,
    isLoading: subscriptionPlansLoading,
    isError: subscriptionPlansError,
  } = useGetAllSubscriptionPlans();
  const subscriptionPlanOptions =
    subscriptionPlansRes?.data?.subscription_plans?.map(
      (subscriptionPlan: SubscriptionPlan) => ({
        value: subscriptionPlan.id,
        label: subscriptionPlan.name,
      })
    );

  const {
    data: itemsRes,
    isLoading: itemsLoading,
    isError: itemsError,
  } = useGetAllItems();
  const itemOptions = itemsRes?.data?.items?.map((item: Item) => ({
    value: item.id,
    label: item.name,
  }));

  useEffect(() => {
    if (assignSubscriptionsRes?.data?.subscriptions) {
      setAssignSubscriptionData(assignSubscriptionsRes.data.subscriptions);
    }
  }, [assignSubscriptionsRes]);

  const deleteSubscriptionMutation = useDeleteAssignSubscription();

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    selectedIds.forEach((id) => {
      deleteSubscriptionMutation.mutate(id, {
        onSuccess: () => {
          const updatedData = assignSubscriptionData.filter(
            (subscription) => subscription.id !== id
          );
          setAssignSubscriptionData(updatedData);
        },
      });
    });
    table.resetRowSelection();
  };

  const table = useReactTable({
    data: assignSubscriptionData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      pagination,
      columnFilters,
      columnVisibility,
    },
  });

  const statusColumn = table.getColumn("status");
  const statusFacetedUniqueValues = statusColumn?.getFacetedUniqueValues();
  const autoRenewColumn = table.getColumn("auto_renew");
  const autoRenewFacetedUniqueValues =
    autoRenewColumn?.getFacetedUniqueValues();

  // Get unique statuss values
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return [];
    const values = Array.from(statusFacetedUniqueValues?.keys() || []);
    return values.sort();
  }, [statusColumn, statusFacetedUniqueValues]);
  // Get unique autoRenew values
  const uniqueAutoRenewValues = useMemo(() => {
    if (!autoRenewColumn) return [];
    const values = Array.from(autoRenewFacetedUniqueValues?.keys() || []);
    return values.sort();
  }, [autoRenewColumn, autoRenewFacetedUniqueValues]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    if (!statusColumn) return new Map();
    return statusFacetedUniqueValues || new Map();
  }, [statusColumn, statusFacetedUniqueValues]);
  // Get counts for each autoRenew
  const autoRenewCounts = useMemo(() => {
    if (!autoRenewColumn) return new Map();
    return autoRenewFacetedUniqueValues || new Map();
  }, [autoRenewColumn, autoRenewFacetedUniqueValues]);

  // Get selected statuss
  const statusFilterValue = statusColumn?.getFilterValue() as
    | string[]
    | undefined;
  const selectedStatus = useMemo(() => {
    return statusFilterValue ?? [];
  }, [statusFilterValue]);
  // Get selected autoRenew
  const autoRenewFilterValue = autoRenewColumn?.getFilterValue() as
    | string[]
    | undefined;
  const selectedAutoRenew = useMemo(() => {
    return autoRenewFilterValue ?? [];
  }, [autoRenewFilterValue]);

  const handleStatusChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("status")?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }
    table
      .getColumn("status")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };
  const handleAutoRenewChange = (checked: boolean, value: string) => {
    const filterValue = table
      .getColumn("auto_renew")
      ?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }
    table
      .getColumn("auto_renew")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  if (subscriptionsLoading) return <p>Loading subscriptions...</p>;
  if (subscriptionsError) return <p>Error loading subscriptions</p>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by customer_name or plan_name or item_name */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-94 ps-9",
                Boolean(table.getColumn("customer")?.getFilterValue()) && "pe-9"
              )}
              value={
                (table.getColumn("customer")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("customer")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by customer or plan or item..."
              type="text"
              aria-label="Filter by customer_name or plan_name or item_name"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("customer")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("customer")?.setFilterValue("");
                  if (inputRef.current) {
                    inputRef.current.focus();
                  }
                }}
              >
                <CircleXIcon size={16} aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filter by status */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Status
                {selectedStatus.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedStatus.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {uniqueStatusValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedStatus.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleStatusChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        <Badge
                          className={cn(
                            "px-1.5 py-0 rounded-sm font-medium text-[13px]",
                            value === "pending" &&
                              "bg-yellow-200 text-yellow-800",
                            value === "active" && "bg-green-200 text-green-800",
                            value === "suspended" &&
                              "bg-orange-200 text-orange-800",
                            value === "expired" && "bg-red-200 text-red-800",
                            value === "canceled" && "bg-gray-200 text-gray-800",
                            value === "renewed" && "bg-blue-200 text-blue-800",
                            value === "failed" &&
                              "bg-purple-200 text-purple-800"
                          )}
                        >
                          {value}
                        </Badge>{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {statusCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Filter by auto_renew */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <FilterIcon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                Auto Renew
                {selectedAutoRenew.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedAutoRenew.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto min-w-36 p-3" align="start">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs font-medium">
                  Filters
                </div>
                <div className="space-y-3">
                  {uniqueAutoRenewValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedAutoRenew.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleAutoRenewChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        <Badge
                          className={cn(
                            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
                            value === true && "bg-green-200 text-green-800",
                            value === false && "bg-red-200 text-red-800"
                          )}
                        >
                          {value ? "Enabled" : "Disabled"}
                        </Badge>
                        <span className="text-muted-foreground ms-2 text-xs">
                          {autoRenewCounts.get(value)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon
                  className="-ms-1 opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                      onSelect={(event) => event.preventDefault()}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          {/* Delete button */}
          {table.getSelectedRowModel().rows.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {table.getSelectedRowModel().rows.length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {table.getSelectedRowModel().rows.length} selected{" "}
                      {table.getSelectedRowModel().rows.length === 1
                        ? "row"
                        : "rows"}
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          {/* Assign subscription button */}
          <Button
            className="ml-auto"
            variant="outline"
            onClick={() => handleOpenModal()}
          >
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Assign subscription
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            // Enhanced keyboard handling for sorting
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="last:py-0">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog for Create or Edit Assigned subscription */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <div className="mb-2 flex flex-col gap-2">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
              <ClipboardPen className="opacity-80" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-left">
                {selectedAssignedSubscription
                  ? "Edit Assigned Subscription"
                  : "Assign New Subscription"}
              </DialogTitle>
              <DialogDescription className="text-left">
                {selectedAssignedSubscription
                  ? "Modify assigned subscription details below."
                  : "Fill in the details to assign a new subscription."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <CreateSubscriptionForm
            assignSubscriptionData={selectedAssignedSubscription}
            onSubmit={
              selectedAssignedSubscription
                ? handleEditAssignedSubscription
                : handleCreateAssignSubscription
            }
            isLoading={subscriptionsLoading}
            assignSubscriptions={assignSubscriptionData}
            subscriptionsLoading={subscriptionsLoading}
            subscriptionsError={subscriptionsError}
            customers={customerOptions || []}
            customersLoading={customersLoading}
            customersError={customersError}
            subscriptionPlans={subscriptionPlanOptions || []}
            subscriptionPlansLoading={subscriptionPlansLoading}
            subscriptionPlansError={subscriptionPlansError}
            items={itemOptions || []}
            itemsLoading={itemsLoading}
            itemsError={itemsError}
          />
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-8">
        {/* Results per page */}
        <div className="flex items-center gap-3">
          <Label htmlFor={id} className="max-sm:sr-only">
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger id={id} className="w-fit whitespace-nowrap">
              <SelectValue placeholder="Select number of results" />
            </SelectTrigger>
            <SelectContent className="[&_*[status=option]]:ps-2 [&_*[status=option]]:pe-8 [&_*[status=option]>span]:start-auto [&_*[status=option]>span]:end-2">
              {[5, 10, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Page number information */}
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p
            className="text-muted-foreground text-sm whitespace-nowrap"
            aria-live="polite"
          >
            <span className="text-foreground">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              -
              {Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0
                ),
                table.getRowCount()
              )}
            </span>{" "}
            of{" "}
            <span className="text-foreground">
              {table.getRowCount().toString()}
            </span>
          </p>
        </div>

        {/* Pagination buttons */}
        <div>
          <Pagination>
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Previous page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Next page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              {/* Last page button */}
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  className="disabled:pointer-events-none disabled:opacity-50"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function RowActions({
  row,
  handleOpenModal,
}: {
  row: Row<AssignSubscriptionData>;
  handleOpenModal: (assignSubscription: AssignSubscription) => void;
}) {
  const deleteSubscriptionMutation = useDeleteAssignSubscription();

  const handleDelete = () => {
    deleteSubscriptionMutation.mutate(row.original.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit subscription"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleOpenModal(row.original)}>
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
        >
          <span>Delete</span>
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
