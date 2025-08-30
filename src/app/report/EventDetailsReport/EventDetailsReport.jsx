"use client";

import { ArrowDownToLine, FileSpreadsheet, Printer } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useApiMutation } from "../../../hooks/useApiMutation";

import { EVENT, EVENT_DETAIILS_REPORT } from "@/api";
import Page from "@/app/page/page";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import { ReportPageHeader } from "@/components/common/ReportPageHeader";
import { downloadPDF } from "@/components/downloadPDF";
import { exportEventDetailsReportToExcel } from "@/components/excel/exportEventDetailsReportToExcel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import EventCard from "./EventCard";

const EventDetailsReport = () => {
  const [eventdetailsData, setEventDetailsData] = useState([]);
  const [eventdetails, setEventDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // single state for all filters
  const [filters, setFilters] = useState({
    eventId: "",
  });

  const eventRef = useRef(null);
  const { trigger: submitTrigger } = useApiMutation();

  const { data: eventData } = useGetApiMutation({
    url: EVENT,
    queryKey: ["eventlistdata"],
  });

  const eventOptions =
    eventData?.data
      ?.filter((item) => item.event_status === "Active")
      .map((item) => ({
        label: item.event_name,
        value: item.id,
      })) || [];

  const handleInputChange = (value, field) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      event_id: filters.eventId,
    };
    try {
      const res = await submitTrigger({
        url: EVENT_DETAIILS_REPORT,
        method: "post",
        data: payload,
      });

      if (res.code === 201) {
        setEventDetails(res.data);
        setEventDetailsData(res.eventData);
      }
    } catch (err) {
      console.error("Failed to fetch event report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => eventRef.current,
    documentTitle: "Event Report",
    pageStyle: `
      @page { size: auto; margin: 1mm; }
      @media print {
        body { margin: 0; padding: 2mm; }
        .print-hide { display: none; }
      }
    `,
  });

  return (
    <Page>
      <Card className="shadow-md rounded-lg p-4">
        <ReportPageHeader
          title="Event Details Report"
          subtitle="View Event Details Report"
          filters={[
            {
              label: "Event",
              element: (
                <MemoizedSelect
                  value={filters.eventId}
                  onChange={(e) => handleInputChange(e, "eventId")}
                  options={eventOptions}
                  placeholder="Select Event"
                />
              ),
            },
          ]}
          actionButtons={[
            {
              title: "Submit",
              element: (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center`}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              ),
            },
            {
              title: "Print Report",
              element: (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center`}
                  onClick={handlePrint}
                >
                  <Printer className="h-3 w-3" />
                </Button>
              ),
            },
            {
              title: "PDF Report",
              element: (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center`}
                  onClick={() =>
                    downloadPDF("printable-section", "Event_Report.pdf")
                  }
                >
                  <ArrowDownToLine className="h-3 w-3" />
                </Button>
              ),
            },
            {
              title: "Excel Report",
              element: (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center`}
                  onClick={() =>
                    exportEventDetailsReportToExcel(
                      eventdetails,
                      eventdetailsData,
                      "Event_Details_Report"
                    )
                  }
                >
                  <FileSpreadsheet className="h-3 w-3" />
                </Button>
              ),
            },
          ]}
        />

        <CardContent>
          <div id="printable-section" ref={eventRef}>
            {loading ? (
              <div className="flex justify-center py-20">Loading...</div>
            ) : eventdetailsData.length > 0 ? (
              <div className="overflow-auto">
                <EventCard eventdetails={eventdetails} />
                <table className="w-full table-fixed border-collapse border border-gray-300 text-sm mt-4">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-3 py-2 text-center ">MID</th>
                      <th className="px-3 py-2 text-center ">Payment Type</th>
                      <th className="px-3 py-2 text-center ">Transaction</th>
                      <th className="px-3 py-2 text-center ">No of People</th>
                      <th className="px-3 py-2 text-center ">Name</th>
                      <th className="px-3 py-2 text-center">Mobile</th>
                      <th className="px-3 py-2 text-center  ">Member Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventdetailsData.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t"
                        style={{
                          pageBreakInside: "avoid",
                        }}
                      >
                        {" "}
                        <td className="px-3 py-2 text-center">
                          {item.event_register_mid}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.event_register_payment_type}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.event_register_transaction}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {item.event_no_of_people}
                        </td>{" "}
                        <td className="px-3 py-2 text-center">{item.name}</td>
                        <td className="px-3 py-2 text-center ">
                          {item.mobile}
                        </td>
                        <td className="px-3 py-2 text-center ">
                          {item.user_member_type}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                No data found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Page>
  );
};

export default EventDetailsReport;
