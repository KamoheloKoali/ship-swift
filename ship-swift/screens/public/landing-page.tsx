import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Truck, User, CheckCircle, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Swift Delivery at Your Fingertips
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl ">
                  Connect with verified couriers and get your packages delivered fast and securely.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/sign-up">
                <Button className="bg-white text-black hover:bg-gray-200">Get Started</Button>
                </Link>
                <Button variant="outline" className="text-white border-white bg-slate-600 hover:bg-white hover:text-black">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100" id="how-it-works">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:gap-16">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Truck className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">For Drivers</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  1. Register as a driver
                  <br />
                  2. Complete the vetting process
                  <br />
                  3. Accept delivery requests
                  <br />
                  4. Earn money on your schedule
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <User className="h-12 w-12 text-blue-500" />
                <h3 className="text-xl font-bold">For Users</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  1. Sign up for an account
                  <br />
                  2. Request a courier service
                  <br />
                  3. Track your package in real-time
                  <br />
                  4. Receive your delivery
                </p>
              </div>
            </div>  
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Features & Benefits</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <h3 className="text-xl font-bold">Verified Drivers</h3>
                <p className="text-sm text-gray-500 text-center">All our drivers are thoroughly vetted for your safety and peace of mind.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <MapPin className="h-8 w-8 text-red-500" />
                <h3 className="text-xl font-bold">Real-time Tracking</h3>
                <p className="text-sm text-gray-500 text-center">Track your package's journey from pickup to delivery in real-time.</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border p-4 rounded-lg">
                <Clock className="h-8 w-8 text-blue-500" />
                <h3 className="text-xl font-bold">Flexible Scheduling</h3>
                <p className="text-sm text-gray-500 text-center">Choose delivery times that work best for you or your customers.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Join ShipSwift today and experience the future of courier services.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="max-w-lg flex-1" placeholder="Enter your email" type="email" />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our Terms & Conditions and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 ShipSwift. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  )
}