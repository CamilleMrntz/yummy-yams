import mongoose from "mongoose"

const WinnersSchema = new mongoose.Schema(
    {
        userName: { type: String, required: true },
        email: { type: String, required: true },
        date: { type: Date, required: true },
        numberOfPastriesWon: { type: Number, required: true },
        pastries: { type: Array, required: true },
    },
    { collection: 'winners' }
)

const Winner = mongoose.model('winners', WinnersSchema)

export default Winner;