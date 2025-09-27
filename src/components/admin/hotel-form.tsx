'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createOrUpdateHotel } from '@/app/admin/hotels/actions';
import { HotelSchema, type Hotel } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import type { z } from 'zod';

type HotelFormData = z.infer<typeof HotelSchema>;

export function HotelForm({
  hotel,
}: {
  hotel?: Hotel;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<HotelFormData>({
    resolver: zodResolver(HotelSchema),
    defaultValues: hotel || {
      name: '',
      location: '',
      price: 0,
      rating: 3,
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: HotelFormData) {
    const formData = new FormData();
    if (hotel?.id) {
      formData.append('id', hotel.id);
    }
    for (const key in data) {
      formData.append(key, (data as any)[key]);
    }

    const result = await createOrUpdateHotel(formData);

    if (result.success === false) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success!',
        description: `Hotel has been ${hotel ? 'updated' : 'created'}.`,
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {hotel ? 'Edit Hotel' : 'Create Hotel'}
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
                    <Input placeholder="e.g., Eko Hotel & Suites" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Lagos, Lagos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Price per Night</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <FormControl>
                        <Input type="number" min="1" max="5" {...field} />
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
                {hotel ? 'Update' : 'Create'} Hotel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
