import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hotels as HotelsComponent } from "@/components/hotels";
import { getHotels } from "@/services/firestore";

export default async function HotelsPage() {
    const hotels = await getHotels();
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <HotelsComponent hotels={hotels} />
            </main>
            <Footer />
        </div>
    )
}
