import { PANEL_LOGIN } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { useApiMutation } from "@/hooks/useApiMutation";
import { loginSuccess } from "@/redux/slices/AuthSlice";
import { motion } from "framer-motion";
import { CheckCircle2, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trigger: submitTrigger, loading: isLoading } = useApiMutation();
  const location = useLocation();
  const backurl = import.meta.env.VITE_BACK_URL;
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const passwordParam = params.get("password");

    if (emailParam && passwordParam) {
      setEmail(emailParam);
      setPassword(passwordParam);
      handleLogin(emailParam, passwordParam);
    }
  }, [location.search]);

  const handleLogin = async (loginEmail = email, loginPassword = password) => {
    const formData = new FormData();
    formData.append("username", loginEmail);
    formData.append("password", loginPassword);

    try {
      const res = await submitTrigger({
        url: PANEL_LOGIN,
        method: "post",
        data: formData,
      });

      if (res.code === 200 && res.UserInfo?.token) {
        const { UserInfo } = res;

        dispatch(
          loginSuccess({
            token: UserInfo.token,
            id: UserInfo.user?.id,
            name: UserInfo.user?.name,
            mobile: UserInfo.user?.mobile,
            user_type: UserInfo.user?.user_type,
            email: UserInfo.user?.email,
            token_expire_time: UserInfo.token_expires_at,
            version: res?.version?.version_panel,
            companyname: res?.company_detils?.company_name,
            companystatename: res?.company_detils?.company_state_name,
            company_address: res?.company_detils?.company_address,
            company_email: res?.company_detils?.company_email,
            company_gst: res?.company_detils?.company_gst,
            company_mobile: res?.company_detils?.company_mobile,
            company_state_code: res?.company_detils?.company_state_code,
            company_state_name: res?.company_detils?.company_state_name,
            login_type: "website",
          })
        );

        setIsSuccess(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description:
            res?.data?.message || "Login failed: Unexpected response.",
        });
        window.location.href = backurl;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.response?.data?.message || "Please try again.",
      });
      window.location.href = backurl;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 flex flex-col items-center gap-4 w-[320px] text-center"
      >
        {isLoading && !isSuccess && (
          <>
            <Loader className="h-10 w-10 text-blue-500 animate-spin" />
            <motion.p
              key="logging"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-700 text-lg font-medium"
            >
              Logging you in...
            </motion.p>
            <p className="text-gray-500 text-sm">Please wait a moment</p>
          </>
        )}

        {isSuccess && (
          <>
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-gray-700 text-lg font-medium"
            >
              Login successful!
            </motion.p>
            <p className="text-gray-500 text-sm">Redirecting...</p>
          </>
        )}

        {!isLoading && !isSuccess && (
          <p className="text-gray-600">Preparing login...</p>
        )}
      </motion.div>
    </div>
  );
}
