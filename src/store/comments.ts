import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IItem } from "hacker-news-api-types";

interface IInitState {
  commentsData: {
    [id: number]: IItem[]
  }
  loading: boolean
  fetchError: string
  count: number
}

const initialState: IInitState = {
  commentsData: {},
  loading: false,
  fetchError: '',
  count: 0
}

// Подгружаем kids одного элемента (новости или комментария)
export const saveComments = createAsyncThunk('SAVE_COMMENTS',
  async (item: IItem) => {
    const comments = await Promise.all(item.kids!.map(async (id) => {
      const res = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      const comment: IItem = res.data
      return comment
    }))
    return { item, comments }
  })


export const comments = createSlice({
  name: 'comments',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(saveComments.pending, (state) => {
        state.loading = true;
        state.fetchError = '';
      })
      .addCase(saveComments.fulfilled, (state, action) => {
        state.commentsData[action.payload.item.id] = action.payload.comments;
        state.loading = false;
        state.fetchError = '';
      })
      .addCase(saveComments.rejected, (state, action) => {
        state.fetchError = action.error.message!;
        state.loading = false;
      })
  }
})
