import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0xbfe03FDEcbE0ebC4392bC58d1f00BdE7628365c4");

(async () => {
  try {
    const allRoles = await token.roles.getAll();
    console.log("👀 Roles that exist right now:", allRoles);

    //revoke all the superpowers your wallet had over the erc20 token
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🔥 All roles revoked!" + "\n" + "roles after revoking:",
      await token.roles.getAll()
    );
  } catch (error) {
    console.log("failed to revoke ourselves from the DAO treasury" + error);
  }
})();
