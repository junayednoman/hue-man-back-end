export type TCategory = {
  image: string;
  name: string;
  status: "active" | "inactive";
  is_deleted?: boolean;
};
