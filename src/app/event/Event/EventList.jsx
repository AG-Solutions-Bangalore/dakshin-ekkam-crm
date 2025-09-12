import { EVENT } from "@/api";
import Page from "@/app/page/page";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { encryptId } from "@/utils/encyrption/Encyrption";
import { Search, SquarePlus } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventMemberTrackForm from "../EventMemberTrack/EventMemberTrackForm";
import EventTrackQRScanner from "../EventMemberTrack/EventTrackQRScanner";
import EventListCard from "./EventCard";


const EventList = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelected] = useState(null);
  const [openQrDialog, setOpenQrDialog] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [NoofMember, setNoofMember] = useState(null);
  const [eventId, setEventId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

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

  const filteredData = useMemo(() => {
    if (!eventdata?.data) return [];
    return eventdata.data.filter((event) =>
      event.event_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [eventdata, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, page]);

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

        <div className="flex items-center justify-between w-full py-4">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Event..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
            />
          </div>

          <div>
            <Button
              variant="default"
              className={`ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
              onClick={() => {
                navigate("/event-form");
              }}
            >
              <SquarePlus className="h-4 w-4 mr-1" /> Events
            </Button>
          </div>
        </div>

        {/* 🔹 Events Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedData.map((event) => (
            <EventListCard
              key={event.id}
              event={event}
              onEdit={(id) =>
                navigate(`/event-form/${encodeURIComponent(encryptId(id))}`)
              }
              onTrack={() => {
                setSelected(null);
                setOpen(true);
              }}
              refetch={refetch}
              onScan={handleScanner}
              onAttend={(id) =>
                navigate(
                  `/event-member-attend/${encodeURIComponent(encryptId(id))}`
                )
              }
              imageUrls={imageUrls}
            />
          ))}
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            Total Events : {filteredData.length}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((prev) => prev + 1)}
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
