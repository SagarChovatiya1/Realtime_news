import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IItem } from "hacker-news-api-types";
import { RootState } from ".";

const getStory = async (id: number) => {
  const response = await axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  const story: IItem = response.data
  return story
}

export const saveStory = createAsyncThunk('SAVE_STORY', getStory)

const itemsOnPage = 20

export const saveNews = createAsyncThunk('SAVE_NEWS',
  async (pageNum: number, { getState }) => {
    const { idsList: { idsList } } = getState() as RootState
    const lastIndex = pageNum * itemsOnPage
    const news = await Promise.all(idsList.slice(lastIndex - itemsOnPage, lastIndex).map((id) => getStory(id)));
    return news
  })

export interface IInitState {
  newsData: IItem[]

  newsLoading: boolean
  newsError: string

  storyLoading: boolean
  storyError: string
}

const initialState: IInitState = {
  newsData: [],
  newsLoading: false,
  newsError: '',

  storyLoading: false,
  storyError: ''
}

export const news = createSlice({
  name: 'news',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Подгрузка новостей (на основании номера страницы, который был передан в агрументе)
      .addCase(saveNews.pending, (state) => {
        state.newsLoading = true;
      })
      .addCase(saveNews.rejected, (state, action) => {
        state.newsLoading = false;
        state.newsError = action.error.message!;
      })
      .addCase(saveNews.fulfilled, (state, action) => {
        state.newsData = [...state.newsData, ...action.payload];
        state.newsLoading = false;
      })

      // Подгрузка одной новости
      .addCase(saveStory.pending, (state) => {
        state.storyLoading = true;
      })
      .addCase(saveStory.rejected, (state, action) => {
        state.storyLoading = false;
        state.storyError = action.error.message!;
      })
      .addCase(saveStory.fulfilled, (state, action) => {
        state.newsData.forEach((item) => {
          if (item.id === action.payload.id) item = action.payload
          return
        })
        state.storyLoading = false;
      })
  }
})
