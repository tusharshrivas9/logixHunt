const mongoose  = require("mongoose")

mongoose.connect(process.env.MONGO_DB)
.then(()=>{
    console.log("connected to server sucessfully");
})
.catch((error)=>{
console.log("error in db", error);
})