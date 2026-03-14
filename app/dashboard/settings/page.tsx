"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import apiClient from "@/services/api-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, DollarSign, Percent, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SettingsData {
  serviceFee: number;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [fee, setFee] = useState<number>(10);

  const { data, isLoading } = useQuery<ApiResponse<SettingsData>>({
    queryKey: ["admin-settings"],
    queryFn: () => apiClient.get("/admin/settings").then((r) => r.data),
  });

  useEffect(() => {
    if (data?.data?.serviceFee !== undefined) {
      setFee(data.data.serviceFee);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (serviceFee: number) =>
      apiClient.put("/admin/settings", { serviceFee }),
    onSuccess: () => {
      toast.success("Service fee updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: () => {
      toast.error("Failed to update service fee");
    },
  });

  const handleSave = () => {
    if (fee < 0 || fee > 50) {
      toast.error("Service fee must be between 0% and 50%");
      return;
    }
    mutation.mutate(fee);
  };

  const currentFee = data?.data?.serviceFee ?? 10;
  const sellerRate = 100 - currentFee;
  const hasChanges = fee !== currentFee;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Platform Settings
        </h2>
        <p className="text-muted-foreground mt-1">
          Configure platform-wide settings and fees.
        </p>
      </div>

      {/* Current fee overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <Percent className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentFee}%</p>
                <p className="text-xs text-muted-foreground">
                  Platform Service Fee
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sellerRate}%</p>
                <p className="text-xs text-muted-foreground">
                  Seller Receives
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ${((100 * currentFee) / 100).toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Fee per $100 order
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit service fee */}
      <Card>
        <CardHeader>
          <CardTitle>Service Fee Configuration</CardTitle>
          <CardDescription>
            Set the percentage the platform takes from each completed order. The
            remainder goes to the freelancer. This applies to all future orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-20 flex items-center justify-center text-muted-foreground">
              Loading settings...
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceFee">
                    Platform Fee Percentage (0% - 50%)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="serviceFee"
                      type="number"
                      min={0}
                      max={50}
                      step={0.5}
                      value={fee}
                      onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
                      className="max-w-[200px]"
                    />
                    <span className="text-muted-foreground font-medium">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order Amount</span>
                      <span className="font-medium">$100.00</span>
                    </div>
                    <div className="flex justify-between text-sm text-red-600">
                      <span>Platform Fee ({fee}%)</span>
                      <span className="font-medium">
                        -${((100 * fee) / 100).toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-sm text-green-600 font-semibold">
                      <span>Seller Receives ({100 - fee}%)</span>
                      <span>${(100 - fee).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={mutation.isPending || !hasChanges}
              >
                {mutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
