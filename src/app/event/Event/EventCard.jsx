import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Edit, SquarePlus, ScanLine, User } from "lucide-react";
import moment from "moment";
import EventStatusToggle from "@/components/toggle/EventStatusToggle";

const EventListCard = ({
  event,
  onEdit,
  onTrack,
  onScan,
  onAttend,
  imageUrls,
  refetch,
}) => {
  const eventImageSrc = event.event_image
    ? `${imageUrls.userImageBase}${event.event_image}`
    : imageUrls.noImage;

  return (
    <Card className="w-full md:w-[300px] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      {/* Header */}
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={eventImageSrc}
            alt={event.event_name}
            className="w-full h-[180px] object-cover"
          />
          <div className="mt-2 absolute top-0 right-2 bg-white rounded-sm">
            <EventStatusToggle
              initialStatus={event.event_status}
              teamId={event.id}
              onStatusChange={() => refetch()}
            />
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <h2 className="text-lg font-semibold">{event.event_name || ""}</h2>

        <div className="text-sm text-gray-600 flex justify-between">
          <p>
            <span className="font-medium">From:</span>{" "}
            {moment(event.event_from_date).format("DD MMM YYYY")}
          </p>
          <p>
            <span className="font-medium">To:</span>{" "}
            {moment(event.event_to_date).format("DD MMM YYYY")}
          </p>
        </div>

        <div className="flex justify-between text-sm">
          <p className="font-medium">Payment: {event.event_payment || ""}</p>
          {event.event_amount && (
            <p className="font-medium">₹{event.event_amount || ""}</p>
          )}
        </div>

        <div className="flex justify-between pt-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(event.id)}
                >
                  <Edit />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit Event</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTrack(event)}
                >
                  <SquarePlus />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Create Track</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onScan(event)}
                >
                  <ScanLine />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Scan Event</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onAttend(event.id)}
                >
                  <User />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Event Member Attend</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
export default EventListCard;
