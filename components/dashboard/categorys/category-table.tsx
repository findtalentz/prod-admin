"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import useCategorys from "@/hooks/use-categorys";
import { useCategoryStore } from "@/store";
import { Edit } from "lucide-react";
import Image from "next/image";
import DeleteCategoryDialog from "./delete-category-dialog";

const CategoryTable = () => {
  const { data: categorys } = useCategorys();
  const setCategory = useCategoryStore((s) => s.setCategory);
  if (!categorys) return null;
  return (
    <>
      <h2 className="text-2xl font-semibold mb-3">Categorys</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categorys.data.map((category) => (
            <TableRow key={category._id}>
              <TableCell>
                <Image
                  src={category.image}
                  alt={category.name}
                  width={60}
                  height={60}
                  className="rounded"
                />
              </TableCell>
              <TableCell> {category.name} </TableCell>
              <TableCell> {category.type} </TableCell>
              <TableCell className="space-x-3">
                <Button
                  onClick={() => setCategory(category)}
                  variant="secondary"
                >
                  <Edit /> Edit
                </Button>
                <DeleteCategoryDialog categoryId={category._id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CategoryTable;
