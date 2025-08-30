import { EVENT } from "@/api";
import Page from "@/app/page/page";
import { AvatarCell } from "@/components/common/AvatarCell";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import EventStatusToggle from "@/components/toggle/EventStatusToggle";
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
import { useToast } from "@/hooks/use-toast";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { encryptId } from "@/utils/encyrption/Encyrption";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  BadgeXIcon,
  ChevronDown,
  Edit,
  Search,
  SquarePlus,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventMemberTrackForm from "../EventMemberTrack/EventMemberTrackForm";
import EventTrackQRScanner from "../EventMemberTrack/EventTrackQRScanner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const EventList = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelected] = useState(null);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [NoofMember, setNoofMember] = useState(null);
  const [eventId, setEventId] = useState(null);

  const [imageUrls, setImageUrls] = useState({
    userImageBase: "",
    noImage: "",
  });
  const {
    data: eventdata,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: EVENT,
    queryKey: ["eventdata"],
  });
  useEffect(() => {
    if (!eventdata) return;
    const userImageObj = eventdata?.image_url?.find(
      (img) => img.image_for == "Event"
    );
    const noImageObj = eventdata?.image_url?.find(
      (img) => img.image_for == "No Image"
    );

    setImageUrls({
      userImageBase: userImageObj?.image_url || "",
      noImage: noImageObj?.image_url || "",
    });
  }, [eventdata]);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();
  const handleScannerClose = () => {
    setOpenQrDialog(false);
    setScanning(false);
  };
  const handleScanner = (user) => {
    setEventId(user.id);
    setNoofMember(user.event_no_member_allowed);
    setOpenQrDialog(true);
    setScanning(true);
  };
  const columns = [
    {
      accessorKey: "event_image",
      id: "Event Image",
      header: "Event Image",
      cell: ({ row }) => {
        const user = row.original;
        const eventImageSrc = user.event_image
          ? `${imageUrls.userImageBase}${user.event_image}`
          : imageUrls.noImage;
        return (
          <div className="flex justify-center gap-2">
            <AvatarCell imageSrc={eventImageSrc} alt="Avatar Image" />
          </div>
        );
      },
    },

    {
      accessorKey: "event_name",
      id: "Event Name",
      header: "Event Name",
      cell: ({ row }) => <div>{row.getValue("Event Name")}</div>,
    },
    {
      accessorKey: "event_from_date",
      id: "From Date",
      header: "From Date",
      cell: ({ row }) => {
        const date = row.getValue("From Date");
        return <div>{moment(date).format("DD MMM YYYY")}</div>;
      },
    },
    {
      accessorKey: "event_to_date",
      id: "To Date",
      header: "To Date",
      cell: ({ row }) => {
        const date = row.getValue("To Date");
        return <div>{moment(date).format("DD MMM YYYY")}</div>;
      },
    },
    {
      accessorKey: "event_payment",
      id: "Payment",
      header: "Payment",
      cell: ({ row }) => <div>{row.getValue("Payment")}</div>,
    },
    {
      accessorKey: "event_amount",
      id: "Amount",
      header: "Amount",
      cell: ({ row }) => <div>{row.getValue("Amount")}</div>,
    },
    {
      accessorKey: "event_status",
      id: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("Status");
        const teamId = row.original.id;
        return (
          <EventStatusToggle
            initialStatus={status}
            teamId={teamId}
            onStatusChange={() => {
              refetch();
            }}
          />
        );
      },
    },

    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const id = row.original.id;
        const user = row.original;

        return (
          <div className="flex flex-row">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigate(
                        `/event-form/${encodeURIComponent(encryptId(id))}`
                      );
                    }}
                  >
                    <Edit />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelected(null);
                      setOpen(true);
                    }}
                  >
                    <SquarePlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleScanner(user)}
                  >
                    <BadgeXIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Event</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: eventdata?.data || [],
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
      <ErrorComponent message="Error Fetching Event Data" refetch={refetch} />
    );
  }

  return (
    <Page>
      <div className="w-full">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Event List
        </div>
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Event..."
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
              navigate("/event-form");
            }}
          >
            <SquarePlus className="h-4 w-4 " /> Event
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
            Total Event : &nbsp;
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

      <Dialog open={openQrDialog} onOpenChange={handleScannerClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Scan</DialogTitle>
          </DialogHeader>
          <EventTrackQRScanner
            eventId={eventId}
            setOpenQrDialog={setOpenQrDialog}
            setScanning={setScanning}
            scanning={scanning}
            NoofMember={NoofMember}
          />
        </DialogContent>
      </Dialog>
    </Page>
  );
};

export default EventList;
