import { EVENT_REGISTER } from "@/api";
import Page from "@/app/page/page";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Edit, Search, SquarePlus, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import EventRegisterForm from "./EventRegisterForm";
import { useToast } from "@/hooks/use-toast";
const EventRegisterList = () => {
  const {
    data: eventregisterdata,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: EVENT_REGISTER,
    queryKey: ["eventregisterdata"],
  });
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedId, setSelected] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const { trigger: submitTrigger } = useApiMutation();
  const handleDeleteRow = (eventid) => {
    setDeleteItemId(eventid);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = async () => {
    try {
      const response = await submitTrigger({
        url: `${EVENT_REGISTER}/${deleteItemId}`,
        method: "delete",
      });
      if (response.code == 201) {
        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
        setDeleteConfirmOpen(false);
        setDeleteItemId(null);
        refetch();
      } else if (response.code == 400) {
        toast({
          title: "Duplicate Entry",
          description: response.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description:
          error?.response?.data?.msg ||
          error.message ||
          "Something unexpected happened.",
        variant: "destructive",
      });
      console.error("Failed to delete:", error);
    }
  };
  const columns = [
    {
      accessorKey: "event_register_mid",
      id: "Event Id",
      header: "Event Id",
      cell: ({ row }) => <div>{row.getValue("Event Id")}</div>,
    },
    {
      accessorKey: "event_name",
      id: "Event Name",
      header: "Event Name",
      cell: ({ row }) => <div>{row.getValue("Event Name")}</div>,
    },
    {
      accessorKey: "name",
      id: "Name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("Name")}</div>,
    },
    {
      accessorKey: "event_register_date",
      id: "Register Date",
      header: "Register Date",
      cell: ({ row }) => {
        const date = row.getValue("Register Date");
        return <div>{moment(date).format("DD MMM YYYY")}</div>;
      },
    },
    {
      accessorKey: "event_register_name",
      id: "Register Name",
      header: "Register Name",
      cell: ({ row }) => <div>{row.getValue("Register Name")}</div>,
    },
    {
      accessorKey: "event_register_mobile",
      id: "Mobile",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("Mobile")}</div>,
    },
    {
      accessorKey: "event_register_email",
      id: "Email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("Email")}</div>,
    },
    // {
    //   accessorKey: "event_register_amount",
    //   id: "Amount",
    //   header: "Amount",
    //   cell: ({ row }) => <div>{row.getValue("Amount")}</div>,
    // },
    // {
    //   accessorKey: "event_register_payment_type",
    //   id: "Payment Type",
    //   header: "Payment Type",
    //   cell: ({ row }) => <div>{row.getValue("Payment Type")}</div>,
    // },
    // {
    //   accessorKey: "event_register_transaction",
    //   id: "Transaction",
    //   header: "Transaction",
    //   cell: ({ row }) => <div>{row.getValue("Transaction")}</div>,
    // },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const id = row.original.id;

        return (
          <div className="flex flex-row">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelected(id);
                      setOpen(true);
                    }}
                  >
                    <Edit />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Event Register</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteRow(id)}
                    className="text-red-500"
                    type="button"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Event Register</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: eventregisterdata?.data || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (isError) {
    return (
      <ErrorComponent
        message="Error Fetching Event Register Data"
        refetch={refetch}
      />
    );
  }

  return (
    <Page>
      <div className="w-full">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Event Register List
        </div>
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Event Register..."
              value={table.getState().globalFilter || ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto ">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} `}
            onClick={() => {
              setSelected(null);
              setOpen(true);
            }}
          >
            <SquarePlus className="h-4 w-4 " /> Event Register
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
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
                      <TableCell key={cell.id}>
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
        {/* row slection and pagintaion button  */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Event Register: &nbsp;
            {table.getFilteredRowModel().rows.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      {open && (
        <EventRegisterForm
          setOpen={setOpen}
          open={open}
          selectedId={selectedId}
          refetch={refetch}
        />
      )}
      {deleteConfirmOpen && (
        <DeleteAlertDialog
          open={deleteConfirmOpen}
          onOpenChange={setDeleteConfirmOpen}
          description="Event Register"
          handleDelete={confirmDelete}
        />
      )}
    </Page>
  );
};

export default EventRegisterList;
