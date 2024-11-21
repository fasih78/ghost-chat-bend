const mongoose = require ('mongoose');
require('dotenv').config()


const connectdb=  ()=>{
    mongoose.set("strictQuery", false);
    mongoose.set("debug", true);
    mongoose.connect(process.env.DABATASE_URL,{
    }).then((response)=>{
        console.log("Database Connected on port ", mongoose.connection.port);
    })
    .catch((err) => {
        console.log(err);
      });
}

module.exports = connectdb;