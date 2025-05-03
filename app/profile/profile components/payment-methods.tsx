import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Plus, Trash2 } from "lucide-react"

interface PaymentMethodsProps {
  paymentMethods: any[]
}

export default function PaymentMethods({ paymentMethods }: PaymentMethodsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment options</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add New
        </Button>
      </CardHeader>
      <CardContent>
        {paymentMethods.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium">No payment methods</h3>
            <p className="text-gray-500 mt-2">Add a payment method to speed up checkout</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {method.type === "Credit Card" ? (
                      <div className="bg-gray-100 p-2 rounded-md">
                        <CreditCard className="h-6 w-6" />
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-2 rounded-md">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.5 10.5H17.5M12 3V21M8.5 7.5H15.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">
                          {method.type === "Credit Card" ? `•••• •••• •••• ${method.last4}` : method.email}
                        </h3>
                        {method.default && (
                          <Badge variant="outline" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.type === "Credit Card" && (
                        <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.default && (
                      <Button variant="outline" size="sm">
                        Set as Default
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
