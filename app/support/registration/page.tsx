'use client';
import Header from "@/components/header";
import QrScanner from "@/components/qrScanner";
import { showToast } from "@/components/toast-notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// NEW: Import your dedicated QrScanner component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRegistrationParticipant, updateRegistrationStatus } from "@/lib/api/marketingSupportApi";
import { IParticipant } from "@/types/helper/racePackResponse";
import { IRegistrationTransaction, TRegistrationRecap } from "@/types/helper/registrationResponse";
import {
  ChevronDown,
  ChevronUp,
  PackageCheck,
  PackageOpen,
  QrCode,
  Search,
  Shirt
} from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
// REMOVED: No longer need to import react-qr-reader

// ... (The getTransactionStatus function remains the same) ...
const getTransactionStatus = (participants: IParticipant[]) => {
  if (!participants || participants.length === 0) {
    return { text: 'No Participants', variant: 'outline' };
  }
  const claimedCount = participants.filter(p => p.registrationDate !== null).length;
  if (claimedCount === 0) return { text: 'Not Registered', variant: 'destructive' };
  if (claimedCount === participants.length) return { text: 'All Registered', variant: 'success' };
  return { text: 'Partially Registered', variant: 'secondary' };
};


const RegistrationAdmin = () => {
 const { data: session, status } = useSession();
 const [loading, setLoading] = useState(false);
 const [expandedRows, setExpandedRows] = useState(new Set());
 const [transaction, setTransaction] = useState<IRegistrationTransaction[]>([]);
 const [recap, setRecap] = useState<TRegistrationRecap>({});
 const [meta, setMeta] = useState<{ totalPages: number; currentPage: number; search: string } | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
 const [filters, setFilters] = useState({
   page: 1,
   limit: 5,
   search: '',
 });

  // ... (fetchApplications, toggleRow, etc. remain the same) ...
  const fetchApplications = useCallback(async (currentFilters: typeof filters) => {
    if (status === 'authenticated' && session.accessToken) {
      try {
        setLoading(true);
        const data = await getRegistrationParticipant(session.accessToken, currentFilters);
        setTransaction(data.data);
        setRecap(data.recap);
        setMeta(data.meta);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        showToast({ title: "Error", description: "Could not fetch registration data.", type: "error" });
      } finally {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session?.accessToken, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchApplications(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, fetchApplications]);

  const toggleRow = (trxId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(trxId)) {
      newExpandedRows.delete(trxId);
    } else {
      newExpandedRows.add(trxId);
    }
    setExpandedRows(newExpandedRows);
  };

  const processRegistrationUpdate = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      await updateRegistrationStatus(id, session.accessToken);
      await fetchApplications(filters);
      showToast({ title: "Success!", description: `Status for ${id} has been updated.`, type: "success" });
    } catch (error) {
      console.error(error);
      showToast({ title: "Error", description: "Failed to update status. The ID might be invalid.", type: "error" });
    }
  };

  const handleToggleStatus = async (id: string) => {
    if (window.confirm("Are you sure you want to manually update this item's status?")) {
      await processRegistrationUpdate(id);
    }
  };

  // UPDATED: The success callback now directly receives the text.
  const handleScanSuccess = (decodedText: string) => {
    if (decodedText) {
      setIsScannerOpen(false); // Close the scanner
      console.log(`QR Code Scanned: ${decodedText}`);
      processRegistrationUpdate(decodedText);
    }
  };

  // ... (loading state, handlePageChange, handleSearchChange remain the same) ...
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-bounce">
          <Shirt className="h-16 w-16 text-gray-400" />
        </div>
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };


 return (
    <>
      <div className="p-4 md:p-8 space-y-6 min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }}>
        {/* ... (Header and Recap Card remain the same) ... */}
        <Header />
        <Card className="bg-white/80 backdrop-blur-sm mt-10">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shirt className="mr-2" /> Registration Recap
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {Object.keys(recap).sort().map(cat => (
              <div key={cat} className="bg-blue-100 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{cat}</p>
                <p className="text-lg text-green-600 font-semibold">
                  {recap[cat].present || 0}
                  <span className="text-sm text-gray-500 font-normal"> / {recap[cat].total} Registered</span>
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* The main table card */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Registration List</CardTitle>
              <Button onClick={() => setIsScannerOpen(true)} variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by ID, PT, Division, or Name..."
                className="pl-10 bg-blue-50"
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
          </CardHeader>
          <CardContent>
            {/* ... (The entire Table and Pagination structure remains exactly the same) ... */}
            <div className="border rounded-lg overflow-hidden">
                <Table className="bg-blue-50">
                {/* Table Header */}
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Registration ID</TableHead>
                    <TableHead>Company (PT)</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody>
                    {transaction.map((trx) => {
                    const isExpanded = expandedRows.has(trx.id);
                    const status = getTransactionStatus(trx.participants);
                    return (
                        <React.Fragment key={trx.id}>
                        <TableRow className="cursor-pointer hover:bg-gray-50" onClick={() => toggleRow(trx.id)}>
                            <TableCell>
                            <Button variant="ghost" size="icon">
                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{trx.id}</TableCell>
                            <TableCell className="font-medium">{trx.pt} ({trx.divisi})</TableCell>
                            <TableCell>
                            <Badge className="bg-blue-900" variant="default">{trx.participants.length} Participants</Badge>
                            </TableCell>
                            <TableCell>
                            <Badge variant={status.text === 'Not Registered' ? 'destructive' : status.text === 'Partially Registered' ? 'secondary' : status.text === 'All Registered' ? 'default' : 'outline'}>{status.text}</Badge>
                            </TableCell>
                        </TableRow>
                        {isExpanded && (
                            <TableRow>
                            <TableCell colSpan={5} className="p-0">
                                <div className="p-4">
                                <div className="flex mb-4 text-sm text-gray-600 justify-between items-center">
                                    <h4 className="font-semibold mb-2 ml-2">Participant Details:</h4>
                                    {status.text === 'All Registered' ? (
                                    <div className="flex items-center justify-end text-green-600 font-semibold">
                                        <PackageCheck className="h-4 w-4 mr-2"/> Registered
                                    </div>
                                    ) : (
                                    <Button size="sm" className="hover: cursor-pointer" variant="default" onClick={() => handleToggleStatus(trx.id)}>
                                        <PackageOpen className="h-4 w-4 mr-2" /> Mark as Registered
                                    </Button>
                                    )}
                                </div>
                                <Table>
                                    <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>EKTP</TableHead>
                                        <TableHead>Category</TableHead>
                                    </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                    {trx.participants.map(p => (
                                        <TableRow key={p.id}>
                                        <TableCell>{p.fname} {p.lname}</TableCell>
                                        <TableCell>{p.identityId}</TableCell>
                                        <TableCell>
                                            <Badge className="text-base bg-cyan-700" variant="default">{p.master_category.name || 'N/A'}</Badge>
                                        </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                                </div>
                            </TableCell>
                            </TableRow>
                        )}
                        </React.Fragment>
                    );
                    })}
                </TableBody>
                </Table>
            </div>
            {transaction.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                <p>No transactions found for &quot;{filters.search}&quot;.</p>
                </div>
            )}
            {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                <span className="text-sm text-gray-600">
                    Page {meta.currentPage} of {meta.totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(meta.currentPage - 1)}
                    disabled={meta.currentPage <= 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(meta.currentPage + 1)}
                    disabled={meta.currentPage >= meta.totalPages}
                >
                    Next
                </Button>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* UPDATED: The Dialog now renders your new QrScanner component */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Scan Participant QR Code</DialogTitle>
          </DialogHeader>
          <div className="p-4 rounded-lg">
            {/* Render the new component only when the dialog is open */}
            {isScannerOpen && <QrScanner onScanSuccess={handleScanSuccess} />}
          </div>
        </DialogContent>
      </Dialog>
    </>
 );
};

export default RegistrationAdmin;