import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IImages, TImageID, TImages } from "./models";
import { deleteImage, getImages } from "../../services/api";

const initialState: IImages = {
  images: [],
  loading: false,
  error: "",
  currentPage: 1,
  filteredImages: [],
  isFilterByAlbum: false,
};
export type AuthError = {
  error: any;
};

export const fetchImages = createAsyncThunk("images/fetchImages", async () => {
  try {
    const response = await getImages();
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
  }
});

export const deleteImages = createAsyncThunk<
  any,
  TImageID,
  { rejectValue: AuthError }
>("images/deleteImages", async (imageID, thunkAPI) => {
  try {
    const response = await deleteImage(imageID);
    if (response.status === 200) {
      return imageID;
    }
  } catch (error: any) {
    if (!error.response) {
      throw error;
    }
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Then, handle actions in reducers:
export const getImagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    setCurrentPageCount: (state, { payload }) => {
      state.currentPage = payload;
    },
    filterByAlbumId: (state, { payload }) => {
      state.filteredImages = state.images?.filter(
        (item: TImages) => payload === item.albumId
      );
      state.isFilterByAlbum = true;
    },
    setFiltered: (state, { payload }) => {
      state.isFilterByAlbum = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchImages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchImages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.images = payload;
    });
    builder.addCase(fetchImages.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });

    builder.addCase(deleteImages.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteImages.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.images = state.images.filter((item) => item.id !== payload);
    });
    builder.addCase(deleteImages.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    });
  },
});

export const { setCurrentPageCount, filterByAlbumId, setFiltered } =
  getImagesSlice.actions;

export default getImagesSlice.reducer;
