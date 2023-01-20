import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { saveNewsIds } from "../store/idsList";

export const useNews = () => {
  const data = useSelector((state: RootState) => state.news)
  const idsList = useSelector((state: RootState) => state.idsList.idsList)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (!idsList.length) dispatch(saveNewsIds())
    // eslint-disable-next-line
  }, [idsList.length])

  return data
}

