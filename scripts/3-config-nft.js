import { readFileSync } from "fs";
import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop(
  "0x35C0B57754eA4ddd61E3d7a14e08036d716AcC96"
);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Uni Coin",
        description: "This NFT will give you access to UniversityDAO!",
        image: readFileSync("scripts/assets/goldcoin.png"),
      },
    ]);
    console.log("🐸 NFT created in the drop!");
  } catch (error) {
    console.log(error);
  }
})();
