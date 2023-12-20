const express = require("express")
const app = express()
const dotenv = require("dotenv")
dotenv.config()
require("./connections/db")
const routes = require("./routes/routers")


const port = process.env.PORT || 3450

app.use(express.json())
app.use("/api",routes)

app.listen(port,()=>{
    console.log(`listining to port ${port}`);
})