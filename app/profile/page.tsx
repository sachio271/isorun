'use client';

import Header from "@/components/header";
import { showToast } from "@/components/toast-notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserRef } from "@/lib/api/userApi";
import { UserData } from "@/types/response/userResponse";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Profile = () => {
    const {data: session} = useSession();
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        fetchDataUser()
    }, [session])
    
    const fetchDataUser = async () => {
        if(!session?.accessToken) return

        try {
            const trx = await getUserRef(session.accessToken, session.user?.id)
            setUsers(trx)
            console.log(trx)   
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast({
                type: "error",
                title: "Data Fetch Error",
                description: "Failed to fetch data",
            });
        }
    }
    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/banner.webp')" }}>
        <Header />
        <div className="backdrop-blur-xs min-h-screen bg-white/40 p-10 md:p-18">
            <div className="container mx-auto p-6 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {users.map((user, x) => (
                    <Card className="bg-white/80 shadow-md" key={x}>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                        <p className="text-sm text-gray-600">{user.type}</p>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm text-gray-700">
                        <div><strong>EKTP:</strong> {user.ektp}</div>
                        <div><strong>Gender:</strong> {user.gender}</div>
                        <div><strong>Birth:</strong> {user.birthPlace}, {new Date(user.birthDate).toLocaleDateString()}</div>
                        <div><strong>Phone:</strong> {user.phone}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Address:</strong> {user.address}</div>
                        <div><strong>District:</strong> {user.district}, {user.subDistrict}</div>
                        <div><strong>City:</strong> {user.city}</div>
                        <div><strong>Weight/Height:</strong> {user.weight} kg / {user.height} cm</div>
                        <div><strong>Blood Type:</strong> {user.bloodType}</div>
                        <div><strong>Religion:</strong> {user.religion}</div>
                        <div><strong>Status:</strong> {user.status}</div>
                        <div><strong>Company:</strong> {user.company}</div>
                    </CardContent>
                </Card>
                ))}
            </div>
        </div>
        </div>
    );
}

export default Profile