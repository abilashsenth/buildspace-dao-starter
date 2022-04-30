import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

import { exit } from "process";

(async ()=>{
    try {
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            //The collection name, MemeCollection, is the default
            name: "MemeDAO Membership",
            //a description of the collection
            description: "A DAO for meme lovers",
            //the image that will be held on our NFT, that is the fun part
            image: readFileSync("scripts/assets/pepe.jpeg"),
            //we need to pass in the address of the person who will be recieving the proceeds from the same of nft
            //since we plan not charge for the meme, we will just send the proceeds to 0x0

            primary_sale_recipient: AddressZero,
        });

        //this initialization returns the address of our contract. we use this to initializethe contract on the thirdweb sdk
        const editionDrop = sdk.getEditionDrop(editionDropAddress);
        //with this, we can get the metadata of the contract
        const metadata = await editionDrop.metadata.get();

        console.log("successfully deployed edition drop");

        console.log(`
        --------------------------------------------------
        Contract Address: ${editionDropAddress}
        --------------------------------------------------
        Name: ${metadata.name}
        --------------------------------------------------
        Description: ${metadata.description}
        --------------------------------------------------
        Image: ${metadata.image}
        --------------------------------------------------
        `);

    } catch (error) {
        console.log("an error occured", error);
        exit(1);
    }
})();