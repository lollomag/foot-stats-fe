import { BarCharts } from '@/components/BarCharts';
import { PageNotFound } from '@/components/PageNotFound';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cookies } from 'next/headers';

const MyStats: React.FC = async () => {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) return <PageNotFound />

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Le mie statistiche</h1>
        {/* <div className="flex items-center space-x-4">
          <Button variant="secondary">Jan 20, 2023 - Feb 09, 2023</Button>
          <Button variant="default">Download</Button>
        </div> */}
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
