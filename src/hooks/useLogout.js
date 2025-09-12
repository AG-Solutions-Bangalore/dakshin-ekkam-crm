import { logout } from "@/redux/slices/AuthSlice";
import { persistor } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "./use-toast";

const useLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const loginType = useSelector((state) => state.auth.login_type);
  const handleLogout = async () => {
    try {
      await persistor.flush();
      localStorage.clear();
      dispatch(logout());

      if (loginType == "website") {
        window.location.href = "https://dhakshin.netlify.app/member";
      } else {
        navigate("/");
      }
      setTimeout(() => persistor.purge(), 1000);
    } catch (error) {
      toast({
        title: "Logout Error",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return handleLogout;
};

export default useLogout;
