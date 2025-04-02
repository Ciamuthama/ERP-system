import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Drc({ data }) {
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
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{new Date(item.createdAt).toDateString()}</TableCell>
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
            <TableCell>{item.description}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
