import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-muted">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-4xl font-bold">Contact Us</CardTitle>
                    <CardDescription>We'd love to hear from you. Fill out the form below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium">Full Name</label>
                                <Input id="name" placeholder="John Doe" />
                            </div>
                             <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium">Email Address</label>
                                <Input id="email" type="email" placeholder="you@example.com" />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="message" className="mb-2 block text-sm font-medium">Message</label>
                             <Textarea id="message" placeholder="Your message..." rows={5} />
                        </div>
                        <Button type="submit" className="w-full">Send Message</Button>
                    </form>
                </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
