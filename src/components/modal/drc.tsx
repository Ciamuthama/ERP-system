import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

  export function Drc() {
    return (
      <Table className="w-[90%] mx-2">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Doc Number</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Maker</TableHead>
            <TableHead className="text-right">Posted</TableHead>
            <TableHead className="text-right">Decs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
              <TableCell className="font-medium"></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-right"></TableCell>
            </TableRow>
        </TableBody>
      </Table>
    )
  }
  