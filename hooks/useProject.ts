import { ProjectType } from "@/schema/project";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ProjectResponse {
  success: boolean;
  data: ProjectType[];
}

export const useProjects = () => {
  return useQuery<ProjectType[]>({
    queryKey: ["projects"],

    queryFn: async () => {
      const res = await axios.get<ProjectResponse>("/api/projects");
      if (!res.data.success) {
        throw new Error("Failed to fetch projects");
      }
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const UseAddToCart = () => {
  return useMutation({
    mutationKey: ["addToCart"],

    mutationFn: async (project: ProjectType) => {
      const res = await axios.post("/api/cart", {
        project_price: project.price,
        tax: project.price * 0.1,
        sessionCartId: "some-session-cart-id",
        userId: "some-user-id",
      });

      return res.data;
    },
  });
};
