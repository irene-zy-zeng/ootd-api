import express from "express";
import fs from "fs";

const router = express.Router();

const readCloset = () => {
  const closetFile = fs.readFileSync("./data/closet.json");
  const items = JSON.parse(closetFile);
  return items;
};

//Get all items
router.get("/closet", (_req, res) => {
  try {
    const itemsData = readCloset();
    // console.log(itemsData);
    const dataServerd = itemsData.map((item) => {
      return {
        id: item.id,
        name: item.name,
        image: item.image,
        category: item.category,
        color: item.color,
        season: item.season,
        brand: item.brand
      };
    });
    res.json(dataServerd);
  } catch (error) {
    console.error("Error reading albums file", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
