const { default:mongoose} = require("mongoose");

const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected Sucessfully");
    } catch (error) {
        console.log("DAtabase error");
    }
};
module.exports = dbConnect;
