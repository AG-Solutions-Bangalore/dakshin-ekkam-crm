import { EVENT_MEMEBER_TRACK, EVENT_REGISTER } from "@/api";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import PageHeaders from "@/components/common/PageHeaders";
import { WithoutLoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
const useFetchEvent = (id) => {
  return useGetApiMutation({
    url: `${EVENT_MEMEBER_TRACK}/${id}`,
    queryKey: ["eventmembertrackbyid"],
    options: {
      enabled: !!id,
    },
  });
};

const EventMemberTrackForm = ({
  setOpen,
  open,
  selectedId = null,
  refetch,
}) => {
  const isEditMode = Boolean(selectedId);
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    event_id: "",
    event_member_mid: "",
    event_entry_date: "",
    event_no_of_people: "",
  });

  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const { data: materialByid, loading: isFetching } = useFetchEvent(selectedId);
  useEffect(() => {
    if (selectedId && materialByid?.data) {
      const raw = materialByid.data;
      setFormData({
        event_no_of_people: raw?.event_no_of_people || "",
        event_member_mid: raw?.event_member_mid || "",
      });
    }
  }, [selectedId, materialByid]);

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    let updatedFormData = { ...formData, [field]: value };

    setFormData(updatedFormData);
  };
  useEffect(() => {
    const calculateProgress = () => {
      let formCopy = { ...formData };
      if (!isEditMode) {
        delete formCopy.event_no_of_people;
      }
      if (isEditMode) {
        delete formCopy.event_entry_date;
      }

      const totalFormFields = Object.keys(formCopy).length;
      const filledFormFields = Object.values(formCopy).filter((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().trim() !== "";
      }).length;

      const percentage =
        totalFormFields === 0
          ? 0
          : Math.round((filledFormFields / totalFormFields) * 100);

      setProgress(percentage);
    };

    calculateProgress();
  }, [formData, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];

    if (!formData.event_id && !isEditMode) missingFields.push("Event Id");

    if (!formData.event_member_mid) missingFields.push("MID");

    if (!formData.event_no_of_people && isEditMode)
      missingFields.push("No of People");
    if (!formData.event_entry_date && !isEditMode) missingFields.push("Date");

    if (missingFields.length > 0) {
      toast({
        title: "Validation Error",
        description: (
          <div>
            <p>Please fill in the following fields:</p>
            <ul className="list-disc pl-5">
              {missingFields.map((field, i) => (
                <li key={i}>{field}</li>
              ))}
            </ul>
          </div>
        ),
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await submitTrigger({
        url: isEditMode
          ? `${EVENT_MEMEBER_TRACK}/${selectedId}`
          : EVENT_MEMEBER_TRACK,
        method: isEditMode ? "put" : "post",
        data: formData,
      });
      if (response?.code == 201) {
        toast({
          title: "Success",
          description: response.message,
        });
        setOpen(false);
        refetch();
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to save raw material",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="w-full border-2 max-w-4xl"
        aria-describedby={null}
      >
        {isFetching ? (
          <WithoutLoaderComponent />
        ) : (
          <div className="">
            <form onSubmit={handleSubmit} className="w-full ">
              <PageHeaders
                title={isEditMode ? "Update Event Track" : "Create Event Track"}
                subtitle="event track"
                progress={progress}
                mode={isEditMode ? "edit" : "create"}
              />
              <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
                    {!isEditMode && (
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                        >
                          Event Id<span className="text-red-500">*</span>
                        </label>
                        <Input
                          className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                          value={formData.event_id}
                          onChange={(e) => handleInputChange(e, "event_id")}
                          maxLength={10}
                        />
                      </div>
                    )}
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                      >
                        Event MID
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                        value={formData.event_member_mid}
                        onChange={(e) =>
                          handleInputChange(e, "event_member_mid")
                        }
                        maxLength={10}
                      />
                    </div>
                    {isEditMode && (
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                        >
                          No of People
                          <span className="text-red-500">*</span>
                        </label>
                        <Input
                          className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                          value={formData.event_no_of_people}
                          onChange={(e) =>
                            handleInputChange(e, "event_no_of_people")
                          }
                          maxLength={10}
                        />
                      </div>
                    )}
                    {!isEditMode && (
                      <div>
                        <label
                          className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                        >
                          Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="date"
                          className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                          value={formData.event_entry_date}
                          onChange={(e) =>
                            handleInputChange(e, "event_entry_date")
                          }
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-row items-center gap-2 justify-end ">
                <Button
                  type="submit"
                  className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
                  disabled={submitLoading}
                  loading={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update"
                  ) : (
                    "Submit"
                  )}{" "}
                </Button>
              </div>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventMemberTrackForm;
