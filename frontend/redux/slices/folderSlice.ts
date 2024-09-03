import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";

interface IFolder {
  _id: string;
  name: string;
  subfolders: IFolder[];
  parentId: string;
}

interface FolderState {
  folders: IFolder[];
  status: "idle" | "loading" | "failed";
  selectedFolderId: string | null;
}

const initialState: FolderState = {
  folders: [],
  status: "idle",
  selectedFolderId: null,
};

export const folderSlice = createSlice({
  name: "codeSnippetFolder",
  initialState,
  reducers: {
    setFolders: (state, actions) => {
      state.folders = actions.payload;
    },
    selectFolder: (state, action) => {
      state.selectedFolderId = action.payload; // Update the selected folder ID in the state
    },
    // getFolder: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { setFolders, selectFolder } = folderSlice.actions;

export const fetchFolder = (): any => {
  return async function fetchFolderThunk(dispatch: Dispatch): Promise<void> {
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/folder`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_user_access_token")}`,
          },
        }
      );
      const folders = await data.json();
      console.log(folders);
      dispatch(setFolders(folders.folders));
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };
};
