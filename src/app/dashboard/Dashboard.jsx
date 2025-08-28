import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Factory, TrendingUp, Users, ShoppingCart } from "lucide-react";
import Page from "../page/page";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/api/axios";
import usetoken from "@/api/usetoken";
import { DASHBOARD } from "@/api";
import {
  ErrorComponent,
  LoaderComponent,
} from "@/components/LoaderComponent/LoaderComponent";
import moment from "moment";

const Dashboard = () => {
  const token = usetoken();
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await apiClient.get(`${DASHBOARD}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
  });

  if (isLoading) {
    return <LoaderComponent name="Dashboard Data" />;
  }

  if (isError) {
    return (
      <ErrorComponent
        message="Error Fetching Dashboard Data"
        refetch={refetch}
      />
    );
  }

  const getWasteColor = (percentage) => {
    if (percentage > 10) return "text-red-600";
    if (percentage > 7) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Page>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your events
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ActiveEvent
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboard?.totalActiveEvent || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Customers
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboard?.totalCustomer || 0}
                  </p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Monthly Production
                  </p>
                  <p className="text-2xl font-bold">
                    {dashboard?.totalMonthlyProduction || 0}

                    <span className="ml-1 text-[18px]">kg</span>
                  </p>
                </div>
                <Factory className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Sales Quantity
                  </p>
                  <p className="text-2xl font-bold">
                    {(dashboard?.totalMonthlySales || 0).toLocaleString()}

                    <span className="ml-1 text-[18px]"> Kgs/Mts</span>
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
