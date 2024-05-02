import mongoose from "mongoose";

const pastrySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    stock: Number,
    quantityWon: Number 
  },
  { collection: 'pastries' }
)

const Pastry = mongoose.model('pastries', pastrySchema);

export default Pastry;