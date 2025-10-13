"use client"

import type React from "react"

import { Mail, MapPin, Clock, Send } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData)
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="pt-24 pb-16">
                {/* Hero Section */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <span className="inline-block px-4 py-1.5 text-sm font-medium bg-black text-white rounded-full">
                            GET IN TOUCH
                        </span>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance text-foreground/50">
                            We'd Love to{" "}
                            <span className="text-foreground">
                                Hear From You
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed text-pretty max-w-3xl mx-auto">
                            Have questions about our products? Need help with an order? Our team is here to assist you.
                        </p>
                    </div>
                </section>

                {/* Contact Content */}
                <section className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <div className="p-6 space-y-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-foreground">Email Us</h3>
                                        <a href="mailto:support@keebhouse.com" className="text-orange-500 hover:underline">
                                            support@keebhouse.com
                                        </a>
                                        <p className="text-sm text-foreground/70 mt-2">We'll respond within 24 hours</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-foreground">Visit Us</h3>
                                        <p className="text-foreground/70">
                                            123 Keyboard Lane
                                            <br />
                                            Tech District
                                            <br />
                                            San Francisco, CA 94102
                                        </p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                    <div className="w-12 h-12 rounded-lg bg-orange-500 flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-foreground" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-foreground">Business Hours</h3>
                                        <div className="space-y-1 text-sm text-foreground/70">
                                            <p>Monday - Friday: 9am - 6pm PST</p>
                                            <p>Saturday: 10am - 4pm PST</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="p-8 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <h2 className="text-2xl font-bold tracking-tight text-foreground">Send us a message</h2>
                                            <p className="text-foreground/70">
                                                Fill out the form below and we'll get back to you as soon as possible.
                                            </p>
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium text-foreground">
                                                    Name
                                                </label>
                                                <input
                                                    id="name"
                                                    type="text"
                                                    placeholder="Your name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-2 bg-background border dark:border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium text-foreground">
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-2 bg-background border dark:border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="subject" className="text-sm font-medium text-foreground">
                                                Subject
                                            </label>
                                            <input
                                                id="subject"
                                                type="text"
                                                placeholder="How can we help?"
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 bg-background border dark:border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium text-foreground">
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                placeholder="Tell us more about your inquiry..."
                                                rows={6}
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                required
                                                className="w-full px-4 py-2 bg-background border dark:border-foreground/10 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors"
                                        >
                                            <Send className="h-4 w-4 mr-2" />
                                            Send Message
                                        </button>
                                    </form>
                                </div>

                                {/* FAQ Section */}
                                <div className="mt-8 space-y-4">
                                    <h3 className="text-xl font-semibold text-foreground">Frequently Asked Questions</h3>
                                    <div className="space-y-3">
                                        <div className="p-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-foreground">What payment methods do you accept?</h4>
                                            <p className="text-sm text-foreground/70">
                                                We accept all major credit cards, debit cards, and digital payment methods through our secure
                                                Stripe integration.
                                            </p>
                                        </div>
                                        <div className="p-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-foreground">How long does shipping take?</h4>
                                            <p className="text-sm text-foreground/70">
                                                Standard shipping typically takes 5-7 business days. Express shipping options are available at
                                                checkout.
                                            </p>
                                        </div>
                                        <div className="p-4 dark:bg-background/50 border dark:border-foreground/10 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-foreground">What is your return policy?</h4>
                                            <p className="text-sm text-foreground/70">
                                                We offer a 30-day return policy on all products. Items must be in original condition with all
                                                packaging.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}