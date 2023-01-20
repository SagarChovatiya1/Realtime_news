import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const saveNewsIds = createAsyncThunk('SAVE_NEWS_IDS',
  async () => {
    const response = await axios.get(
      `https://hacker-news.firebaseio.com/v0/topstories.json`
    );
    const newsIds: number[] = response.data;
    return newsIds
  })


export interface IInitState {
  idsList: number[]
  idsLoading: boolean
  idsError: string
}

const initialState: IInitState = {
  idsList: [],
  idsLoading: false,
  idsError: '',
}

export const idsList = createSlice({
  name: 'idsList',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Подгрузка списка id новостей (нужно для того, чтобы потом его резать и подгружать по частям)
      .addCase(saveNewsIds.pending, (state) => {
        state.idsLoading = true;
      })
      .addCase(saveNewsIds.rejected, (state, action) => {
        state.idsLoading = false;
        state.idsError = action.error.message!;
      })
      .addCase(saveNewsIds.fulfilled, (state, action) => {
        state.idsList = action.payload
        state.idsLoading = false;
      })
  }
})
