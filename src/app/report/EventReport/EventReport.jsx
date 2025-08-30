"use client";

import { ArrowDownToLine, FileSpreadsheet, Printer } from "lucide-react";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useApiMutation } from "../../../hooks/useApiMutation";

import Page from "@/app/page/page";
import { ReportPageHeader } from "@/components/common/ReportPageHeader";
import { downloadPDF } from "@/components/downloadPDF";
import { exportEventReportToExcel } from "@/components/excel/exportEventReportToExcel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import moment from "moment";
import { EVENT_REPORT } from "@/api";

const EventReport = () => {
  const [event, setEvent] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);
  const [fromDate, setFromDate] = useState(moment().startOf("month"));
  const [toDate, setToDate] = useState(moment());
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const eventRef = useRef(null);
  const { trigger: submitTrigger } = useApiMutation();

  const handleSubmit = async () => {
    setLoading(true);
    const payload = {
      from_date: fromDate.format("YYYY-MM-DD"),
      to_date: toDate.format("YYYY-MM-DD"),
    };
    try {
      const res = await submitTrigger({
        url: EVENT_REPORT,
        method: "post",
        data: payload,
      });

      if (res.code === 201) {
        setEvent(res.data);
        setFilteredEvent(res.data);
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
          title="Event Report"
          subtitle="View Event Report"
          filters={[
            {
              label: "From Date",
              element: (
                <Input
                  type="date"
                  value={fromDate.format("YYYY-MM-DD")}
                  onChange={(e) => setFromDate(moment(e.target.value))}
                  className="h-8"
                />
              ),
            },
            {
              label: "To Date",
              element: (
                <Input
                  type="date"
                  value={toDate.format("YYYY-MM-DD")}
                  onChange={(e) => setToDate(moment(e.target.value))}
                  className="h-8"
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
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center `}
                  onClick={handleSubmit}
                >
                  Submit{" "}
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
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center `}
                  onClick={handlePrint}
                >
                  <Printer className="h-3 w-3 " />
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
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center `}
                  onClick={() =>
                    downloadPDF("printable-section", "Event_Report.pdf")
                  }
                >
                  <ArrowDownToLine className="h-3 w-3 " />
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
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center `}
                  onClick={() =>
                    exportEventReportToExcel(filteredEvent, "Event_Report")
                  }
                >
                  <FileSpreadsheet className="h-3 w-3 " />
                </Button>
              ),
            },
          ]}
        />

        <CardContent>
          <div id="printable-section" ref={eventRef}>
            {loading ? (
              <div className="flex justify-center py-20">Loading...</div>
            ) : filteredEvent.length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full table-fixed border-collapse border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 py-1 border">Name</th>
                      <th className="px-2 py-1 border">Allowed</th>
                      <th className="px-2 py-1 border">No of Member</th>
                      <th className="px-2 py-1 border">From Date</th>
                      <th className="px-2 py-1 border">To Date</th>
                      <th className="px-2 py-1 border">Payment</th>
                      <th className="px-2 py-1 border">Amount</th>
                      <th className="px-2 py-1 border">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvent.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t"
                        style={{
                          backgroundColor:
                            item.event_status === "Active"
                              ? "#90EE90"
                              : "transparent",
                        }}
                      >
                        <td className="px-2 py-1 border text-center">
                          {item.event_name}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_member_allowed}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_no_member_allowed}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_from_date
                            ? moment(item.event_from_date).format("DD-MMM-YYYY")
                            : ""}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_to_date
                            ? moment(item.event_to_date).format("DD-MMM-YYYY")
                            : ""}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_payment}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.event_amount}
                        </td>
                        <td className="px-2 py-1 border text-center">
                          {item.total_people}
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

export default EventReport;
