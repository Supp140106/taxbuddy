const mongoose = require('mongoose');

async function mongoconnect(url) {
    return mongoose.connect(url).then(console.log("Mongoose connected ")).catch(err => console.log(`Error Msg : ${err}`));
}

module.export = mongoconnect;