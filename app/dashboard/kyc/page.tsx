import KYCTable from "@/components/dashboard/kyc/kyc-table";
import Pagination from "@/components/pagination";
import apiClient from "@/services/api-client";
import { APIResponse } from "@/types/APIResponse";
import { KYC } from "@/types/KYC";

export default async function Jobs() {
  const { data } = await apiClient.get<APIResponse<KYC[]>>("/verifications");
  return (
    <>
      <KYCTable kyc={data.data} />
      <Pagination currentPage={data.currentPage} pageCount={data.pageCount} />
    </>
  );
}

export const dynamic = "force-dynamic";
