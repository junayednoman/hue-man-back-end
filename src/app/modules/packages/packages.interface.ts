export const packageKeys = ["essential", "pro", "collective"] as const;

export type TPackageKey = (typeof packageKeys)[number];
export type TBillingInterval = "monthly" | "yearly";

export type TPackage = {
  key: TPackageKey;
  name: string;
  monthly_price: number;
  yearly_price: number;
  sub_user_limit: number;
  is_active: boolean;
};
