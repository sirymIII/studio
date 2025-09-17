import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-8">Admin Dashboard</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Destinations</CardTitle>
            <CardDescription>Number of locations managed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Hotels</CardTitle>
            <CardDescription>Number of hotels listed</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">25</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>Number of registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,234</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
