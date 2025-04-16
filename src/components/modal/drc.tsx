import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";

export function Drc({ data }) {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const handleDelete = (id) => {
    fetch(`/api/fosa/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete the transaction");
        }
        return response.json();
      })
      .then((data) => {
        alert(`Transaction deleted successfully: ${data.message}`);
      })
      .catch((error) => {
        alert(`Error deleting transaction: ${error.message}`);
      })
      .finally(() => {
        window.location.reload();
      });
  };

 

  return (
    <Table className="w-[90%] mx-2">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Description</TableHead>
         
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{new Date(item.date).toDateString()}</TableCell>
            <TableCell className="capitalize">{item.type}</TableCell>
            <TableCell>{item.accountNumber}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
              }).format(item.amount)}
            </TableCell>
            <TableCell className="text-wrap">{item.description}</TableCell>
            <TableCell>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded"
                onClick={() => handleDelete(item.id)}
              >
                Delete
              </button>
              </TableCell>
          </TableRow>
        ))}
        
        {sortedData.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              No transactions found.
            </TableCell>
          </TableRow>
        )}

      </TableBody>
    </Table>
  );
}
