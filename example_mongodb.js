const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const uri = require("./atlas_uri");

const client = new MongoClient(uri);
const dbname = "senBooks";
const orders_collection = "orders"
const inventory_collection = "inventory"

const main = async (create) => {
    try {
      await client.connect()
      console.log(`Conectado a la base de datos 🌍. \nCadena de conexión completa: ${uri}`)
      if(create){
        await client.db(dbname).collection(orders_collection).insertMany( [
          { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
          { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
          { "_id" : 3  }
        ] )
        await client.db(dbname).collection(inventory_collection).insertMany( [
          { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
          { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
          { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
          { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
          { "_id" : 5, "sku": null, "description": "Incomplete" },
          { "_id" : 6 }
        ] )
      } else {
        var result = await client.db(dbname).collection(orders_collection).aggregate( [
          { $match : { item : "pecans" } },
          {
            $lookup:
              {
                from: "inventory",
                localField: "item",
                foreignField: "sku",
                as: "inventory_docs"
              }
          }
        ] ).toArray();
        console.log(result);
      }
    } catch (err) {
      console.error(`Error al intentar conectar con la base de datos: ${err}`)
    } finally {
      await client.close()
    }
  }
  
  main(false)