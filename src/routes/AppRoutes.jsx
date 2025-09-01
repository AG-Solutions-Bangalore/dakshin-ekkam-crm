import Login from "@/app/auth/Login";
import Dashboard from "@/app/dashboard/Dashboard";
import NotFound from "@/app/errors/NotFound";
import EventForm from "@/app/event/Event/EventForm";
import EventList from "@/app/event/Event/EventList";
import EventMemberTractList from "@/app/event/EventMemberTrack/EventMemberTractList";
import EventRegisterList from "@/app/event/EventRegister/EventRegisterList";
import MemberForm from "@/app/member/MemberForm";
import MemberList from "@/app/member/MemberList";
import Maintenance from "@/components/common/Maintenance";
import { Route, Routes } from "react-router-dom";
import AuthRoute from "./AuthRoute";
import ProtectedRoute from "./ProtectedRoute";
import EventReport from "@/app/report/EventReport/EventReport";
import EventDetailsReport from "@/app/report/EventDetailsReport/EventDetailsReport";
import RegisteredNotScanned from "@/app/report/RegisteredNotScanned/RegisteredNotScanned";
import EventAttendMember from "@/app/event/Event/EventAttendMember";
import NotRegisterNotScanned from "@/app/report/NotregisteredNotScanned/NotRegisterNotScanned";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />}>
        <Route path="/" element={<Login />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Route>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/member" element={<MemberList />} />
        <Route path="/member-form" element={<MemberForm />} />
        <Route path="/member-form/:id" element={<MemberForm />} />
        <Route path="/event" element={<EventList />} />
        <Route
          path="/event-member-attend/:id"
          element={<EventAttendMember />}
        />
        <Route path="/event-form" element={<EventForm />} />
        <Route path="/event-form/:id" element={<EventForm />} />
        <Route path="/event-register" element={<EventRegisterList />} />
        <Route path="/event-track" element={<EventMemberTractList />} />
        <Route path="/report-event" element={<EventReport />} />
        <Route path="/report-event-details" element={<EventDetailsReport />} />
        <Route
          path="/report-register-notscanned"
          element={<RegisteredNotScanned />}
        />
        <Route
          path="/report-notregister-notscanned"
          element={<NotRegisterNotScanned />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
