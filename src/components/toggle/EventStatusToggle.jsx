import { EVENT } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";

const EventStatusToggle = ({ initialStatus, teamId, onStatusChange }) => {
  const [status, setStatus] = useState(initialStatus);
  const { toast } = useToast();
  const { trigger: submitTrigger, loading: isLoading } = useApiMutation();

  const handleToggle = async () => {
    const newStatus = status == "Active" ? "Inactive" : "Active";

    try {
      const response = await submitTrigger({
        url: `${EVENT}s/${teamId}/status`,
        method: "patch",
        data: { event_status: newStatus },
      });
      if (response?.code == 201) {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }

        toast({
          title: "Success",
          description: response.message,
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center space-x-1 px-2 py-1 rounded 
        ${
          status == "Active"
            ? "text-green-800 hover:bg-green-100"
            : "text-red-800 hover:bg-gray-100"
        } transition-colors`}
    >
      <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      <span>{status}</span>
    </button>
  );
};

export default EventStatusToggle;
