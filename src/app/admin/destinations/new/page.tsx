import { DestinationForm } from '@/components/admin/destination-form';

export default function NewDestinationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-headline">Create New Destination</h1>
        <p className="text-muted-foreground">
          Fill out the form below to add a new tourist destination.
        </p>
      </div>
      <DestinationForm />
    </div>
  );
}
