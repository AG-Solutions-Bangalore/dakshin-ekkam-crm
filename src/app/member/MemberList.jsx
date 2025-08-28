import { MEMBER_LIST } from "@/api";
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
import { encryptId } from "@/utils/encyrption/Encyrption";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Edit, Search, SquarePlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../page/page";
import MemberStatusToggle from "@/components/toggle/MemberStatusToggle";
const MemberList = () => {
  const {
    data: memberdata,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: MEMBER_LIST,
    queryKey: ["memberdata"],
  });
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const navigate = useNavigate();

  const columns = [
    {
      accessorKey: "index",
      id: "Sl No",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },
    {
      id: "Name",
      header: "Name",
      cell: ({ row }) => {
        const { first_name, middle_name, last_name } = row.original;
        return (
          <div>
            {first_name} {middle_name} {last_name}
          </div>
        );
      },
    },

    {
      accessorKey: "mobile",
      id: "Mobile",
      header: "Mobile",
      cell: ({ row }) => <div>{row.getValue("Mobile")}</div>,
    },
    {
      accessorKey: "email",
      id: "Email",

      header: "Email",
      cell: ({ row }) => <div>{row.getValue("Email")}</div>,
    },
    {
      accessorKey: "user_blood_group",
      id: "Blood Group",
      header: "Blood Group",
      cell: ({ row }) => <div>{row.getValue("Blood Group")}</div>,
    },
    {
      accessorKey: "user_married_status",
      id: "Married Status",
      header: "Married Status",
      cell: ({ row }) => <div>{row.getValue("Married Status")}</div>,
    },
    {
      accessorKey: "user_status",
      id: "Status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("Status");
        const teamId = row.original.id;
        return (
          <MemberStatusToggle
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
                        `/member-form/${encodeURIComponent(encryptId(id))}`
                      );
                    }}
                  >
                    <Edit />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Member</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>{" "}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: memberdata?.data || [],
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
      <ErrorComponent message="Error Fetching Member Data" refetch={refetch} />
    );
  }

  return (
    <Page>
      <div className="w-full">
        <div className="flex text-left text-2xl text-gray-800 font-[400]">
          Member List
        </div>
        <div className="flex items-center py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Member..."
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
              navigate("/member-form");
            }}
          >
            <SquarePlus className="h-4 w-4 " /> Member
          </Button>
        </div>
        {/* table  */}
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
            Total Member : &nbsp;
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
    </Page>
  );
};

export default MemberList;
