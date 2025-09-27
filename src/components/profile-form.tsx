
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { updateUserProfile } from '@/app/profile/actions';
import {
  UserProfileFormSchema,
  type UserProfileFormData,
} from '@/lib/types';
import { Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';

export function ProfileForm({ user }: { user: User }) {
  const { toast } = useToast();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      displayName: user.displayName || '',
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: UserProfileFormData) {
    const result = await updateUserProfile(data);

    if (result.success) {
      toast({
        title: 'Profile Updated',
        description: 'Your changes have been saved successfully.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
            </Button>
        </div>
      </form>
    </Form>
  );
}
