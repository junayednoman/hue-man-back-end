import { Router } from "express";
import authRouters from "../modules/auth/auth.routes";
import adminRouters from "../modules/admin/admin.routes";
import userRouters from "../modules/user/user.routes";
import categoryRouters from "../modules/category/category.routes";
import cardRouters from "../modules/card/card.routes";
import deskRoutes from "../modules/desk/desk.routes";
import storyRouters from "../modules/story/story.routes";
import faqRouters from "../modules/faq/faq.routes";
import privacyRoutes from "../modules/privacy/privacy.routes";
import termsRoutes from "../modules/terms/terms.routes";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: authRouters },
  { path: "/admins", route: adminRouters },
  { path: "/users", route: userRouters },
  { path: "/categories", route: categoryRouters },
  { path: "/cards", route: cardRouters },
  { path: "/desk-cards", route: deskRoutes },
  { path: "/stories", route: storyRouters },
  { path: "/faqs", route: faqRouters },
  { path: "/privacy", route: privacyRoutes },
  { path: "/terms", route: termsRoutes },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;