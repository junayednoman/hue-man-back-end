import { Router } from "express";
import authRouters from "../modules/auth/auth.routes";
import adminRouters from "../modules/admin/admin.routes";
import userRouters from "../modules/user/user.routes";
import categoryRouters from "../modules/category/category.routes";
import cardRouters from "../modules/card/card.routes";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: authRouters },
  { path: "/admins", route: adminRouters },
  { path: "/users", route: userRouters },
  { path: "/categories", route: categoryRouters },
  { path: "/cards", route: cardRouters },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
