import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Drc({ data }) {
  
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <Table className="w-[90%] mx-2">
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Account Number</TableHead>
          <TableHead>memberNo</TableHead>
          <TableHead>FullName</TableHead>
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
            <TableCell>{item.memberNo}</TableCell>
            <TableCell>{item.fullName}</TableCell>
            <TableCell>
              {new Intl.NumberFormat("en-KE", {
                style: "currency",
                currency: "KES",
              }).format(item.amount)}
            </TableCell>
            <TableCell className="text-wrap">{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
