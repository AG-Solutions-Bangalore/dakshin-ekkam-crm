import { useGetApiMutation } from "./useGetApiMutation";

// ---------------New
export const useFetchBloodGroup = () => {
  return useGetApiMutation({
    url: "/panel-fetch-blood-group",
    queryKey: ["bloodGroup"],
  });
};
export const useFetchPayment = () => {
  return useGetApiMutation({
    url: "/panel-fetch-payment-mode",
    queryKey: ["payment"],
  });
};
export const useFetchOccupation = () => {
  return useGetApiMutation({
    url: "/panel-fetch-occupation",
    queryKey: ["occupation"],
  });
};
export const useFetchBranch = () => {
  return useGetApiMutation({
    url: "/panel-fetch-branch",
    queryKey: ["branch"],
  });
};
