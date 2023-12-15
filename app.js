const { MongoClient } = require("mongodb");
const { ObjectId } = require('mongodb');
const uri = require("./atlas_uri");

const client = new MongoClient(uri);
const dbname = "senBooks";
const author_collection = "author"
const book_collection = "book"

const main = async (create, objectId) => {
    try {
      await client.connect()
      console.log(`Conectado a la base de datos 🌍. \nCadena de conexión completa: ${uri}`)
      if(create){
        let resultAuthor = await client.db(dbname).collection(author_collection).insertOne({
          name: "Isabel Angélica Allende Llona",
          nacionalidad: "chilena"
        })
        let author_Id = resultAuthor.insertedId;

        client.db(dbname).collection(book_collection).insertMany([
          {
            name: "La abuela Panchita",
            author_id: author_Id
          },
          {
            name: "Lauchas y lauchones, ratas y ratones",
            author_id: author_Id
          }]
        );
      } else {

        //Busca el autor por el ID del mismo
        const documentToFind = { _id: new ObjectId(objectId) }
        let findAuthor = await client.db(dbname).collection(author_collection).findOne(documentToFind)
        console.log(findAuthor)

        //Libros pertenecientes al autor
        let findBooks = await client.db(dbname).collection(book_collection).aggregate([
          { $match : { author_id: new ObjectId(objectId) } },
          {
            $lookup:{
              from: "author",
              localField: "author_id",
              foreignField: "_id",
              as: "loremlorem"
            }
          }
        ]).toArray();
        console.log(findBooks);

      }
    } catch (err) {
      console.error(`Error al intentar conectar con la base de datos: ${err}`)
    } finally {
      await client.close()
    }
  }
  
  main(false, "657c94e7f61feadfca763365")