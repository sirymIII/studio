import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function RecommendationsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section id="recommendations" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Card className="bg-muted">
              <div className="grid items-center gap-8 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <h2 className="font-headline text-3xl font-bold md:text-4xl">
                    Find Your Perfect Getaway
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">
                    Let our AI help you find the ideal destination based on your
                    preferences.
                  </p>
                  <form className="mt-8 space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="city">Your City</label>
                      <Input id="city" placeholder="e.g., Lagos" />
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <label htmlFor="budget">Budget</label>
                        <Select>
                          <SelectTrigger id="budget">
                            <SelectValue placeholder="Select budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="interests">Interests</label>
                        <Select>
                          <SelectTrigger id="interests">
                            <SelectValue placeholder="Select interests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="history">
                              Historical Sites
                            </SelectItem>
                            <SelectItem value="nature">
                              Natural Beauty
                            </SelectItem>
                            <SelectItem value="culture">
                              Cultural Experiences
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full sm:w-auto">
                      Get Recommendations
                    </Button>
                  </form>
                </div>
                <div className="relative hidden h-full min-h-[300px] w-full overflow-hidden rounded-r-lg md:block">
                  <Image
                    src="https://picsum.photos/seed/recommend/800/600"
                    alt="Map of Nigeria"
                    fill
                    className="object-cover"
                    data-ai-hint="nigeria map"
                  />
                </div>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
