import express from "express";
import cors from "cors";
import "dotenv/config";
import closetRoutes from './routes/closet.js';
import outfitRoutes from "./routes/outfit.js";

const app = express();

let { PORT, CROSS_ORIGIN } = process.env;
PORT = PORT || 8081;

app.use(cors({ origin: CROSS_ORIGIN }));
app.use(express.json());
app.use(express.static("public"));
app.use('/uploads', express.static("uploads")); 

app.use("/", closetRoutes);
app.use("/", outfitRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});