import mongoose from "mongoose";

const pastrySchema = new mongoose.Schema({
  name: String,
  image: String,
  stock: Number,
  quantityWon: Number 
});

const Pastry = mongoose.model('pastries', pastrySchema);

//module.exports = Pastry;
export default Pastry;