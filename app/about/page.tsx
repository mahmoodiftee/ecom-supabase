import { Store, Palette, Cpu } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <span className="inline-block px-4 py-1.5 text-sm font-medium bg-zinc-900 text-zinc-300 rounded-full mb-4">
                            About KEEBHOUSE
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground/50">
                            Your Trusted Source for <span className="text-foreground">Premium Mechanical Keyboards</span>
                        </h1>
                        <p className="text-lg sm:text-xl text-zinc-400 leading-relaxed text-pretty max-w-3xl mx-auto">
                            We curate and sell mechanical keyboards from the world's most popular brands, offering premium switches
                            and custom keycaps to help you build your perfect typing experience.
                        </p>
                    </div>
                </section>

                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">What We Do</h2>
                                <div className="space-y-4 text-zinc-400 leading-relaxed">
                                    <p>
                                        KEEBHOUSE is your one-stop destination for mechanical keyboards from the industry's most trusted
                                        brands. We partner with leading manufacturers to bring you authentic, high-quality keyboards that
                                        enthusiasts and professionals rely on.
                                    </p>
                                    <p>
                                        Beyond keyboards, we specialize in premium mechanical switches from top brands, giving you the
                                        freedom to choose the exact feel and sound you want. Whether you prefer tactile, linear, or clicky
                                        switches, we have options for every typing style.
                                    </p>
                                    <p>
                                        Our keycaps customization service lets you personalize your keyboard with a wide selection of
                                        colors, materials, and profiles. Create a setup that's uniquely yours while maintaining the quality
                                        and compatibility you need.
                                    </p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-2xl border border-zinc-800 overflow-hidden">
                                    <img
                                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2-xlFU2kmzXSAdaWXaO1r0fGV1e1TtIE.webp"
                                        alt="KEEBHOUSE Products"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white">What We Offer</h2>
                            <p className="text-lg text-zinc-400 text-pretty max-w-2xl mx-auto">
                                Everything you need to build or upgrade your mechanical keyboard setup.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="p-6 space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <Store className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Popular Brands</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    We stock mechanical keyboards from the most trusted and sought-after brands in the industry, ensuring
                                    authenticity and quality.
                                </p>
                            </div>

                            <div className="p-6 space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <Cpu className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Quality Switches</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Choose from a wide selection of premium mechanical switches including Cherry MX, Gateron, Kailh, and
                                    more to match your typing preference.
                                </p>
                            </div>

                            <div className="p-6 space-y-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                                <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                    <Palette className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">Keycaps Customization</h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Personalize your keyboard with our extensive keycaps collection. Multiple profiles, materials, and
                                    color schemes to create your perfect aesthetic.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-5xl mx-auto">
                        <div className="p-8 sm:p-12 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                            <div className="space-y-6">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">Why Shop With Us</h2>
                                <p className="text-lg text-zinc-400 leading-relaxed">
                                    Our platform is designed to make your shopping experience smooth and secure:
                                </p>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white">Authentic Products</span>
                                            <p className="text-sm text-zinc-400">Genuine keyboards and components from authorized sources</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white">Secure Payments</span>
                                            <p className="text-sm text-zinc-400">Safe checkout powered by Stripe</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white">Expert Curation</span>
                                            <p className="text-sm text-zinc-400">Carefully selected products for quality and performance</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-white">Fast Shipping</span>
                                            <p className="text-sm text-zinc-400">Quick delivery with order tracking</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
