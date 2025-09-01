import { EVENT, EVENT_MEMEBER_TRACK, MEMBER_LIST } from "@/api";
import Page from "@/app/page/page";
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
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Edit, Search, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EventMemberTrackForm from "../EventMemberTrack/EventMemberTrackForm";
import { decryptId } from "@/utils/encyrption/Encyrption";
import DeleteAlertDialog from "@/components/common/DeleteAlertDialog";
import { useSelector } from "react-redux";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
const EventAttendMember = () => {
  const { id } = useParams();
  let decryptedId = null;
  const { toast } = useToast();

  if (id) {
    try {
      const rawId = decodeURIComponent(id);
      decryptedId = decryptId(rawId);
    } catch (err) {
      console.error("Failed to decrypt ID:", err.message);
    }
  }
  const {
    data: eventtrackdata,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: `${EVENT}s/${decryptedId}${MEMBER_LIST}`,
    queryKey: ["eventtrackdata"],
  });
  const { trigger: submitTrigger } = useApiMutation();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelected] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const userType = useSelector((state) => state.auth?.user_type);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
  const handleDeleteRow = (eventid) => {
    setDeleteItemId(eventid);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = async () => {
    try {
      const response = await submitTrigger({
        url: `${EVENT_MEMEBER_TRACK}/${deleteItemId}`,
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
      accessorKey: "event_name",
      id: "Event Name",
      header: "Event Name",
      cell: ({ row }) => <div>{row.getValue("Event Name")}</div>,
    },
    {
      accessorKey: "event_member_mid",
      id: "MID",
      header: "MID",
      cell: ({ row }) => <div>{row.getValue("MID")}</div>,
    },
    {
      accessorKey: "name",
      id: "Name",
      header: "Name",
      cell: ({ row }) => <div>{row.getValue("Name")}</div>,
    },

    {
      accessorKey: "event_entry_date",
      id: "Entry Date",
      header: "Entry Date",
      cell: ({ row }) => {
        const date = row.getValue("Entry Date");
        return <div>{moment(date).format("DD MMM YYYY")}</div>;
      },
    },

    {
      accessorKey: "event_no_of_people",
      id: "No of People",
      header: "No of People",
      cell: ({ row }) => <div>{row.getValue("No of People")}</div>,
    },

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
                  <p>Edit Event Track</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            {(userType == "3" || userType == "4") && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => {
                        handleDeleteRow(id);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Attend Member</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: eventtrackdata?.data || [],
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
        message="Error Fetching Event Track Data"
        refetch={refetch}
      />
    );
  }

  return (
    <Page>
      <div className="w-full">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Event Attend Member
        </div>
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Event Attend Member..."
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
            Total Event Track : &nbsp;
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
        <EventMemberTrackForm
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
          description="Event Attend Member"
          handleDelete={confirmDelete}
        />
      )}
    </Page>
  );
};

export default EventAttendMember;
