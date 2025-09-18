"use client";
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Products } from "@/types/products";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Products | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [prevQuantity, setPrevQuantity] = useState(1); // Track previous quantity
  const { addItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const router = useRouter();
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 2;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("keyboards")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching product:", error.message);
      } else {
        setProduct(data);
        console.log(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  console.log(product?.quantity);

  const images = product?.images || [product?.images];
  const selectedImage = images[selectedImageIndex];

  const reviews = product?.reviews || [];
  console.log(reviews);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setPrevQuantity(quantity); // Update previous quantity
      setQuantity(quantity - 1);
    }
  };
  const increaseQuantity = () => {
    if (quantity < (product?.quantity || 10)) {
      setPrevQuantity(quantity); // Update previous quantity
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product?.title} added to your cart`,
    });
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  const slideUpVariants = {
    initial: {
      y: "100%",
    },
    open: (i: number) => ({
      y: "0%",
      transition: { duration: 0.5, delay: 0.0 * i },
    }),
  };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="min-h-screen md:pb-16 pb-6 relative">
      <div className="hidden md:block w-fit sticky top-16 left-0 z-10">
        <Link
          href="/keyboards"
          className="inline-flex items-center text-sm bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md hover:bg-background"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to products
        </Link>
      </div>

      <div className="flex flex-col md:flex-row">
        <motion.div
          className="md:w-1/2 md:sticky md:top-[4.5rem] flex flex-col"
          style={{ height: `calc(100vh - ${headerHeight}px)` }}
        >
          <div className="h-full w-full flex-1">
            <div className="relative h-[70%] w-full">
              {product.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute md:size-10 size-7 left-[42%] md:left-4 -bottom-4 md:top-1/2 -translate-y-1/2 z-10 hover:bg-foreground/20 bg-foreground/10 backdrop-blur-xl "
                    onClick={prevImage}
                  >
                    <ChevronLeft className="md:size-5 size-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute  md:size-10 size-7 right-[42%] md:right-4 -bottom-4 md:top-1/2 -translate-y-1/2 z-10 hover:bg-foreground/20 bg-foreground/10 backdrop-blur-xl "
                    onClick={nextImage}
                  >
                    <ChevronRight className="md:size-5 size-3" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full -my-10"
                >
                  <Image
                    src={
                      typeof selectedImage === "string"
                        ? selectedImage
                        : "/placeholder.svg?height=800&width=800"
                    }
                    alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain p-4 md:p-8"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Thumbnail Selector */}
            {images.length > 1 && (
              <div className="p-4 flex justify-center">
                <div className="flex gap-2 overflow-x-auto max-w-full pb-2">
                  {images.map((image, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={cn(
                        "relative h-16 w-16 rounded-md overflow-hidden border-2 transition-all",
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-transparent hover:border-primary/50"
                      )}
                    >
                      <Image
                        src={
                          typeof image === "string"
                            ? image
                            : "/placeholder.svg?height=800&width=800"
                        }
                        alt={`${product.title} thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <div className="md:w-1/2 md:overflow-y-auto -mt-32 md:mt-0 px-4 md:px-8 md:pt-6 productDetailScroll">
          <div className="max-w-xl mx-auto">
            <motion.h1 className="text-3xl font-bold">
              {product.title.split("=").map((word: string, index: number) => (
                <span
                  key={index}
                  className="relative overflow-hidden inline-flex"
                >
                  <motion.span
                    variants={slideUpVariants}
                    custom={index}
                    initial="initial"
                    animate="open"
                    className="bg-transparent"
                  >
                    {word + " "}
                  </motion.span>
                </span>
              ))}
            </motion.h1>

            {/* price */}
            <motion.div className="text-2xl mt-2 flex flex-col items-start gap-0">
              {product.discount && (
                <span className="line-through text-red-500 opacity-70 text-base font-medium">
                  ৳ {product.price?.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold">
                ৳ {(product.price! * (1 - product.discount / 100)).toFixed(2)}
              </span>
            </motion.div>

            {/* Description */}
            <div className="mt-6 flex flex-col gap-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={showMoreDetails ? "expanded" : "collapsed"}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <motion.p
                    className="text-muted-foreground"
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {showMoreDetails
                      ? product.description
                      : product.description.split(" ").slice(0, 30).join(" ") +
                        "..."}
                  </motion.p>
                </motion.div>
              </AnimatePresence>

              <motion.span
                className="text-muted-foreground w-fit cursor-pointer flex items-center gap-2"
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={showMoreDetails ? "less" : "more"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    {showMoreDetails ? "Show Less" : "Show More"}
                    {showMoreDetails ? <ChevronUp /> : <ChevronDown />}
                  </motion.span>
                </AnimatePresence>
              </motion.span>
            </div>

            <Separator className="my-6" />
            {/* Stock and Quantity and Add to Cart and Add to Wishlist */}
            <div className="space-y-6">
              {product.quantity > 0 ? (
                <div className="flex items-center">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    In Stock
                  </Badge>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {product.quantity} available
                  </span>
                </div>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Out of Stock
                </Badge>
              )}

              <div className="flex items-center overflow-hidden">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={quantity}
                    initial={{
                      y: quantity > prevQuantity ? 100 : -100,
                      opacity: 0,
                    }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{
                      y: quantity > prevQuantity ? -100 : 100,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.05,
                      type: "spring",
                      stiffness: 400,
                      damping: 40,
                    }}
                    className="mx-4 w-8 text-center"
                  >
                    {quantity}
                  </motion.span>
                </AnimatePresence>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= (product.quantity || 10)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={quantity <= 1}
                  variant="default"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
              </div>
            </div>

            <Separator className="my-8" />
            <Tabs defaultValue="returns">
              <TabsList>
                <TabsTrigger value="returns">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Returns
                </TabsTrigger>
                <TabsTrigger value="shipping">
                  <Truck className="mr-2 h-4 w-4" />
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="returns" className="mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm space-y-4">
                    <p>
                      We accept returns within 30 days of delivery for unused
                      items in original packaging.
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium">To initiate a return:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Contact our customer service</li>
                        <li>Package the item securely</li>
                        <li>Ship to our returns center using provided label</li>
                      </ul>
                    </div>
                    <p>
                      Refunds will be processed within 5-7 business days after
                      receiving the returned item. Return shipping costs are the
                      responsibility of the customer unless the item was
                      defective.
                    </p>
                    <p>
                      For defective items, please contact us immediately and
                      we'll provide a prepaid return label. Warranty covers
                      manufacturing defects for 1 year from purchase date.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm space-y-4">
                    <p>
                      Free standard shipping on all orders over $150. Orders
                      under $150 have a flat rate of $15.
                    </p>
                    <div className="space-y-2">
                      <p className="font-medium">Delivery Options:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Standard Shipping: 5-7 business days</li>
                        <li>
                          Express Shipping: 2-3 business days (additional $25)
                        </li>
                        <li>
                          Next Day Delivery: Order by 2PM for next business day
                          (additional $45)
                        </li>
                      </ul>
                    </div>
                    <p>
                      We ship to all 50 US states and select international
                      destinations. International shipping costs and delivery
                      times vary by location. Import duties and taxes may apply
                      for international orders.
                    </p>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold">Product Specifications</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Brand</p>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Weight</p>
                  <p className="text-muted-foreground">1.2 kg</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Dimensions</p>
                  <p className="text-muted-foreground">30 × 10 × 5 cm</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Material</p>
                  <p className="text-muted-foreground">Premium quality</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Color</p>
                  <p className="text-muted-foreground">Various</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8">Customer Reviews</h2>
              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {currentReviews.map((review: any) => (
                    <motion.div
                      key={review.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img
                            src={review.user_image}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{review.user_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.time).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">{review.description}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button
                        key={i + 1}
                        variant={currentPage === i + 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="my-8 bg-gradient-to-r from-muted via-foreground/10 to-muted" />

      <div className="flex flex-col gap-4 px-4 md:px-8">
        <h2 className="text-xl font-semibold">Product Details:</h2>

        {product.information?.map((info: any, index: number) => (
          <div key={index} className="flex flex-col gap-1">
            <p className="font-medium">{info.feature}</p>
            <p className="text-muted-foreground">{info.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
