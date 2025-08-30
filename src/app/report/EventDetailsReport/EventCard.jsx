import moment from "moment";

export default function EventCard({ eventdetails }) {
  const statusColor =
    eventdetails.event_status === "Active" ? "bg-green-100" : "bg-red-200";

  return (
    <div className="max-w-xl mx-auto border rounded-xl shadow-sm overflow-hidden">
      {/* Title */}
      <div className={`px-4 py-3 ${statusColor} border-b`}>
        <h2 className="text-lg font-semibold truncate">
          {eventdetails.event_name}
        </h2>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">Description</span>
          <span className="text-sm">{eventdetails.event_description}</span>
        </div>

        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">Member Allowed</span>
          <span className="text-sm">{eventdetails.event_member_allowed}</span>
        </div>

        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">No. Member Allowed</span>
          <span className="text-sm">{eventdetails.event_no_member_allowed}</span>
        </div>

        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">From Date</span>
          <span className="text-sm">
            {eventdetails.event_from_date
              ? moment(eventdetails.event_from_date).format("DD MMM YYYY")
              : "-"}
          </span>
        </div>

        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">To Date</span>
          <span className="text-sm">
            {eventdetails.event_to_date
              ? moment(eventdetails.event_to_date).format("DD MMM YYYY")
              : "-"}
          </span>
        </div>

        <div className="flex flex-col justify-center border p-2 rounded">
          <span className="font-semibold text-sm">Payment</span>
          <span className="text-sm">{eventdetails.event_payment}</span>
        </div>

        {eventdetails.event_payment === "Yes" && (
          <div className="flex flex-col justify-center border p-2 rounded">
            <span className="font-semibold text-sm">Amount</span>
            <span className="text-sm">{eventdetails.event_amount}</span>
          </div>
        )}
      </div>
    </div>
  );
}
