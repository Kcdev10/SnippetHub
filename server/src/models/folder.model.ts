import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  subfolders: IFolder[];
  parentId: mongoose.Types.ObjectId | null;
  owner: mongoose.Types.ObjectId;
}

const folderSchema = new Schema<IFolder>({
  name: { type: String, required: true },
  subfolders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
    },
  ],
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null, // Default to null if no parent
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

const Folder = mongoose.model<IFolder>('Folder', folderSchema);

export default Folder;
