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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  // PlusIcon,
  TrashIcon,
  // UserPlusIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { format } from "date-fns";
import { User } from "@/types/userTypes.ts";
import {
  useDeleteUser,
  useGetAllUsers,
  usePatchUpdateUser,
} from "@/hooks/useUser";
// import CreateUserForm from "@/components/Forms/CreateUserForm.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Custom filter function for multi-column searching
const multiColumnFilterFn: FilterFn<User> = (row, columnId, filterValue) => {
  const searchableRowContent =
    `${row.original.firstname} ${row.original.lastname} ${row.original.email}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const roleFilterFn: FilterFn<User> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const role = row.getValue(columnId) as string;
  return filterValue.includes(role);
};

export default function Users() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Pick<
    User,
    "id" | "role"
  > | null>(null);
  // const createUserMutation = useCreateUser();
  const patchUpdateUserMutation = usePatchUpdateUser(selectedUser?.id);

  const handleEditUser = (user: Pick<User, "id" | "role">) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  useEffect(() => {
    console.log("Updated selectedUser:", selectedUser);
  }, [selectedUser]);

  const handleSaveRole = async (newRole: "admin" | "finance") => {
    if (selectedUser) {
      await patchUpdateUserMutation.mutateAsync(
        {
          id: selectedUser.id,
          userData: { role: newRole }, // Only updating role
        },
        {
          onSuccess: () => {
            console.log("User role updated successfully");
          },
        }
      );
      setIsEditModalOpen(false);
      setSelectedUser(null);
    }
  };

  const formatDate = (dateString?: string) => {
    return dateString ? format(new Date(dateString), "dd-MM-yyyy HH:mm:ss") : "-";
  };
  
  const columns: ColumnDef<User>[] = [
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
      size: 40,
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Firstname",
      accessorKey: "firstname",
      cell: ({ row }) => <div className="font-medium">{row.getValue("firstname")}</div>,
      size: 160,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Lastname",
      accessorKey: "lastname",
      cell: ({ row }) => <div className="font-medium">{row.getValue("lastname")}</div>,
      size: 160,
      filterFn: multiColumnFilterFn,
      enableHiding: false,
    },
    {
      header: "Email",
      accessorKey: "email",
      size: 220,
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => (
        <Badge
          className={cn(
            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
            row.getValue("role") === "admin" && "bg-red-200 text-red-800",
            row.getValue("role") === "finance" && "bg-blue-200 text-blue-800"
          )}
        >
          {row.getValue("role")}
        </Badge>
      ),
      size: 100,
      filterFn: roleFilterFn,
    },
    {
      header: "Last Login",
      accessorKey: "last_login_at",
      cell: ({ row }) => formatDate(row.getValue("last_login_at")),
      size: 180,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => formatDate(row.getValue("created_at")),
      size: 180,
    },
    {
      header: "Updated At",
      accessorKey: "updated_at",
      cell: ({ row }) => formatDate(row.getValue("updated_at")),
      size: 180,
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }: { row: Row<User> }) => (
        <RowActions
          row={row}
          onEdit={({ id, role }) => handleEditUser({ id, role })}
        />
      ),
      size: 80,
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

  const { data, isLoading, error } = useGetAllUsers();
  const [userData, setUserData] = useState<User[]>([]);

  useEffect(() => {
    if (data?.data?.users) {
      setUserData(data.data.users);
    }
  }, [data]);

  const deleteUserMutation = useDeleteUser();

  const handleDeleteRows = () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);
    // Delete each selected user
    selectedIds.forEach((id) => {
      deleteUserMutation.mutate(id, {
        onSuccess: () => {
          // Update the local state to remove the deleted user
          const updatedData = userData.filter((user) => user.id !== id);
          setUserData(updatedData);
        },
      });
    });
    // Reset row selection after deletion
    table.resetRowSelection();
  };

  const table = useReactTable({
    data: userData,
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

  const roleColumn = table.getColumn("role");
  const facetedUniqueValues = roleColumn?.getFacetedUniqueValues();

  // Get unique roles values
  const uniqueRoleValues = useMemo(() => {
    if (!roleColumn) return [];
    const values = Array.from(facetedUniqueValues?.keys() || []);
    return values.sort();
  }, [roleColumn, facetedUniqueValues]);

  // Get counts for each role
  const roleCounts = useMemo(() => {
    if (!roleColumn) return new Map();
    return facetedUniqueValues || new Map();
  }, [roleColumn, facetedUniqueValues]);

  // Get selected roles
  const roleFilterValue = roleColumn?.getFilterValue() as string[] | undefined;
  const selectedRoles = useMemo(() => {
    return roleFilterValue ?? [];
  }, [roleFilterValue]);

  const handleRoleChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn("role")?.getFilterValue() as string[];
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
      .getColumn("role")
      ?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };
  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Filter by name or email */}
          <div className="relative">
            <Input
              id={`${id}-input`}
              ref={inputRef}
              className={cn(
                "peer min-w-60 ps-9",
                Boolean(table.getColumn("firstname")?.getFilterValue()) &&
                  "pe-9"
              )}
              value={
                (table.getColumn("firstname")?.getFilterValue() ?? "") as string
              }
              onChange={(e) =>
                table.getColumn("firstname")?.setFilterValue(e.target.value)
              }
              placeholder="Filter by firstname or email..."
              type="text"
              aria-label="Filter by firstname or email"
            />
            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
              <ListFilterIcon size={16} aria-hidden="true" />
            </div>
            {Boolean(table.getColumn("firstname")?.getFilterValue()) && (
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Clear filter"
                onClick={() => {
                  table.getColumn("firstname")?.setFilterValue("");
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
                Role
                {selectedRoles.length > 0 && (
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {selectedRoles.length}
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
                  {uniqueRoleValues.map((value, i) => (
                    <div key={value} className="flex items-center gap-2">
                      <Checkbox
                        id={`${id}-${i}`}
                        checked={selectedRoles.includes(value)}
                        onCheckedChange={(checked: boolean) =>
                          handleRoleChange(checked, value)
                        }
                      />
                      <Label
                        htmlFor={`${id}-${i}`}
                        className="flex grow justify-between gap-2 font-normal"
                      >
                        <Badge
                          className={cn(
                            "px-1.5 py-0 rounded-sm text-[13px] font-medium",
                            value === "admin" && "bg-red-200 text-red-800",
                            value === "finance" && "bg-blue-200 text-blue-800"
                          )}
                        >
                          {value}
                        </Badge>{" "}
                        <span className="text-muted-foreground ms-2 text-xs">
                          {roleCounts.get(value)}
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
          {/* Add user button
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <PlusIcon
                    className="-ms-1 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  Add user
                </Button>
              </DialogTrigger>

              <DialogContent>
                <div className="mb-2 flex flex-col gap-2">
                  <div
                    className="flex size-11 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true"
                  >
                    <UserPlusIcon className="opacity-80" size={16} />
                  </div>
                  <DialogHeader>
                    <DialogTitle className="text-left">
                      Create New User
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Fill in the details to add a new user.
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <CreateUserForm
                  onSubmit={handleSaveUser}
                  isLoading={
                    createUserMutation.isPending ||
                    putUpdateUserMutation.isPending
                  }
                  selectedUser={selectedUser}
                />
              </DialogContent>
            </Dialog>
          </div> */}
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

      {/* Dialog for Role Editing */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="w-[350px]">
          <DialogHeader>
            <DialogTitle>Update Role</DialogTitle>
            <DialogDescription>
              Select a new role for the user.
            </DialogDescription>
          </DialogHeader>
          <Select
            value={selectedUser?.role || ""}
            onValueChange={(value) =>
              setSelectedUser((prev) =>
                prev ? { ...prev, role: value as "admin" | "finance" } : null
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <Badge className="bg-red-200 text-red-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">admin</Badge>
              </SelectItem>
              <SelectItem value="finance">
                <Badge className="bg-blue-200 text-blue-800 px-1.5 py-0 rounded-sm text-[13px] font-medium">finance</Badge>
              </SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() =>
              selectedUser?.role && handleSaveRole(selectedUser.role)
            }
            disabled={!selectedUser?.role || patchUpdateUserMutation.isPending}
          >
            Save Role
          </Button>
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
            <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
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
  row: Row<User>;
  onEdit: (user: Pick<User, "id" | "role">) => void;
}) {
  const deleteUserMutation = useDeleteUser();

  const handleDelete = () => {
    deleteUserMutation.mutate(row.original.id);
  };

  const handleEdit = () => {
    onEdit({ id: row.original.id, role: row.original.role }); // Pass only role and ID
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
            <span>Edit Role</span>
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
