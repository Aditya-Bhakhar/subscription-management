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
  ListFilterIcon,
  PlusIcon,
  TrashIcon,
  UserRoundPlusIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  CreateExpenseDTO,
  Expense,
  UpdateExpenseDTO,
} from "@/types/expenseTypes.ts";
import {
  useCreateExpense,
  useDeleteExpense,
  useGetAllExpenses,
  usePatchUpdateExpense,
} from "@/hooks/useExpense";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateExpenseForm from "@/components/Forms/CreateExpenseForm";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<Expense> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.expense_name} ${row.original.provider_name} ${row.original.amount}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const statusFilterFn: FilterFn<Expense> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const status = row.getValue(columnId) as string;
  return filterValue.includes(status);
};

export default function Expenses() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const handleOpenModal = (expense?: Expense) => {
    console.log("Opening Modal for Expense:", expense); // Debug log
    setSelectedExpense(expense || null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExpense(null);
  };

  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = usePatchUpdateExpense();

  const handleCreateExpense = (data: CreateExpenseDTO) => {
    return new Promise<void>((resolve, reject) => {
      createExpenseMutation.mutate(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          resolve(); // Resolve the Promise on success
        },
        onError: (error) => {
          reject(error); // Reject the Promise on error
        },
      });
    });
  };

  const handleEditExpense = (data: Partial<UpdateExpenseDTO>) => {
    if (!selectedExpense) return Promise.reject("No expense selected");

    return new Promise<void>((resolve, reject) => {
      updateExpenseMutation.mutate(
        {
          id: selectedExpense.id,
          expenseData: data,
        },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            resolve(); // Resolve the Promise on success
          },
          onError: (error) => {
            reject(error); // Reject the Promise on error
          },
        }
      );
    });
  };

  const columns: ColumnDef<Expense>[] = [
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
      header: "Expense Name",
      accessorKey: "expense_name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("expense_name")}</div>
      ),
      size: 150,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Provider Name",
      accessorKey: "provider_name",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("provider_name")}</div>
      ),
      size: 150,
    },
    {
      header: "Amount",
      accessorKey: "amount",
      size: 80,
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
            row.getValue("status") === "active" &&
              "bg-green-200 text-green-800",
            row.getValue("status") === "pending" &&
              "bg-yellow-200 text-yellow-800",
            row.getValue("status") === "expired" && "bg-red-200 text-red-800",
            row.getValue("status") === "canceled" && "bg-gray-200 text-gray-800"
          )}
        >
          {row.getValue("status")}
        </Badge>
      ),
      size: 80,
      filterFn: statusFilterFn,
    },
    {
      header: "Purchased at",
      accessorKey: "purchased_date",
      cell: ({ row }) => {
        const formatDate = (dateString: string) => {
          return format(new Date(dateString), "dd-MM-yyyy HH:mm:ss");
        };
        const purchasedDate = row.getValue("purchased_date") as string;
        return purchasedDate ? formatDate(purchasedDate) : "-";
      },
      size: 90,
    },
    {
      header: "Renewal at",
      accessorKey: "renewal_date",
      cell: ({ row }) => {
        const rawValue = row.getValue("renewal_date");
    
        // Check for valid date value
        if (!rawValue) return "-";
    
        const date = new Date(rawValue as string);
    
        // Check if the date is valid
        if (isNaN(date.getTime())) return "-";
    
        return format(date, "dd-MM-yyyy HH:mm:ss");
      },
      size: 90,
    },
    {
      header: "Notes",
      accessorKey: "notes",
      size: 200,
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
          handleOpenModal={(expense: Expense) => handleOpenModal(expense)}
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

  const { data, isLoading, error } = useGetAllExpenses();
  const [expenseData, setExpenseData] = useState<Expense[]>([]);

  useEffect(() => {
    if (data?.data?.expenses) {
      setExpenseData(data.data.expenses);
    }
  }, [data]);

  const deleteExpenseMutation = useDeleteExpense();

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    selectedIds.forEach((id) => {
      deleteExpenseMutation.mutate(id, {
        onSuccess: () => {
          const updatedData = expenseData.filter(
            (expense) => expense.id !== id
          );
          setExpenseData(updatedData);
        },
      });
    });
    table.resetRowSelection();
  };

  const table = useReactTable({
    data: expenseData,
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

  if (isLoading) return <p>Loading expenses...</p>;
  if (error) return <p>Error loading expenses</p>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by expense name, provider name or amount */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-94 ps-9",
                Boolean(table.getColumn("expense_name")?.getFilterValue()) &&
                  "pe-9"
              )}
              value={
                (table.getColumn("expense_name")?.getFilterValue() ??
                  "") as string
              }
              onChange={(e) =>
                table.getColumn("expense_name")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by expense name, provider name or amount..."
              type="text"
              aria-label="Filter by expense name, provider name or amount"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("expense_name")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("expense_name")?.setFilterValue("");
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
                            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
                            value === "active" && "bg-green-200 text-green-800",
                            value === "pending" &&
                              "bg-yellow-200 text-yellow-800",
                            value === "expired" && "bg-red-200 text-red-800",
                            value === "canceled" && "bg-gray-200 text-gray-800"
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
          {/* Add expense button */}
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
            Add expense
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

      {/* Dialog for Create or Edit Expense */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <div className="mb-2 flex flex-col gap-2">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full border">
              <UserRoundPlusIcon className="opacity-80" size={16} />
            </div>
            <DialogHeader>
              <DialogTitle className="text-left">
                {selectedExpense ? "Edit Expense" : "Create New Expense"}
              </DialogTitle>
              <DialogDescription className="text-left">
                {selectedExpense
                  ? "Modify expense details below."
                  : "Fill in the details to add a new expense."}
              </DialogDescription>
            </DialogHeader>
          </div>
          <CreateExpenseForm
            onSubmit={selectedExpense ? handleEditExpense : handleCreateExpense}
            isLoading={isLoading}
            expenseData={selectedExpense}
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
  row: Row<Expense>;
  handleOpenModal: (customer: Expense) => void;
}) {
  const deleteExpenseMutation = useDeleteExpense();

  const handleDelete = () => {
    deleteExpenseMutation.mutate(row.original.id);
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
