import TransactionTable from "@/components/dashboard/transactions/transaction-table";

export default function Transactions() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Transactions</h2>
      <div className="border rounded-2xl p-4">
        <TransactionTable />
      </div>
    </div>
  );
}
