import mongoose from "mongoose"

const VictorySchema = new mongoose.Schema(
    {
        user: { type: String, required: true },
        date: { type: Date, required: true },
        pastries: { type: Array, required: true },
    },
    { collection: 'victories' }
)

const Victory = mongoose.model('victories', VictorySchema)

export default Victory;