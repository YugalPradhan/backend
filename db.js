const mongoose=require("mongoose");
const mongoURI="mongodb+srv://pradhanyugal31:IpeVpAlnY9TcwoNi@cluster0.uaxigto.mongodb.net/?retryWrites=true&w=majority"
const connectToMongo=()=>{
    mongoose
    .connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then((data) => {
        console.log(`Mongodb connected with server`);
      });
}
module.exports=connectToMongo;