
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
  type UserProfile,
} from '@/lib/types';
import { Loader2 } from 'lucide-react';
import type { User } from 'firebase/auth';

export function ProfileForm({ user, profile }: { user: User, profile: UserProfile | null }) {
  const { toast } = useToast();
  const form = useForm<UserProfileFormData>({
    resolver: zodResolver(UserProfileFormSchema),
    defaultValues: {
      fullName: profile?.basicInfo.fullName || user.displayName || '',
      email: profile?.basicInfo.email || user.email || '',
      phoneNumber: profile?.basicInfo.phoneNumber || '',
      dateOfBirth: profile?.basicInfo.dateOfBirth || '',
      nationality: profile?.basicInfo.nationality || '',
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Your Full Name"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  {...field}
                  disabled // Email is not editable
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                    <Input
                    placeholder="+234..."
                    {...field}
                    disabled={isSubmitting}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Date of Birth</FormLabel>
                <FormControl>
                    <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                    />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nationality</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Nigerian"
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