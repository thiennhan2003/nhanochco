import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import cors from "cors";
import compression from "compression";

//import router
import userRoute from "./routes/v1/userRoute";
import restaurantRoute from "./routes/v1/restaurantRoute";
import menuItemRoute from "./routes/v1/menuItem.Route";
import postRoute from "./routes/v1/postRoute";
import commentPostRoute from "./routes/v1/commentPost.Route";
import commentMenuRoute from "./routes/v1/commentMenu.Router";
import commentRestaurantRoute from "./routes/v1/commentRestaurant.Route";
import categoryRestaurantRoute from "./routes/v1/categoryRestaurant.Route";
import categoryMenuItemRoute from "./routes/v1/categoryMenuItem.Route";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());

// Routes
app.get('/', (req, res) => {
    res.send("Welcome");
});
app.use("/api/v1", userRoute);
app.use("/api/v1", restaurantRoute);
app.use("/api/v1", menuItemRoute);
app.use("/api/v1", postRoute);
app.use("/api/v1", commentPostRoute);
app.use("/api/v1", commentMenuRoute);
app.use("/api/v1", commentRestaurantRoute);
app.use("/api/v1", categoryRestaurantRoute);
app.use("/api/v1", categoryMenuItemRoute);
app.use(cors());
// Error handling
app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    res.status(statusCode).json({ 
        statusCode: statusCode, 
        message: err.message
    });
});

export default app;