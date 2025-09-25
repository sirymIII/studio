'use client';
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hotels as HotelsComponent } from "@/components/hotels";
import { useHotels } from "@/services/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function HotelsPage() {
    const { data: hotels, isLoading } = useHotels();

    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                {isLoading && (
                  <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4">
                              <Skeleton className="h-6 w-3/4" />
                              <Skeleton className="mt-2 h-4 w-1/2" />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                {hotels && <HotelsComponent hotels={hotels} />}
            </main>
            <Footer />
        </div>
    )
}
