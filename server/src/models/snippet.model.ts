import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  code: string;
  folderId: mongoose.Types.ObjectId;
  isPublic: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
}

const snippetSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Reference to the user who owns the snippet
    },
  },
  {
    timestamps: true,
  }
);

const Snippet = mongoose.model<ISnippet>('Snippet', snippetSchema);

export default Snippet;
