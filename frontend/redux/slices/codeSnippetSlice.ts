import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";

interface ICodeSnippet {
  _id: string;
  title: string;
  code: string;
  folderId: string;
}

interface CodeSnippetState {
  codeSnippet: ICodeSnippet[];
  publicCodeSnippet: ICodeSnippet[];

  status: "idle" | "loading" | "failed";
}

const initialState: CodeSnippetState = {
  codeSnippet: [],
  publicCodeSnippet: [],
  status: "idle",
};

export const codeSnippetSlice = createSlice({
  name: "codeSnippetFolder",
  initialState,
  reducers: {
    setCodeSnippet: (state, actions) => {
      state.codeSnippet = actions.payload.data;
      localStorage.setItem("lastOpenFolderId", actions.payload.folderId);
    },

    setPublicCodeSnippet: (state, actions) => {
      state.publicCodeSnippet = actions.payload;
    },

    setStatus: (state, actions) => {
      state.status = actions.payload;
    },
    // getFolder: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { setCodeSnippet, setStatus, setPublicCodeSnippet } =
  codeSnippetSlice.actions;

export const fetchCodeSnippet = (folderId: string): any => {
  return async function fetchFolderThunk(dispatch: Dispatch): Promise<void> {
    try {
      dispatch(setStatus("loading"));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/code-snippet/folder/${folderId}`
      );
      const data = await response.json();
      if (data.success) {
        dispatch(
          setCodeSnippet({
            data: data.snippets,
            folderId: folderId,
          })
        );
        dispatch(setStatus("idle"));
      }
    } catch (error) {
      console.error("Error fetching code snippets:", error);
      dispatch(setStatus("failed"));
    }
  };
};

export const fetchPublicCodeSnippet = () => {
  return async function fetchFolderThunk(dispatch: Dispatch): Promise<void> {
    try {
      dispatch(setStatus("loading"));
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/code-snippet?public_snippet=true`
      );
      const data = await response.json();
      if (data.success) {
        dispatch(setPublicCodeSnippet(data.snippets));
        dispatch(setStatus("idle"));
      }
    } catch (error) {
      console.error("Error fetching code snippets:", error);
      dispatch(setStatus("failed"));
    }
  };
};
