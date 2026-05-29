'use client';
import { UseAddToCart } from "@/hooks/useProject";
import { ProjectType } from "@/schema/project";
import { toast } from "sonner";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingCart } from "lucide-react";

interface AddToCartProps {
  project: ProjectType;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AddToCart = ({
  project,
  variant = "default",
  size = "md",
  className = "",
}: AddToCartProps) => {
  const { mutate, isPending } = UseAddToCart();
  const router = useRouter();

  const handleAddToCart = () => {
    if (isPending) return;

    mutate(project);
    toast.success(`Project added to cart`, {
      description: "Project successfully added to your cart",
      action: (
        <ToastAction
          className="bg-primary text-white hover:bg-primary/90 cursor-pointer"
          altText="Go To Cart"
          onClick={() => router.push("/cart")}
        >
          View Cart
        </ToastAction>
      ),
      duration: 5000,
    });
  };

  const variantStyles = {
    default: "bg-primary text-white hover:bg-primary/90 shadow-sm",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "text-primary hover:bg-primary/10",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2",
  };

  return (
    <button onClick={handleAddToCart} className="cursor-pointer">
      <>
        <span>Add to Cart</span>
      </>
    </button>
  );
};

export default AddToCart;
