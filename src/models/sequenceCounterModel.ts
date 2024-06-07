import mongoose, { Schema, Document, model } from 'mongoose';

interface ISequenceCounter extends Document {
  sequence_value: number;
}

const SequenceCounterSchema = new Schema<ISequenceCounter>({
  sequence_value: { type: Number, default: 0 }
});

const SequenceCounter = model<ISequenceCounter>('SequenceCounter', SequenceCounterSchema);

export default SequenceCounter;
