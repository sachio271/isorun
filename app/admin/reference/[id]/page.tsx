'use client';

import { showToast } from '@/components/toast-notification';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { createFamilyRef, getUserRefById } from '@/lib/api/userApi';
import { FamilyRef, UsersRef } from '@/types/response/userResponse';
import { ChevronDown, ChevronUp, Edit, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserDetailPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const [user, setUser] = useState<UsersRef | undefined>(undefined);
    const [family, setFamily] = useState<FamilyRef[]>([]);
        const [showFamilyForm, setShowFamilyForm] = useState(false);
        const [editingId, setEditingId] = useState<string | null>(null);

    const [familyForm, setFamilyForm] = useState({
        name: "",
        ektp: "",
        type: "",
        relation: "",
        birthdate: "",
        birthplace: "",
        address: "",
        subdistrict: "",
        district: "",
        city: "",
        phone: "",
        email: "",
    });

    const fetchData = async () => {
        if (!session?.accessToken || !id) return;
        try {
            const userData = await getUserRefById(session.accessToken, id as string);
            setUser(userData);
            setFamily(userData.family_ref || []);
        } catch (error) {
            console.error("Error fetching user/family:", error);
        }
        };

    useEffect(() => {
        fetchData();
    }, [session, id]);

    const handleSave = async () => {
        if (!session?.accessToken) {
          console.error("No access token");
          return;
        }
    
        const formData = new FormData();
        formData.append("name", familyForm.name);
        formData.append("ektp", familyForm.ektp);
        formData.append("type", familyForm.type);   
        formData.append("relation", familyForm.relation);
        formData.append("birthdate", familyForm.birthdate);
        formData.append("birthplace", familyForm.birthplace);
        formData.append("address", familyForm.address);
        formData.append("subdistrict", familyForm.subdistrict);
        formData.append("district", familyForm.district);
        formData.append("city", familyForm.city);
        formData.append("phone", familyForm.phone);
        formData.append("email", familyForm.email);
    
        try {
            if (editingId) {
                // await updateAlumniStory(editingId, formData, session.accessToken);
            } else {
                await createFamilyRef(session.accessToken, formData);
            }
            await fetchData();
            showToast({
                title: "Data saved!",
                description: "Your data was saved.",
                type: "success",
            });
            setFamilyForm({
                name: "",
                ektp: "",
                type: "",
                relation: "",
                birthdate: "",
                birthplace: "",
                address: "",
                subdistrict: "",
                district: "",
                city: "",
                phone: "",
                email: "",
            });
            setEditingId(null);
            setShowFamilyForm(false);
        } catch (error) {
            console.error(error);
            showToast({
                title: "Something went wrong!",
                description: "Can't save data.",
                type: "error",
            });
        }
    };

    // const handleDeleteAlumni = async (id: number) => {
    //     if (!session?.accessToken) return;
    //     try {
    //         await deleteAlumniStory(id, session.accessToken);
    //         await fetchAlumni();
    //         showToast({
    //             title: "Data saved!",
    //             description: "Your data was saved.",
    //             type: "success",
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         showToast({
    //             title: "Something went wrong!",
    //             description: "Can't delete data.",
    //             type: "error",
    //         });
    //     }
    // };

    if (!user) return <Loader2 className="w-10 h-10 animate-spin" />;

    return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle className="text-lg font-semibold">User Details</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div><strong>Name:</strong> {user.name}</div>
            <div><strong>EKTP:</strong> {user.EKTP}</div>

            <div><strong>Gender:</strong> {user.gender}</div>
            <div><strong>Birthplace:</strong> {user.birthplace}</div>

            <div><strong>Birthdate:</strong> {user.birthdate}</div>
            <div><strong>Phone:</strong> {user.phone}</div>

            <div><strong>Email:</strong> {user.email}</div>
            <div><strong>Type:</strong> {user.type}</div>

            <div><strong>Blood Type:</strong> {user.bloodType}</div>
            <div><strong>Religion:</strong> {user.religion}</div>

            <div><strong>Weight:</strong> {user.weight} kg</div>
            <div><strong>Height:</strong> {user.height} cm</div>

            <div><strong>Structure:</strong> {user.struct}</div>
            <div><strong>Subdistrict:</strong> {user.subdistrict}</div>

            <div><strong>District:</strong> {user.district}</div>
            <div><strong>City:</strong> {user.city}</div>

            <div className="md:col-span-2"><strong>Address:</strong> {user.address}</div>
            </div>
        </CardContent>
        </Card>


        <Card>
            <CardHeader>
            <CardTitle>Family Members</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    <div className="flex justify-between items-center">
                    <Button onClick={() => setShowFamilyForm(prev => !prev)} variant="outline" className="hover: cursor-pointer">
                        {showFamilyForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} Tambah
                    </Button>
                    </div>

                    <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>EKTP</TableHead>
                            <TableHead>Relation</TableHead>
                            <TableHead>Tanggal Lahir</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {family.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.EKTP}</TableCell>
                            <TableCell>{item.relation}</TableCell>
                            <TableCell>{item.birthplace}, {item.birthdate}</TableCell>
                            <TableCell>{item.address}</TableCell>
                            <TableCell>{item.phone}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell className="flex justify betweem">
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setFamilyForm({
                                            name: item.name,
                                            ektp: item.EKTP,
                                            type: item.type,
                                            relation: item.relation,
                                            birthdate: item.birthdate,
                                            birthplace: item.birthplace,
                                            address: item.address,
                                            subdistrict: item.subdistrict,
                                            district: item.district,
                                            city: item.city,
                                            phone: item.phone,
                                            email: item.email,
                                        });
                                        setEditingId(item.id.toString());
                                        setShowFamilyForm(true);
                                    }}
                                    className="text-yellow-500 hover: cursor-pointer"
                                >
                                    <Edit className="w-5 h-5" />
                                </Button>

                                {/* <Button
                                    variant="link"
                                    onClick={() => handleDeleteAlumni(item.id)}
                                    className="text-red-500 hover: cursor-pointer"
                                >
                                    <Trash className="w-5 h-5" />
                                </Button> */}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>

                    {showFamilyForm && (
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                        <Input placeholder="Nama" value={familyForm.name} onChange={(e) => setFamilyForm({ ...familyForm, name: e.target.value })} />
                        <Input placeholder="EKTP" value={familyForm.ektp} onChange={(e) => setFamilyForm({ ...familyForm, ektp: e.target.value })} />
                        <Input placeholder="Type" value={familyForm.type} onChange={(e) => setFamilyForm({ ...familyForm, type: e.target.value })} />
                        <Input placeholder="Relation" value={familyForm.relation} onChange={(e) => setFamilyForm({ ...familyForm, relation: e.target.value })} />
                        <Input placeholder="Tanggal Lahir" value={familyForm.birthdate} onChange={(e) => setFamilyForm({ ...familyForm, birthdate: e.target.value })} />
                        <Input placeholder="Tempat Lahir" value={familyForm.birthplace} onChange={(e) => setFamilyForm({ ...familyForm, birthplace: e.target.value })} />
                        <Input placeholder="Alamat" value={familyForm.address} onChange={(e) => setFamilyForm({ ...familyForm, address: e.target.value })} />
                        <Input placeholder="Subdistrict" value={familyForm.subdistrict} onChange={(e) => setFamilyForm({ ...familyForm, subdistrict: e.target.value })} />
                        <Input placeholder="District" value={familyForm.district} onChange={(e) => setFamilyForm({ ...familyForm, district: e.target.value })} />
                        <Input placeholder="City" value={familyForm.city} onChange={(e) => setFamilyForm({ ...familyForm, city: e.target.value })} />
                        <Input placeholder="Phone" value={familyForm.phone} onChange={(e) => setFamilyForm({ ...familyForm, phone: e.target.value })} />
                        <Input placeholder="Email" value={familyForm.email} onChange={(e) => setFamilyForm({ ...familyForm, email: e.target.value })} />
                        <Button className="col-span-2" onClick={handleSave}>
                        Simpan Cerita Alumni
                        </Button>
                    </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
