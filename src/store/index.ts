import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { comments } from './comments'
import { news } from './news'
import { idsList } from './idsList'

export const reducer = combineReducers({
  comments: comments.reducer,
  news: news.reducer,
  idsList: idsList.reducer
})

export const store = configureStore({ reducer: reducer })
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
