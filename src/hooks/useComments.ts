import { PayloadAction } from "@reduxjs/toolkit";
import { IItem } from "hacker-news-api-types";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { saveComments } from "../store/comments";

interface IProps {
  story: IItem
  isRoot: boolean
}

export const useComments = ({ story, isRoot }: IProps) => {

  const dispatch = useDispatch<AppDispatch>()
  const { commentsData, loading } = useSelector((state: RootState) => state.comments)

  const loadComments = (item: IItem) => {
    dispatch(saveComments(item)).then((res: PayloadAction<any>) => {
      res.payload.comments.forEach((comment: IItem) => {
        if (comment.kids) loadComments(comment)
      })
    })
  }

  // Подгружает только корневые комментарии
  useEffect(() => {
    if (isRoot && !commentsData[story.id] && !!story && story.kids && story.kids.length)
      dispatch(saveComments(story))
    // eslint-disable-next-line
  }, [])

  // Рекурсивно подгружает все комментарии, вложенные в корневые
  useEffect(() => {
    if (!isRoot && !commentsData[story.id] && story.kids && story.kids.length)
      loadComments(story)
    // eslint-disable-next-line
  }, [])

  return { commentsData, loading }
}
