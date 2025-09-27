'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrUpdateDestination } from '@/app/admin/destinations/actions';
import { DestinationSchema, type Destination } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import type { z } from 'zod';

type DestinationFormData = z.infer<typeof DestinationSchema>;

export function DestinationForm({
  destination,
}: {
  destination?: Destination;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<DestinationFormData>({
    resolver: zodResolver(DestinationSchema),
    defaultValues: destination || {
      name: '',
      state: '',
      description: '',
      type: '',
      cityTown: '',
      latitude: 0,
      longitude: 0,
      recommendedStayDays: 1,
      popularityRank: 5,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: DestinationFormData) {
    const formData = new FormData();
    if (destination?.id) {
      formData.append('id', destination.id);
    }
    for (const key in data) {
      formData.append(key, (data as any)[key]);
    }

    const result = await createOrUpdateDestination(formData);

    if (result.success === false) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: `Destination has been ${destination ? 'updated' : 'created'}.`,
      });
      // The redirect is handled in the server action
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {destination ? 'Edit Destination' : 'Create Destination'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Yankari National Park" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Bauchi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of the destination..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Natural, Historical" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="cityTown"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>City/Town</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Bauchi" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                        <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                        <Input type="number" step="any" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="recommendedStayDays"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Recommended Stay (Days)</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="popularityRank"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Popularity Rank (1-10)</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" max="10" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {destination ? 'Update' : 'Create'} Destination
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
