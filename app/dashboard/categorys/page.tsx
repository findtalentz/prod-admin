import CategoryForm from "@/components/dashboard/categorys/category-form";
import CategoryTable from "@/components/dashboard/categorys/category-table";

const Categorys = () => {
  return (
    <div className="p-4 max-h-screen overflow-auto grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <CategoryForm />
      </div>
      <div>
        <CategoryTable />
      </div>
    </div>
  );
};

export default Categorys;
