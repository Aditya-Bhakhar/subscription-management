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
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CircleAlertIcon,
  CircleXIcon,
  Columns3Icon,
  EllipsisIcon,
  FilterIcon,
  Info,
  ListFilterIcon,
  // PlusIcon,
  TrashIcon,
  // UserRoundPlusIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  // CreateInvoiceDTO,
  Invoice,
} from "@/types/invoiceTypes.ts";
import {
  // useCreateInvoice,
  useDeleteInvoices,
  useGetAllInvoices,
  usePatchUpdateInvoice,
} from "@/hooks/useInvoice";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import CreateInvoiceForm from "@/components/Forms/CreateInvoiceDialogForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import EditInvoiceDialogForm from "@/components/Forms/EditInvoiceDialogForm";
// import CreateInvoiceDialogForm from "@/components/Forms/CreateInvoiceDialogForm";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Invoice> = (row, columnId, filterValue) => {
  const searchableRowContent = `${row.original.customer_name} ${
    row.original.customer_email
  } ${row.original.plan_name} ${row.original.plan_price} ${
    row.original.invoice_number
  } ${row.original.items
    .map((item) => item.item_name)
    .join(" ")}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Invoice> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export default function Invoices() {
  // const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Pick<
    Invoice,
    "id" | "total_amount" | "status" | "due_date" | "notes"
  > | null>(null);
  // const handleOpenCreateModal = (invoice?: Invoice) => {
  //   console.log("Opening Create Modal for Invoice:", invoice);
  //   setIsCreateModalOpen(true);
  // };
  // const handleCloseCreateModal = () => {
  //   setIsCreateModalOpen(false);
  // };

  // const createInvoiceMutation = useCreateInvoice();
  const updateInvoiceMutation = usePatchUpdateInvoice();

  // const handleCreateInvoice = (data: CreateInvoiceDTO) => {
  //   createInvoiceMutation.mutate(data, {
  //     onSuccess: () => {
  //       setIsCreateModalOpen(false);
  //     },
  //   });
  // };

  const handleEditInvoice = (
    invoice: Pick<
      Invoice,
      "id" | "total_amount" | "status" | "due_date" | "notes"
    >
  ) => {
    setSelectedInvoice(invoice);
    setIsEditModalOpen(true);
  };

  const handleSaveInvoice = async (updatedInvoiceData: {
    id: string;
    status:
      | "pending"
      | "generated"
      | "sent"
      | "paid"
      | "overdue"
      | "canceled"
      | "failed"
      | "refunded";
    total_amount: number;
    due_date: Date | undefined;
    notes: string | null;
  }) => {
    if (selectedInvoice) {
      await updateInvoiceMutation.mutateAsync(
        {
          id: selectedInvoice.id,
          invoiceData: updatedInvoiceData,
        },
        {
          onSuccess: () => {
            console.log("Invoice updated successfully");
          },
        }
      );
      setIsEditModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const columns: ColumnDef<Invoice>[] = [
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
      accessorKey: "customer_name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customer_name")}</div>
      ),
      size: 150,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Email ID",
      accessorKey: "customer_email",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("customer_email")}</div>
      ),
      size: 250,
    },
    {
      header: "Subscription Plan",
      accessorKey: "plan_name",
      size: 140,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Price of Plan",
      accessorKey: "plan_price",
      size: 110,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Invoice Number",
      accessorKey: "invoice_number",
      size: 150,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      size: 120,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "px-2 py-0.5 rounded-md text-[13px] font-semibold capitalize",
            row.getValue("status") === "pending" &&
              "bg-yellow-100 text-yellow-700",
            row.getValue("status") === "generated" &&
              "bg-blue-100 text-blue-700",
            row.getValue("status") === "sent" &&
              "bg-indigo-100 text-indigo-700",
            row.getValue("status") === "paid" && "bg-green-100 text-green-700",
            row.getValue("status") === "overdue" && "bg-red-100 text-red-700",
            row.getValue("status") === "canceled" &&
              "bg-gray-200 text-gray-700",
            row.getValue("status") === "failed" && "bg-red-200 text-red-800",
            row.getValue("status") === "refunded" &&
              "bg-purple-100 text-purple-700"
          )}
        >
          {row.getValue("status")}
        </Badge>
      ),
      size: 100,
      filterFn: statusFilterFn,
    },
    {
      header: "Items",
      accessorKey: "items",
      cell: ({ row }) => {
        const items = row.getValue("items") as {
          item_id: string;
          item_name: string;
          quantity: number;
          price_per_unit: number;
        }[];
        if (!Array.isArray(items) || items.length === 0) {
          return (
            <span className="text-sm text-muted-foreground">— No Items —</span>
          );
        }
        return (
          <div className="space-y-1">
            {items.map((item, index) => (
              <div
                key={item.item_id || index}
                className="flex items-center justify-between bg-gray-100/50 rounded-lg px-3 py-1 shadow-sm"
              >
                <span className="text-sm font-medium text-gray-700">
                  {index + 1}. {item.item_name}
                </span>
                <div className="text-xs text-gray-500 flex gap-3">
                  <span>x{item.quantity} </span>
                  <span>₹{item.price_per_unit.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        );
      },
      size: 250,
    },
    {
      header: "Issued at",
      accessorKey: "issued_date",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const issuedDate = row.getValue("issued_date") as string;
        return issuedDate ? formatDate(issuedDate) : "-";
      },
      size: 110,
    },
    {
      header: "Due date",
      accessorKey: "due_date",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const dueDate = row.getValue("due_date") as string;
        return dueDate ? formatDate(dueDate) : "-";
      },
      size: 110,
    },
    {
      header: "PDF",
      accessorKey: "pdf_url",
      cell: ({ row }) => {
        const pdfUrl = row.getValue("pdf_url") as string;
        if (pdfUrl) {
          return (
            <a
              href={`${VITE_BACKEND_URL}${pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View PDF
            </a>
          );
        }
        return "-";
      },
      size: 100,
    },
    {
      header: "Notes",
      accessorKey: "notes",
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string;
        return notes ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between bg-gray-100/50 rounded-lg px-3 py-1 shadow-sm cursor-pointer">
                <span className="text-sm font-medium text-gray-700">Notes</span>
                <Info className="h-4 w-4 text-gray-500" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs text-sm">
              {notes}
            </TooltipContent>
          </Tooltip>
        ) : (
          <span className="text-sm text-gray-400 italic">No notes</span>
        );
      },
      size: 120,
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
      size: 120,
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
      size: 120,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <RowActions
          row={row}
          onEdit={({ id, total_amount, status, due_date, notes }) =>
            handleEditInvoice({
              id,
              total_amount,
              status,
              due_date,
              notes,
            })
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

  const { data, isLoading, error } = useGetAllInvoices();
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);

  useEffect(() => {
    if (data?.data?.invoices) {
      setInvoiceData(data.data.invoices);
    }
  }, [data]);

  const deleteInvoicesMutation = useDeleteInvoices();

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    if (selectedIds.length === 0) return;
    deleteInvoicesMutation.mutate(selectedIds, {
      onSuccess: () => {
        const updatedData = invoiceData.filter(
          (invoice) => !selectedIds.includes(invoice.id)
        );
        setInvoiceData(updatedData);
      },
    });
    table.resetRowSelection();
  };

  const table = useReactTable({
    data: invoiceData,
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
  const facetedUniqueValues = statusColumn?.getFacetedUniqueValues();

  // Get unique statuss values
  const uniqueStatusValues = useMemo(() => {
    if (!statusColumn) return [];
    const values = Array.from(facetedUniqueValues?.keys() || []);
    return values.sort();
  }, [statusColumn, facetedUniqueValues]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    if (!statusColumn) return new Map();
    return facetedUniqueValues || new Map();
  }, [statusColumn, facetedUniqueValues]);

  // Get selected statuss
  const statusFilterValue = statusColumn?.getFilterValue() as
    | string[]
    | undefined;
  const selectedStatus = useMemo(() => {
    return statusFilterValue ?? [];
  }, [statusFilterValue]);

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

  if (isLoading) return <p>Loading invoices...</p>;
  if (error) return <p>Error loading invoices</p>;

  return (
    <div className="space-y-4 p-2">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by customer, email, plan, price, invoice number or item */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-110 ps-9",
                Boolean(table.getColumn("customer_name")?.getFilterValue()) &&
                  "pe-9"
              )}
              value={
                (table.getColumn("customer_name")?.getFilterValue() ??
                  "") as string
              }
              onChange={(e) =>
                table.getColumn("customer_name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by customer, email, plan, price, invoice number or item..."
              type="text"
              aria-label="Filter by customer, email, plan, price, invoice number or item"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("customer_name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("customer_name")?.setFilterValue("");
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
                            "px-2 py-0.5 rounded-md text-[13px] font-semibold capitalize",
                            value === "pending" &&
                              "bg-yellow-100 text-yellow-700",
                            value === "generated" &&
                              "bg-blue-100 text-blue-700",
                            value === "sent" && "bg-indigo-100 text-indigo-700",
                            value === "paid" && "bg-green-100 text-green-700",
                            value === "overdue" && "bg-red-100 text-red-700",
                            value === "canceled" && "bg-gray-200 text-gray-700",
                            value === "failed" && "bg-red-200 text-red-800",
                            value === "refunded" &&
                              "bg-purple-100 text-purple-700"
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
          {/* Add invoice button */}
          {/* <Button
            className="ml-auto"
            variant="outline"
            onClick={() => handleOpenCreateModal()}
          >
            <PlusIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Add invoice
          </Button> */}
        </div>
      </div>
      {/* Table */}
      <div className="bg-background overflow-auto max-w-[1360px] rounded-md border">
        {/* <Table className=""> */}
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

      {/* Dialog for Create Invoice */}

      {/* Dialog for Edit Invoice */}
      <EditInvoiceDialogForm
        isEditModalOpen={isEditModalOpen}
        setIsEditModalOpen={setIsEditModalOpen}
        selectedInvoice={selectedInvoice}
        handleSaveInvoice={handleSaveInvoice}
        updateInvoiceMutation={updateInvoiceMutation}
      />

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
  onEdit,
}: {
  row: Row<Invoice>;
  onEdit: (
    invoice: Pick<
      Invoice,
      "id" | "total_amount" | "status" | "due_date" | "notes"
    >
  ) => void;
}) {
  const deleteInvoicesMutation = useDeleteInvoices();

  const handleDelete = () => {
    deleteInvoicesMutation.mutate([row.original.id]);
  };

  const handleEdit = () => {
    onEdit({
      id: row.original.id,
      total_amount: row.original.total_amount,
      status: row.original.status,
      due_date: row.original.due_date,
      notes: row.original.notes ?? null,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex justify-end">
          <Button
            size="icon"
            variant="ghost"
            className="shadow-none"
            aria-label="Edit item"
          >
            <EllipsisIcon size={16} aria-hidden="true" />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleEdit}>
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
