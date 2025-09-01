import { EVENT_UPDATE_STATUS } from "@/api";
import usetoken from "@/api/usetoken";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
import axios from "axios";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

const StatusToggle = ({ initialStatus, teamId, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const token = usetoken();
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();

  const handleToggle = async () => {
    setIsLoading(true);
    const newStatus = status === "Active" ? "Inactive" : "Active";

    try {
      const payload = { status: newStatus };
      const response = await submitTrigger({
        url: EVENT_UPDATE_STATUS,
        method: "put",
        data: payload,
      });
      if (response.code == "200") {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }

        toast({
          title: "Status Updated",
          description: response.message || " Updated Sucessfully",
          variant: "success",
        });
      } else {
        toast({
          title: "Error",
          description:
            response.message || "Failed to update status. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded 
        ${
          status === "Active"
            ? "text-green-800 hover:bg-green-100"
            : "text-gray-800 hover:bg-gray-100"
        } transition-colors`}
    >
      <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>{status}</span>
    </button>
  );
};

export default StatusToggle;
