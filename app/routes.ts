import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/language-redirect.tsx"),

  // Client content
  route("/:lang", "routes/home.tsx"),

  // Admin dashboard
  route("/login", "./routes/login.tsx"),
  route("/dashboard", "./routes/dashboard-redirect.tsx"),
  route("/:lang/dashboard", "routes/dashboard.tsx", [
    // Menus
    index("routes/dashboardManageMenu.tsx"),

    // Galleries
    route("gallery", "routes/dashboardManageGallery.tsx"),
    route("gallery/:galleryId", "routes/dashboardManageGalleryContent.tsx", [
      // Delete one image
      route(":imageId", "routes/removeOneItemFromGallery.ts"),
    ]),

    // Manage menu and its items
    route("menu/:menuId", "routes/dashboardManageMenuContent.tsx", [
      // Dishes list and new dish button
      index("routes/dishesList.tsx"),

      // New dish route
      route("new-dish", "routes/newDish.tsx"),
    ]),

    // Manage locations
    route("location", "routes/dashboardManageLocation.tsx"),
    route("location/:id", "routes/singleLocation.ts"),

    // Change password
    route("change-password", "routes/changePassword.tsx"),
  ]),

  // Get image for menu
  route("/resources/menu-item-image/:name", "routes/getMenuItemImage.ts"),

  // Get image for gallery
  route("/resources/gallery-item-image/:name", "routes/getGalleryItemImage.ts"),

  // Log out
  route("/logout", "routes/logout.ts"),
] satisfies RouteConfig;
