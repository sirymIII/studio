import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hotels } from "@/components/hotels";

export default function HotelsPage() {
    return (
        <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
                <Hotels />
            </main>
            <Footer />
        </div>
    )
}
