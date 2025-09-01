import { EVENT, EVENT_REGISTER } from "@/api";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import PageHeaders from "@/components/common/PageHeaders";
import { WithoutLoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useFetchPayment } from "@/hooks/useApi";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
const useFetchEvent = (id) => {
  return useGetApiMutation({
    url: `${EVENT_REGISTER}/${id}`,
    queryKey: ["eventbyid"],
    options: {
      enabled: !!id,
    },
  });
};

const EventRegisterForm = ({ setOpen, open, selectedId = null, refetch }) => {
  const isEditMode = Boolean(selectedId);
  const { toast } = useToast();
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    event_id: "",
    event_register_name: "",
    event_register_mobile: "",
    event_register_email: "",
    event_register_mid: "",
    event_register_amount: "",
    event_register_payment_type: "",
    event_register_transaction: "",
  });
  const {
    data: eventdata,
    isLoading,
    isError,
  } = useGetApiMutation({
    url: EVENT,
    queryKey: ["eventlistdata"],
  });
  const eventOptions =
    eventdata?.data
      ?.filter((item) => item.event_status == "Active")
      .map((item) => ({
        label: item.event_name,
        value: item.id,
      })) || [];
  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const { data: materialByid, loading: isFetching } = useFetchEvent(selectedId);
  useEffect(() => {
    if (selectedId && materialByid?.data) {
      const raw = materialByid.data;
      setFormData({
        event_id: raw?.event_id || "",
        event_register_name: raw?.event_register_name || "",
        event_register_mobile: raw?.event_register_mobile || "",
        event_register_email: raw?.event_register_email || "",
        event_register_mid: raw?.event_register_mid || "",
        event_register_amount: raw?.event_register_amount || "",
        event_register_payment_type: raw?.event_register_payment_type || "",
        event_register_transaction: raw?.event_register_transaction || "",
      });
    }
  }, [selectedId, materialByid]);

  const { data: paymentdata, isLoading: loadingpayment } = useFetchPayment();

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    let updatedFormData = { ...formData, [field]: value };

    setFormData(updatedFormData);
  };
  useEffect(() => {
    const calculateProgress = () => {
      let formCopy = { ...formData };

      // Pick which fields to count based on mode
      if (isEditMode) {
        formCopy = {
          event_register_mid: formCopy.event_register_mid,
          event_register_payment_type: formCopy.event_register_payment_type,
          event_register_transaction: formCopy.event_register_transaction,
        };
      }

      const totalFormFields = Object.keys(formCopy).length;

      const filledFormFields = Object.values(formCopy).filter((value) => {
        if (value === null || value === undefined) return false;
        return value.toString().trim() !== "";
      }).length;

      const missingFields = Object.entries(formCopy)
        .filter(
          ([, value]) =>
            value === null ||
            value === undefined ||
            value.toString().trim() === ""
        )
        .map(([key]) => key);

      // console.log(missingFields, "missingFields");

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
    if (!isEditMode) {
      if (!formData.event_id) missingFields.push("Event Id");
      if (!formData.event_register_name) missingFields.push("Register Name");
      if (!formData.event_register_mobile) missingFields.push("Mobile");
      if (!formData.event_register_email) missingFields.push("Email");
      if (!formData.event_register_amount) missingFields.push("Amount");
    }
    if (!formData.event_register_mid) missingFields.push("MID");
    if (!formData.event_register_payment_type)
      missingFields.push("Payment Type");
    if (!formData.event_register_transaction) missingFields.push("Transaction");

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
        url: isEditMode ? `${EVENT_REGISTER}/${selectedId}` : EVENT_REGISTER,
        method: isEditMode ? "put" : "post",
        data: formData,
      });
      if (response?.code == 201) {
        toast({
          title: "Success",
          description: response.message,
        });
        refetch();
        setOpen(false);
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
        {isFetching || loadingpayment || isLoading ? (
          <WithoutLoaderComponent />
        ) : (
          <div className="">
            <form onSubmit={handleSubmit} className="w-full ">
              <PageHeaders
                title={
                  isEditMode ? "Update Event Register" : "Create Event Register"
                }
                subtitle="event register"
                progress={progress}
                mode={isEditMode ? "edit" : "create"}
              />
              <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
                    {!isEditMode && (
                      <>
                        <div>
                          {" "}
                          <label
                            className={`text-sm font-medium ${ButtonConfig.cardLabel}`}
                          >
                            Event <span className="text-red-500">*</span>
                          </label>
                          <MemoizedSelect
                            value={formData.event_id}
                            onChange={(e) => handleInputChange(e, "event_id")}
                            options={eventOptions}
                            placeholder="Select Event"
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                          >
                            Event Register Name
                            <span className="text-red-500">*</span>
                          </label>
                          <Input
                            className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                            value={formData.event_register_name}
                            onChange={(e) =>
                              handleInputChange(e, "event_register_name")
                            }
                            maxLength={50}
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                          >
                            Mobile <span className="text-red-500">*</span>
                          </label>
                          <Input
                            className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                            value={formData.event_register_mobile}
                            onChange={(e) =>
                              handleInputChange(e, "event_register_mobile")
                            }
                            maxLength={10}
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                          >
                            Email<span className="text-red-500">*</span>
                          </label>
                          <Input
                            className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                            value={formData.event_register_email}
                            onChange={(e) =>
                              handleInputChange(e, "event_register_email")
                            }
                            maxLength={30}
                          />
                        </div>
                        <div>
                          <label
                            className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                          >
                            Amount<span className="text-red-500">*</span>
                          </label>
                          <Input
                            className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                            value={formData.event_register_amount}
                            onChange={(e) =>
                              handleInputChange(e, "event_register_amount")
                            }
                            maxLength={10}
                          />
                        </div>
                      </>
                    )}
                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                      >
                        MID<span className="text-red-500">*</span>
                      </label>
                      <Input
                        className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                        value={formData.event_register_mid}
                        onChange={(e) =>
                          handleInputChange(e, "event_register_mid")
                        }
                        maxLength={10}
                      />
                    </div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label
                          className={`text-sm font-medium ${ButtonConfig.cardLabel}`}
                        >
                          Payment Type
                        </label>
                      </div>

                      <MemoizedSelect
                        value={formData.event_register_payment_type}
                        onChange={(e) =>
                          handleInputChange(e, "event_register_payment_type")
                        }
                        options={
                          paymentdata?.data?.map((payment) => ({
                            value: payment.payment_mode,
                            label: payment.payment_mode,
                          })) || []
                        }
                        placeholder="Select Payment Type"
                      />
                    </div>

                    <div>
                      <label
                        className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                      >
                        Transaction
                      </label>
                      <Input
                        className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                        value={formData.event_register_transaction}
                        onChange={(e) =>
                          handleInputChange(e, "event_register_transaction")
                        }
                        maxLength={80}
                      />
                    </div>
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

export default EventRegisterForm;
