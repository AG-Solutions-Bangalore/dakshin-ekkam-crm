import { EVENT, MEMBER_LIST } from "@/api";
import Page from "@/app/page/page";
import { AvatarCell } from "@/components/common/AvatarCell";
import CropImageModal from "@/components/common/CropImageModal";
import FileInput from "@/components/common/FileInput";
import { MemoizedSelect } from "@/components/common/MemoizedSelect";
import PageHeaders from "@/components/common/PageHeaders";
import { LoaderComponent } from "@/components/LoaderComponent/LoaderComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ButtonConfig } from "@/config/ButtonConfig";
import { useToast } from "@/hooks/use-toast";
import { useFetchBranch, useFetchPayment } from "@/hooks/useApi";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { decryptId } from "@/utils/encyrption/Encyrption";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const useFetchEvent = (id) => {
  return useGetApiMutation({
    url: `${EVENT}/${id}`,
    queryKey: ["eventbyid"],
    options: {
      enabled: !!id,
    },
  });
};

const EventForm = () => {
  const { id } = useParams();
  let decryptedId = null;
  const isEdit = Boolean(id);

  if (isEdit) {
    try {
      const rawId = decodeURIComponent(id);
      decryptedId = decryptId(rawId);
    } catch (err) {
      console.error("Failed to decrypt ID:", err.message);
    }
  }

  const isEditMode = Boolean(id);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    // event_image: "",
    event_member_allowed: "All",
    event_no_member_allowed: "1",
    event_from_date: "",
    event_to_date: "",
    event_payment: "",
    event_amount: "",
    branch_id: "2",
  });
  const [eventImageInfo, setEventImageInfo] = useState({
    file: null,
    preview: "",
  });
  const [cropState, setCropState] = useState({
    modalVisible: false,
    imageSrc: null,
    tempFileName: "",
    target: "",
  });

  const { trigger: submitTrigger, loading: submitLoading } = useApiMutation();
  const { data: materialByid, loading: isFetching } =
    useFetchEvent(decryptedId);
  useEffect(() => {
    if (decryptedId && materialByid?.data) {
      const raw = materialByid.data;
      const userImageBase = materialByid.image_url?.find(
        (img) => img.image_for == "Event"
      )?.image_url;

      if (raw.event_image && userImageBase) {
        setEventImageInfo({
          file: null,
          preview: `${userImageBase}${raw.event_image}`,
        });
      }
      setFormData({
        event_name: raw?.event_name || "",
        event_description: raw?.event_description || "",
        event_member_allowed: raw?.event_member_allowed || "",
        event_no_member_allowed: raw?.event_no_member_allowed || "",
        event_from_date: raw?.event_from_date || "",
        event_to_date: raw?.event_to_date || "",
        event_payment: raw?.event_payment || "",
        event_amount: raw?.event_amount || "",
        branch_id: raw?.branch_id || "",
      });
    }
  }, [decryptedId, materialByid]);

  const { data: branchdata, isLoading: loadingbranchdata } = useFetchBranch();
  const { data: paymentdata, isLoading: loadingpayment } = useFetchPayment();

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    console.log(value);
    let updatedFormData = { ...formData, [field]: value };

    setFormData(updatedFormData);
  };
  useEffect(() => {
    const calculateProgress = () => {
      let formCopy = { ...formData };
      formCopy.event_image = eventImageInfo.file || "";

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

      const totalFields = totalFormFields;
      const filledFields = filledFormFields;

      const percentage =
        totalFields === 0 ? 0 : Math.round((filledFields / totalFields) * 100);

      setProgress(percentage);
    };

    calculateProgress();
  }, [formData, eventImageInfo, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const missingFields = [];
    if (!formData.event_name) missingFields.push("Event Name");
    if (!eventImageInfo.file) missingFields.push("Image");
    if (!formData.event_from_date) missingFields.push("From Date");
    if (!formData.event_to_date) missingFields.push("To Date");
    if (!formData.event_payment) missingFields.push("Payment");
    if (!formData.event_amount) missingFields.push("Payment Amount");
    if (!formData.branch_id) missingFields.push("Branch");
    if (!formData.event_member_allowed) missingFields.push("Member Allowed");
    if (!formData.event_no_member_allowed)
      missingFields.push("No of Member Allowed");

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
    const finallData = new FormData();
    finallData.append("event_name", formData.event_name || "");
    finallData.append("event_description", formData.event_description || "");
    finallData.append(
      "event_member_allowed",
      formData.event_member_allowed || ""
    );
    finallData.append(
      "event_no_member_allowed",
      formData.event_no_member_allowed || ""
    );
    finallData.append("branch_id", formData.branch_id || "");
    finallData.append(
      "event_from_date",
      formData.event_from_date
        ? moment(formData.event_from_date).format("YYYY-MM-DD")
        : ""
    );

    finallData.append(
      "event_to_date",
      formData.event_to_date
        ? moment(formData.event_to_date).format("YYYY-MM-DD")
        : ""
    );
    finallData.append("event_payment", formData.event_payment || "");
    finallData.append("event_amount", formData.event_amount || "");
    if (eventImageInfo.file) {
      finallData.append("event_image", eventImageInfo.file);
    }
    if (isEditMode) {
      finallData.append(
        "event_status",
        values.event_status ? "Active" : "Inactive" || ""
      );
    }
    try {
      const response = await submitTrigger({
        url: isEditMode ? `${EVENT}/${decryptedId}?_method=PUT` : EVENT,
        method: "post",
        data: finallData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response?.code == 201) {
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/event");
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to save raw material",
        variant: "destructive",
      });
    }
  };

  if (isFetching || loadingbranchdata || loadingpayment) {
    return <LoaderComponent />;
  }

  const openCropper = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      setCropState({
        modalVisible: true,
        imageSrc: reader.result,
        tempFileName: file.name,
        target: "event_image",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = ({ blob, fileUrl }) => {
    const file = new File([blob], cropState.tempFileName || "image.jpg", {
      type: blob.type,
    });

    setEventImageInfo({ file, preview: fileUrl });

    setCropState({
      modalVisible: false,
      imageSrc: null,
      tempFileName: "",
      target: "",
    });
  };
  return (
    <Page>
      <div className="p-0">
        <div className="">
          <form onSubmit={handleSubmit} className="w-full ">
            <PageHeaders
              title={isEditMode ? "Update Event" : "Create Event"}
              subtitle="event"
              progress={progress}
              mode={isEditMode ? "edit" : "create"}
            />
            <Card className={`mb-6 ${ButtonConfig.cardColor}`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-2">
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Event Name<span className="text-red-500">*</span>
                    </label>
                    <Input
                      className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                      value={formData.event_name}
                      onChange={(e) => handleInputChange(e, "event_name")}
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      From date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                      value={formData.event_from_date}
                      onChange={(e) => handleInputChange(e, "event_from_date")}
                    />
                  </div>
                  <div>
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      To Date<span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                      value={formData.event_to_date}
                      onChange={(e) => handleInputChange(e, "event_to_date")}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`text-sm font-medium ${ButtonConfig.cardLabel}`}
                      >
                        Payment <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <MemoizedSelect
                      value={formData.event_payment}
                      onChange={(e) => handleInputChange(e, "event_payment")}
                      options={
                        paymentdata?.data?.map((payment) => ({
                          value: payment.payment_mode,
                          label: payment.payment_mode,
                        })) || []
                      }
                      placeholder="Select Payment"
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
                      value={formData.event_amount}
                      onChange={(e) => handleInputChange(e, "event_amount")}
                    />
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`text-sm font-medium ${ButtonConfig.cardLabel}`}
                      >
                        Branch <span className="text-red-500">*</span>
                      </label>
                    </div>

                    <MemoizedSelect
                      value={formData.branch_id}
                      onChange={(e) => handleInputChange(e, "branch_id")}
                      options={
                        branchdata?.data?.map((blood) => ({
                          value: blood.blood_group,
                          label: blood.blood_group,
                        })) || []
                      }
                      placeholder="Select Branch"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="mt-3">
                      <AvatarCell imageSrc={eventImageInfo.preview} />
                    </div>

                    <FileInput
                      openCropper={openCropper}
                      buttonText="Upload Image"
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      className={`block  ${ButtonConfig.cardLabel} text-sm mb-2 font-medium `}
                    >
                      Description
                    </label>
                    <Textarea
                      className="bg-white border border-gray-300 rounded-lg w-full focus:ring-2 "
                      value={formData.event_description}
                      onChange={(e) =>
                        handleInputChange(e, "event_description")
                      }
                      maxLength={800}
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

              <Button
                type="button"
                onClick={() => {
                  navigate("/event");
                }}
                className={`${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor} flex items-center mt-2`}
              >
                Go Back
              </Button>
            </div>
          </form>
        </div>
      </div>
      <CropImageModal
        open={cropState.modalVisible}
        imageSrc={cropState.imageSrc}
        onCancel={() =>
          setCropState((prev) => ({ ...prev, modalVisible: false }))
        }
        onCropComplete={handleCroppedImage}
        maxCropSize={{ width: 400, height: 400 }}
        title="Crop Event Image"
        cropstucture={true}
      />
    </Page>
  );
};

export default EventForm;
