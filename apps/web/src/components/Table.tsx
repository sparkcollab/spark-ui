import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

const TableComponent = ({ columns, rows, pageSize = 10, currentPage }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-700">
          <TableRow>
            {columns.map((column) => (
              <TableHead>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <>
              <TableRow>
                {columns.map((column) => (
                  <>
                    {row[column.accessor].cell ? (
                      row[column.accessor].cell
                    ) : (
                      <TableCell>{row[column.accessor]}</TableCell>
                    )}
                  </>
                ))}
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          {/* {
            rows.map(())
          } */}
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>

          <PaginationItem>
            <PaginationLink href="#">10</PaginationLink>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default TableComponent;
