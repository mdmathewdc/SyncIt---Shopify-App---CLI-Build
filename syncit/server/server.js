import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { TEST_COOKIE_NAME, verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
let currentShop;
var toastResponse;

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.October20,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};

app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        console.log(ctx.state.shopify);
        const { shop, accessToken, scope } = ctx.state.shopify;
        currentShop = shop;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: "/webhooks",
          topic: "APP_UNINSTALLED",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  console.log("Node.js Server");

  router.get("/checkIfStoreExists", async (ctx) => {

    try {
      const response = await checkIfStoreExists(currentShop);
      ctx.response.body = JSON.stringify(response);
    }

    catch(error) {
      console.log(error);
    }

  });

  async function checkIfStoreExists(currentShop) {

    await mongoose.connect(process.env.MONGO_STOREDB_URI);

    const schema = new Schema(
      { 
        shop: String 
      },
      {
        versionKey: false // Prevent versioning for each document
      });

    let Shop;
    try {
      Shop = mongoose.model('stores');
    } catch (error) {
      Shop = mongoose.model('stores', schema);
    }

    const params = {};
    params.shop = currentShop;

    try {
        var mongoResponse = await Shop.find(params).clone();
    }
    catch {
      //If error
      console.log(error);
    }

    if (mongoResponse.length != 0) {
      toastResponse = "Store registered : " + currentShop;
    }
    else {
      //Insert shop name into DB
      let newEntry = new Shop(params).save();   //Enter shop name into MongoDB
      toastResponse =  "Store added : " + currentShop;
    }

    return toastResponse;
    // mongoose.connection.close();

  }

  router.get("/home", async (ctx) => {

    ctx.response.body = JSON.stringify("Home ROUTE...Node JS Server");
    insertIntoDatabase();

  });

  async function insertIntoDatabase(){
    
    const client = new MongoClient(process.env.MONGO_URI);
    
    try {
    // Connect to the MongoDB cluster
    await client.connect();
  
    // Make the appropriate DB calls and await them
    const collection = client.db("syncit_database").collection("all_bundles");
    await collection.insertOne( { item: "cool", qty: 27 } )
    } 
    catch (e) {
      console.error(e);
    } 
    finally {
      await client.close();
    }
  }

  router.post("/webhooks", async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear
  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
    }
  });

  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
