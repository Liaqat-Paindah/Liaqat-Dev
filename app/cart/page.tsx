import { Suspense } from "react";
import Loading from "../loading";
import Cart from "@/components/views/cart";
import { ProjectType } from "@/schema/project";

export default function CartPage() {
  const project = '';
  return <Suspense fallback={<Loading></Loading>}>
    <Cart project={project as unknown as ProjectType}
    ></Cart>
  </Suspense>;
}
