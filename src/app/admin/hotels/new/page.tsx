import { HotelForm } from '@/components/admin/hotel-form';

export default function NewHotelPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Create New Hotel</h1>
        <p className="text-muted-foreground">
          Fill out the form below to add a new hotel listing.
        </p>
      </div>
      <HotelForm />
    </div>
  );
}
