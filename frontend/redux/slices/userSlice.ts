import { createSlice } from "@reduxjs/toolkit";
import type { Dispatch, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface IUser {
  _id: string;
  username: string;
  email: string;
}

interface FolderState {
  userDetails: IUser;
  status: "idle" | "loading" | "failed";
  authenticate: boolean;
}

const initialState: FolderState = {
  userDetails: { _id: "", username: "", email: "" },
  status: "idle",
  authenticate: false,
};

export const userSlice = createSlice({
  name: "userDetails",
  initialState,
  reducers: {
    setUserDetails: (state, actions) => {
      state.userDetails = actions.payload;
      state.authenticate = true;
    },
    setUserAuthOrNot: (state, actions) => {
      state.authenticate = actions.payload;
    },
    // selectFolder: (state, action) => {
    //   state.selectedFolderId = action.payload; // Update the selected folder ID in the state
    // },
    // getFolder: (state) => {},
  },
});

// Action creators are generated for each case reducer function
export const { setUserDetails, setUserAuthOrNot } = userSlice.actions;

export const fetchUserDetails = (): any => {
  return async function fetchUserThunk(dispatch: Dispatch): Promise<void> {
    dispatch(setUserAuthOrNot(false));
    try {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL_HOST}/api/v1/auth/user`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            cookie: Cookies.get("auth_user_access_token") || "",
          },
        }
      );
      const user = await data.json();
      console.log(user);
      if (user.status) {
        dispatch(setUserDetails(user.user));
        dispatch(setUserAuthOrNot(true));
      } else {
        dispatch(setUserAuthOrNot(false));
      }
    } catch (error) {
      console.log(`error: ${error}`);
    }
  };
};
