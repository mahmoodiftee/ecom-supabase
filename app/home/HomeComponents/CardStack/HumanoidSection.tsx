"use client"

import { motion } from "framer-motion"
import { Keyboard, HdmiPort as EthernetPort, Palette } from "lucide-react"

const CustomizationSection = () => {
  const features = [
    {
      icon: Keyboard,
      title: "Premium Mechanical Keyboards",
      description:
        "Curated selection from the world's most trusted brands. Authentic, high-quality keyboards that enthusiasts and professionals rely on.",
    },
    {
      icon: EthernetPort,
      title: "Quality Switches",
      description:
        "Choose from tactile, linear, or clicky switches. Premium options from Cherry MX, Gateron, Kailh, and more to match your typing preference.",
    },
    {
      icon: Palette,
      title: "Custom Keycaps",
      description:
        "Personalize with extensive keycaps collection. Multiple profiles, materials, and color schemes to create your perfect aesthetic.",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  const cardHoverVariants = {
    rest: { y: 0, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" },
    hover: {
      y: -4,
      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  }

  const iconFloatVariants = {
    float: {
      y: [0, -6, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  }

  return (
    <section className="w-full py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted text-sm font-medium text-muted-foreground mb-6">
            ✨ Customization
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">Build Your Dream Setup</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create or upgrade your mechanical keyboard. Choose your layout, switches, and keycaps
            to build something uniquely yours.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants} className="group">
              <motion.div
                initial="rest"
                whileHover="hover"
                variants={cardHoverVariants}
                className="h-full p-6 rounded-lg border border-border bg-card transition-colors duration-300"
              >
                <div className="mb-4">
                  <motion.div
                    className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors"
                    variants={iconFloatVariants}
                    animate="float"
                  >
                    <feature.icon className="w-5 h-5 text-accent" />
                  </motion.div>
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 p-6 rounded-lg bg-muted/30 border border-border"
        >
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h4 className="text-base font-semibold text-foreground mb-2">Why Choose Us</h4>
              <p className="text-sm text-muted-foreground">
                We partner with leading manufacturers to bring you authentic products. Expert curation, secure payments
                powered by Stripe, and fast shipping with order tracking.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CustomizationSection
