import express from "express";
import fs from "fs";
import uuid4 from "uuid4";
import multer from 'multer';

const router = express.Router();
router.use(express.json());
const upload = multer({ dest: "uploads/" });

// const closetFilePath = "./data/closet.json";

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
        // console.log(itemId)
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


//POST -> Add/Upload a New Item
router.post("/item",upload.single('image'), (req, res) => {
  try {
    const itemsData = readCloset();
    const image = req.file;

    const newItem = {
      id: itemsData.length + 1,
      name: req.body.name,
      image: `http://localhost:8080/uploads/${image.filename}`,
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

//DELETE -> delete an item

router.delete("/item/:id", (req, res) => {
  try {
    const itemsData = readCloset();
    const itemId = parseInt(req.params.id);

    const itemIndex = itemsData.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).send("Item not found");
    }

    itemsData.splice(itemIndex, 1);
    writeCloset(itemsData);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).send("Internal Server Error");
  }
})

//PUT -> update and item
router.put("/item/:id",upload.single('image'), (req, res) =>{
  try {
    const itemsData = readCloset();
    const itemId = parseInt(req.params.id);

    const itemIndex = itemsData.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return res.status(404).send("Item not found");
    }

    const updatedItem = {
      ...itemsData[itemIndex],
      name: req.body.name,
      category: req.body.category,
      color: req.body.color,
      season: req.body.season,
      brand: req.body.brand,
    };

    itemsData[itemIndex] = updatedItem;
    writeCloset(itemsData);
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).send("Internal Server Error");
  }
} )


export default router;