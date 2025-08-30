"use client";

import { useToast } from "@/hooks/use-toast";
import { Scanner } from "@yudiel/react-qr-scanner";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";

import { EVENT_MEMEBER_TRACK } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useApiMutation } from "@/hooks/useApiMutation";

const EventTrackQRScanner = ({
  eventId,
  setOpenQrDialog,
  scanning,
  NoofMember,
}) => {
  const { toast } = useToast();
  const [scanResult, setScanResult] = useState("");
  const timeoutRef = useRef(null);
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const submitEvent = async (midValue, count) => {
    const payload = {
      event_no_of_people: count,
      event_id: eventId || 1,
      event_member_mid: midValue,
      event_entry_date: dayjs().format("YYYY-MM-DD"),
    };

    try {
      const res = await submitTrigger({
        url: EVENT_MEMEBER_TRACK,
        method: "post",
        data: payload,
      });

      if (res.code === 201) {
        toast({
          title: "Success",
          description: res.message || "Event saved!",
        });
        setOpenQrDialog(false);
      } else {
        toast({
          title: "Error",
          description: res.message || "Failed to save event.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Error submitting event.",
        variant: "destructive",
      });
    }
  };

  const handleScan = async (detectedCodes) => {
    if (detectedCodes && detectedCodes.length > 0) {
      const scannedValue = detectedCodes[0].rawValue;
      setScanResult(scannedValue);

      if (scannedValue.includes("mid=")) {
        const midMatch = scannedValue.match(/mid=([^&\s]+)/);
        const midValue = midMatch ? midMatch[1] : null;

        if (!midValue) {
          toast({
            title: "Error",
            description: "MID not found in scanned data.",
            variant: "destructive",
          });
          return;
        }

        submitEvent(midValue, NoofMember || 1);
      } else {
        toast({
          title: "Error",
          description: "MID not found in scanned data.",
          variant: "destructive",
        });
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setScanResult("");
      }, 3000);
    }
  };

  const handleError = (err) => {
    console.error("Scan error:", err);
    toast({
      title: "Error",
      description: "Error scanning QR code",
      variant: "destructive",
    });
  };

  return (
    <>
      {submitLoading ? (
        <Card className="max-w-md min-h-[260px] m-5 flex items-center justify-center">
          <CardContent>
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      ) : (
        <>
          {scanning && (
            <Scanner
              onScan={handleScan}
              onError={handleError}
              className="scanner"
              styles={{
                container: { width: "100%", maxWidth: "400px", margin: "auto" },
                video: { width: "100%", height: "auto" },
              }}
            />
          )}
        </>
      )}
    </>
  );
};

export default EventTrackQRScanner;
