export type TUserProfile = {
  image: string;
  name: string;
  email: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  is_deleted: boolean;
  is_blocked: boolean;
};
