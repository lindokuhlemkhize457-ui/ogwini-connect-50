import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Copy, CheckCircle, CreditCard, Mail, Phone, User, Package, AlertCircle } from "lucide-react";

const merchandise = [
  { id: 1, name: "School Blazer", price: 850, sizes: ["S", "M", "L", "XL"], image: "🧥" },
  { id: 2, name: "School Tie", price: 120, sizes: ["Standard"], image: "👔" },
  { id: 3, name: "School Shirt", price: 200, sizes: ["S", "M", "L", "XL"], image: "👕" },
  { id: 4, name: "School Pants/Skirt", price: 350, sizes: ["28", "30", "32", "34", "36"], image: "👖" },
  { id: 5, name: "School Jersey", price: 450, sizes: ["S", "M", "L", "XL"], image: "🧶" },
  { id: 6, name: "School Bag", price: 550, sizes: ["Standard"], image: "🎒" },
];

const bankDetails = {
  bankName: "First National Bank",
  accountName: "Ogwini High School",
  accountNumber: "62XXXXXXXX",
  branchCode: "250655",
  reference: "MERCH-",
};

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export default function MerchandisePage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
  });

  const addToCart = (item: typeof merchandise[0]) => {
    const size = selectedSizes[item.id];
    if (!size) {
      toast({
        title: "Select a size",
        description: "Please select a size before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const existing = cart.find((c) => c.id === item.id && c.size === size);
    if (existing) {
      setCart(cart.map((c) => (c.id === item.id && c.size === size ? { ...c, quantity: c.quantity + 1 } : c)));
    } else {
      setCart([...cart, { ...item, size, quantity: 1 }]);
    }

    toast({
      title: "Added to cart",
      description: `${item.name} (${size}) added to your cart.`,
    });
  };

  const removeFromCart = (id: number, size: string) => {
    setCart(cart.filter((c) => !(c.id === id && c.size === size)));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Bank details copied to clipboard.",
    });
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => /^(\+27|0)\d{9}$/.test(phone.replace(/\s/g, ""));

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    if (!validatePhone(formData.phone)) {
      toast({ title: "Invalid Phone", description: "Please enter a valid SA phone number.", variant: "destructive" });
      return;
    }

    setOrderComplete(true);
    toast({
      title: "Order Submitted!",
      description: "Please complete payment and send proof to our email.",
    });
  };

  const orderReference = `${bankDetails.reference}${Date.now().toString().slice(-6)}`;

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 lg:py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              School Store
            </span>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Official <span className="text-primary">Merchandise</span>
            </h1>
            <p className="text-muted-foreground">
              Purchase official Ogwini school merchandise online. Complete payment via EFT and send proof of payment.
            </p>
          </div>
        </div>
      </section>

      {!showCheckout ? (
        <>
          {/* Products Grid */}
          <section className="py-12 lg:py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {merchandise.map((item) => (
                  <div key={item.id} className="glass-card p-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 text-4xl">
                      {item.image}
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground text-center mb-2">
                      {item.name}
                    </h3>
                    <p className="text-center text-primary font-bold text-xl mb-4">
                      R{item.price.toFixed(2)}
                    </p>
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">Select Size:</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {item.sizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSizes({ ...selectedSizes, [item.id]: size })}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                              selectedSizes[item.id] === size
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => addToCart(item)}>
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <section className="py-8 bg-card border-t border-border">
              <div className="container mx-auto px-4">
                <div className="glass-card p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-lg text-foreground">Your Cart ({cart.length} items)</h3>
                  </div>
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Size: {item.size} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-foreground">R{(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-destructive text-sm hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <p className="text-lg font-bold text-foreground">Total: R{totalAmount.toFixed(2)}</p>
                    <Button onClick={() => setShowCheckout(true)}>Proceed to Checkout</Button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="py-12 lg:py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            {!orderComplete ? (
              <div className="glass-card p-8">
                <h2 className="font-heading text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Complete Your Order
                </h2>

                <form onSubmit={handleSubmitOrder} className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      placeholder="0XX XXX XXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentId">Student ID (Optional)</Label>
                    <Input
                      id="studentId"
                      value={formData.studentId}
                      onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                      placeholder="If applicable"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowCheckout(false)}>
                      Back to Cart
                    </Button>
                    <Button type="submit" className="flex-1">Submit Order</Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="glass-card p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-foreground">Order Submitted!</h2>
                  <p className="text-muted-foreground mt-2">Complete payment using the bank details below</p>
                </div>

                <div className="bg-secondary rounded-xl p-6 space-y-4 mb-6">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Bank Details
                  </h3>
                  {[
                    { label: "Bank", value: bankDetails.bankName },
                    { label: "Account Name", value: bankDetails.accountName },
                    { label: "Account Number", value: bankDetails.accountNumber },
                    { label: "Branch Code", value: bankDetails.branchCode },
                    { label: "Reference", value: orderReference },
                    { label: "Amount", value: `R${totalAmount.toFixed(2)}` },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground text-sm">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{item.value}</span>
                        <button onClick={() => copyToClipboard(item.value)} className="text-primary hover:text-primary/80">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Send Proof of Payment</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        After completing payment, send proof to <strong className="text-foreground">orders@ogwini.edu.za</strong> with your order reference: <strong className="text-foreground">{orderReference}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </Layout>
  );
}
