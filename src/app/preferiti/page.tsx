"use client"
import { BarCharts } from '@/components/BarCharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/context/UserContext';
import { addToFavourites } from '@/lib/strapi';
import { StarIcon } from 'lucide-react';
import Cookies from 'js-cookie';


const MyStats: React.FC = () => {
  const { user, refreshUser } = useUser();
  const jwt = Cookies.get("jwt");

  const toggleFavorite = async (playerId: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const favoriteIds = user.favorites.map((favorite: any) => favorite.id)

    try {
      await addToFavourites(jwt || "", playerId, user.id, favoriteIds)
      await refreshUser()
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Preferiti</h1>
      </div>

      <div className="grid grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {user?.favorites.map((player: any) => (
          <div key={player.id} className="border-2 border-green-800 rounded-sm py-1 px-2 flex items-start gap-3">
            <button onClick={() => toggleFavorite(player.id)} className="text-green-800">
              <StarIcon className={"fill-green-800"} />
            </button>
            <p className="font-semibold">{player.fullname}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardContent className="py-4 px-6 flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Gare giocate</h2>
                <p className="text-3xl font-bold text-green-800">35</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4 px-6 flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Posizione media</h2>
                <p className="text-3xl font-bold text-green-800">41</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-4 px-6 flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Miglior posizionamento</h2>
                <p className="text-3xl font-bold text-green-800">5°</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <BarCharts />
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Olivia Martin", email: "olivia.martin@email.com", amount: "$1,999.00" },
                    { name: "Jackson Lee", email: "jackson.lee@email.com", amount: "$39.00" },
                    { name: "Isabella Nguyen", email: "isabella.nguyen@email.com", amount: "$299.00" },
                    { name: "William Kim", email: "will@email.com", amount: "$999.00" },
                    { name: "Sofia Davis", email: "sofia.davis@email.com", amount: "$39.00" },
                  ].map((sale, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${sale.name}`} alt={sale.name} />
                          <AvatarFallback>{sale.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{sale.name}</p>
                          <p className="text-sm text-gray-500">{sale.email}</p>
                        </div>
                      </div>
                      <p className="font-semibold text-green-800">{sale.amount}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default MyStats;
