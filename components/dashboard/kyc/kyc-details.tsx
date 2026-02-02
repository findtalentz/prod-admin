"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn, formatDate } from "@/lib/utils";
import apiClient from "@/services/api-client";
import { KYC } from "@/types/KYC";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { BeatLoader } from "react-spinners";

interface Props {
  kyc: KYC;
}

export default function KYCDetails({ kyc }: Props) {
  const [open, setOpen] = useState(false);
  const [isApproving, setApproving] = useState(false);
  const [isRejecting, setRejecting] = useState(false);
  const router = useRouter();

  const getStatusVariant = () => {
    switch (kyc.status) {
      case "verified":
        return "secondary";
      case "pending":
        return "destructive";
      case "rejected":
        return "destructive";
      default:
        return "default";
    }
  };

  const getVerificationTypeLabel = () => {
    switch (kyc.verificationType) {
      case "id":
        return "ID Card";
      case "passport":
        return "Passport";
      default:
        return kyc.verificationType;
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-2xl px-4">
        <ScrollArea className="h-full pr-4">
          <SheetHeader className="mb-6">
            <SheetTitle className="flex items-center gap-3">
              KYC Verification
              <Badge
                variant={getStatusVariant()}
                className={cn(
                  kyc.status === "pending" &&
                    "border-amber-400 bg-transparent text-amber-400"
                )}
              >
                {kyc.status.toUpperCase()}
              </Badge>
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6">
            <section>
              <h3 className="font-medium text-lg mb-2">User Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">
                    {kyc.user.firstName} {kyc.user.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{kyc.user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Verification Type
                  </p>
                  <p className="font-medium">{getVerificationTypeLabel()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted On</p>
                  <p className="font-medium">{formatDate(kyc.createdAt)}</p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Document Details Section */}
            <section>
              <h3 className="font-medium text-lg mb-2">Document Details</h3>
              <div className="space-y-4">
                {kyc.verificationType === "id" && (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Front Side
                      </p>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                        <Image
                          src={kyc.frontImage}
                          alt="ID Front Side"
                          fill
                          className="object-contain"
                          quality={100}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Back Side
                      </p>
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                        <Image
                          src={kyc.backImage}
                          alt="ID Back Side"
                          fill
                          className="object-contain"
                          quality={100}
                        />
                      </div>
                    </div>
                  </>
                )}

                {kyc.verificationType === "passport" && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Passport
                    </p>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border">
                      <Image
                        src={kyc.passportImage}
                        alt="Passport"
                        fill
                        className="object-contain"
                        quality={100}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <Separator />

            <section className="pb-6">
              <h3 className="font-medium text-lg mb-2">Verification Actions</h3>
              <div className="flex gap-3">
                <Button
                  disabled={kyc.status === "rejected" || isRejecting}
                  onClick={async () => {
                    setRejecting(true);
                    try {
                      await apiClient.post(
                        "/verifications/reject",
                        {},
                        {
                          params: {
                            id: kyc._id,
                          },
                        }
                      );
                      router.refresh();
                      toast.success("Completed");
                      setRejecting(false);
                      setOpen(false);
                    } catch (error) {
                      if (error instanceof AxiosError) {
                        toast.error(error.message);
                      }
                    } finally {
                      setRejecting(false);
                    }
                  }}
                  variant="destructive"
                >
                  {isRejecting ? <BeatLoader /> : "Reject"}
                </Button>
                <Button
                  disabled={kyc.status === "verified" || isApproving}
                  onClick={async () => {
                    setApproving(true);
                    try {
                      await apiClient.post(
                        "/verifications/approve",
                        {},
                        {
                          params: {
                            id: kyc._id,
                          },
                        }
                      );
                      toast.success("Completed");
                      router.refresh();
                      setApproving(false);
                      setOpen(false);
                    } catch (error) {
                      if (error instanceof AxiosError) {
                        toast.error(error.message);
                      }
                    } finally {
                      setApproving(false);
                    }
                  }}
                >
                  {isApproving ? <BeatLoader /> : "Approve"}
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
