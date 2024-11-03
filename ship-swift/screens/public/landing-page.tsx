'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CheckCircle, Truck, Package, Users, Star } from "lucide-react"
import { useInView } from "react-intersection-observer"

export default function ShipSwiftLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url("/assets/public/hero-1.jpeg")'}}>
          <div className="absolute inset-0 bg-black/60" aria-hidden="true"></div>
          <div className="container relative z-10 px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className={`space-y-4 text-white ${isVisible ? 'animate-in fade-in slide-in-from-left-5 duration-1000' : ''}`}>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Swift Deliveries for Your Community
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Connect with local drivers for fast, reliable parcel deliveries. Ship Swift - Your Community Delivery Network.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="inline-flex items-center justify-center text-base font-bold bg-white text-black hover:bg-gray-200">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="text-base font-bold text-black border-white hover:bg-white hover:text-black">Learn More</Button>
                </div>
              </div>
              <div className={`hidden lg:flex items-center justify-center ${isVisible ? 'animate-in fade-in slide-in-from-right-5 duration-1000' : ''}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-white">
                  <h2 className="text-2xl font-bold mb-4">Quick Delivery Request</h2>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="pickup" className="block text-sm font-medium mb-1">Pickup Location</label>
                      <Input type="text" id="pickup" className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/50" placeholder="Enter pickup address" />
                    </div>
                    <div>
                      <label htmlFor="dropoff" className="block text-sm font-medium mb-1">Dropoff Location</label>
                      <Input type="text" id="dropoff" className="w-full px-3 py-2 bg-white/20 text-white placeholder-white/50" placeholder="Enter dropoff address" />
                    </div>
                    <Button className="w-full bg-white text-black hover:bg-gray-200">Request Delivery</Button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted" ref={ref}>
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Why Choose Ship Swift?</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { icon: Truck, title: "Fast Deliveries", description: "Get your parcels delivered quickly with our network of local drivers." },
                { icon: Users, title: "Community Driven", description: "Join a network of trusted drivers and customers in your local area." },
                { icon: CheckCircle, title: "Reliable Service", description: "Track your deliveries in real-time and enjoy our satisfaction guarantee." }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <Card>
                    <CardContent className="flex flex-col items-center space-y-4 p-6">
                      <feature.icon className="h-12 w-12 text-primary" />
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                      <p className="text-center text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">How It Works</h2>
            <Tabs defaultValue="sender" className="w-full max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sender">For Senders</TabsTrigger>
                <TabsTrigger value="driver">For Drivers</TabsTrigger>
              </TabsList>
              <TabsContent value="sender" className="mt-6 space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
                    <p>Sign up and create a delivery request</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
                    <p>Get matched with a nearby driver</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
                    <p>Track your delivery in real-time</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">4</div>
                    <p>Receive your parcel and rate the service</p>
                  </li>
                </ol>
              </TabsContent>
              <TabsContent value="driver" className="mt-6 space-y-4">
                <ol className="space-y-4">
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
                    <p>Sign up and complete the verification process</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
                    <p>Browse and accept delivery requests in your area</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
                    <p>Pick up and deliver parcels</p>
                  </li>
                  <li className="flex items-center space-x-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">4</div>
                    <p>Get paid and build your reputation</p>
                  </li>
                </ol>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">What Our Users Say</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { name: "Alice", role: "Sender", content: "Ship Swift has made sending parcels so easy! The drivers are always punctual and friendly." },
                { name: "Bob", role: "Driver", content: "I love being part of the Ship Swift community. It's a great way to earn extra income on my own schedule." },
                { name: "Charlie", role: "Sender", content: "The real-time tracking feature gives me peace of mind. I always know where my package is." }
              ].map((testimonial, index) => (
                <Card key={index} className={`${isVisible ? 'animate-in fade-in zoom-in duration-1000' : ''}`} style={{ animationDelay: `${index * 200}ms` }}>
                  <CardContent className="flex flex-col items-center space-y-4 p-6 text-center">
                    <Star className="h-8 w-8 text-yellow-500" />
                    <p className="text-muted-foreground">"{testimonial.content}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join Ship Swift today and experience the future of community-driven parcel delivery.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button className="inline-flex items-center justify-center text-base font-bold">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="text-base font-bold">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}