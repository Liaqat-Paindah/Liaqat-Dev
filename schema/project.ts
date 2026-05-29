import * as Yup from "yup";

// ================= PROJECT SCHEMA =================

export const ProjectSchema = Yup.object({
  id: Yup.string().required("Project Id is required"),

  project_name: Yup.string().required("Project Name is required"),
  project_client: Yup.string().required("Project Client is required"),

   project_link: Yup.string()
    .url("Enter a valid URL")
    .required("Project Link is required"),

  project_desc: Yup.string().required("Project description is required"),

  project_skills: Yup.string().required("Project skills is required"),

  project_tags: Yup.string().required("Project tags is required"),

  image: Yup.string().required("Project Image is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),
});

// ================= CART SCHEMA =================

export const CartSchema = Yup.object({
  project_price: Yup.number()
    .typeError("Item Price must be a number")
    .min(0, "Item Price cannot be negative")
    .required("Item Price is required"),
  tax: Yup.number()
    .typeError("Tax must be a number")
    .min(0, "Tax cannot be negative")
    .required("Tax is required"),

  sessionCartId: Yup.string().required("Session Cart Id is required"),

  userId: Yup.string().required("User Id is required"),
});

// ================= TYPES =================

export type ProjectType = Yup.InferType<typeof ProjectSchema>;

export type CartType = Yup.InferType<typeof CartSchema>;
