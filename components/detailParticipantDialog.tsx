'use client';

import { EnrichParticipant } from "@/types/response/transactionResponse";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export function ParticipantDetail({
  isOpen,
  onClose,
  users,
}: {
  isOpen: boolean;
  onClose: () => void;
  users: EnrichParticipant[];
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle>Participant Detail</DialogTitle>
          <DialogDescription>List of all participants.</DialogDescription>
        </DialogHeader>

        <div className="w-full overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Pt</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{p.fname} {p.lname}</TableCell>
                  <TableCell>{p.pt}</TableCell>
                  <TableCell>{p.divisi}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>{p.phone}</TableCell>
                  <TableCell>{p.master_category?.name}</TableCell>
                  <TableCell>{p.size}</TableCell>
                  <TableCell>Rp {p.price.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
