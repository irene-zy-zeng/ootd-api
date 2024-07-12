import express from "express";
import fs from "fs";
import multer from "multer";

const router = express.Router();
router.use(express.json());
const upload = multer({ dest: "uploads/" });

const readOutfit = () => {
  const outfitFile = fs.readFileSync("./data/outfit.json");
  const items = JSON.parse(outfitFile);
  return items;
};

const writeOutfit = (data) => {
  const stringifiedData = JSON.stringify(data);
  fs.writeFileSync("./data/outfit.json", stringifiedData);
};

//Get all outfit
router.get("/outfit", (_req, res) => {
    try {
      const outfitsData = readOutfit();
      // console.log(outfitsData);
      const dataServerd = outfitsData.map((outfit) => {
        return {
          id: outfit.id,
          image: outfit.image,
        };
      });
      res.json(dataServerd);
    } catch (error) {
      console.error("Error reading albums file", error);
      res.status(500).send("Internal Server Error");
    }
  });

//POST -> Add/Upload a New Outfit
router.post("/outfit",upload.single('image'), (req, res) => {
    try {
      const outfitsData = readOutfit();
      const image = req.file;
  
      const newOutfit = {
        id: outfitsData.length + 1,
        image: `http://localhost:8080/uploads/${image.filename}`,
      };
  
      outfitsData.push(newOutfit);
      writeOutfit(outfitsData);
  
      res.status(201).json(newOutfit); 
    } catch (error) {
      console.error("Error adding new outfit:", error);
      res.status(500).send("Internal Server Error");
    }
  
  })

export default router;
