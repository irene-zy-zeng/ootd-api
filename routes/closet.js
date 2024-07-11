import express from "express";
import fs from "fs";
import uuid4 from "uuid4";

const router = express.Router();
router.use(express.json());

const readCloset = () => {
  const closetFile = fs.readFileSync("./data/closet.json");
  const items = JSON.parse(closetFile);
  return items;
};

const writeCloset = (data) =>{
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync("./data/closet.json", stringifiedData);
}

//Get all items
router.get("/item", (_req, res) => {
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

//GET single item
router.get("/item/:id",(req, res)=>{
    try {
        const itemsData = readCloset();
        const itemId = req.params.id;
        console.log(itemId)
        const singleItemData = itemsData.find((item) => item.id == itemId);
        if (!singleItemData) {
          return res.status(404).send("Item not found");
        }
        res.json(singleItemData);
    } catch (error) {
        console.error("Error reading albums file", error);
        res.status(500).send("Internal Server Error");
    }
})

export default router;

//POST -> Add/Upload a New Item
router.post("/item",(req,res)=>{
  try {
    const itemsData = readCloset();

    const newItem = {
      id: uuid4(),
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      color: req.body.color,
      season: req.body.season,
      brand: req.body.brand,
    };

    itemsData.push(newItem);
    writeCloset(itemsData);

    res.status(201).json(newItem); 
  } catch (error) {
    console.error("Error adding new item:", error);
    res.status(500).send("Internal Server Error");
  }

})