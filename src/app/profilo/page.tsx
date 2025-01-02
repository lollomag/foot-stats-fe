"use client"

import ChangePasswordForm from "@/components/AuthForms/ChangePassword";
import PaymentsInfo from "@/components/PaymentsInfo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import { getStripeData } from "@/lib/strapi";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file); // Anteprima immagine locale
      setProfileImage(imageUrl);
    }
  };

  const fetchData = async () => {
    try {
      const result = await getStripeData(user.stripeCustomerId);
      setData(result);
    } catch (error) {
      console.error('Errore durante il recupero dei dati:', error);
    }
  };

  useEffect(() => {
    if (!!user) {
      fetchData()
    }
  }, [user]);
  

  return (
    <div className="w-full my-8">
      <h1 className="text-2xl font-bold mb-4">Profilo Utente</h1>
      <Tabs defaultValue="user-data" className="flex justify-between gap-10">
        <TabsList className="flex flex-col w-1/5 border-r h-full py-5">
          <TabsTrigger value="user-data" className="text-left w-full justify-start">
            Dati Utente
          </TabsTrigger>
          <TabsTrigger value="subscription" className="text-left w-full justify-start">
            Abbonamento
          </TabsTrigger>
          <TabsTrigger value="change-password" className="text-left w-full justify-start">
            Cambia Password
          </TabsTrigger>
        </TabsList>

        <div className="w-4/5 pl-4">
          <TabsContent value="user-data">
            <h2 className="text-xl font-semibold mb-4">Dati Utente</h2>
            <form className="space-y-4">
              <div>
                <p className="block text-sm font-medium">
                  Nome e Cognome
                </p>
                <p className="text-gray-700">{user?.name} {user?.surname}</p>
              </div>
              <div>
                <p className="block text-sm font-medium">
                  Email
                </p>
                <p className="text-gray-700">{user?.email}</p>
              </div>
              <div>
                <p className="block text-sm font-medium mb-2">
                  Immagine Profilo
                </p>
                <div className="flex items-center gap-4">
                  {/* Anteprima immagine */}
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profilo"
                        className="w-full h-full object-cover"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <span className="text-sm text-gray-500 flex items-center justify-center h-full">
                        Nessuna
                      </span>
                    )}
                  </div>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <Button type="button" className="mt-4">
                  Salva Immagine
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="subscription">
            <PaymentsInfo paymentData={data} />
          </TabsContent>

          <TabsContent value="change-password">
            <h2 className="text-xl font-semibold mb-4">Cambia password</h2>
            <ChangePasswordForm />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
