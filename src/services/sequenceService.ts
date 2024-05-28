import SequenceCounter from '../models/sequenceCounterModel';

class SequenceService {
  static async getNextSequenceValue(sequenceName: string): Promise<number> {
    const sequenceDocument = await SequenceCounter.findByIdAndUpdate(
      sequenceName, // use _id to find the document
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    ).exec();
    
    if (!sequenceDocument) {
      throw new Error('Unable to fetch or create the sequence document');
    }
    
    return sequenceDocument.sequence_value;
  }
}

export default SequenceService;
