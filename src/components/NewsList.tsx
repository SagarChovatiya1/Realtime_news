import { Card, Skeleton } from "antd"
import { Content } from "antd/lib/layout/layout"
import { Link, Route, Switch, useRouteMatch } from "react-router-dom"
import { NewsCard } from "./NewsCard"
import urlSlug from 'url-slug'
import { NewsDetails } from "./NewsDetails"
import { useNews } from "../hooks/useNews"
import { useEffect, useRef, useState } from "react"
import { saveNews } from "../store/news"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../store"
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
const { Search } = Input;

export const NewsList = () => {

  const [count, setCount] = useState<number>(0)
  const { newsData, newsLoading } = useNews()
  const { idsList, idsLoading } = useSelector((state: RootState) => state.idsList)
  const { path, url } = useRouteMatch();
  const dispatch = useDispatch<AppDispatch>()
  const [bottomOfList, setBottomOfList] = useState<HTMLLIElement | null>(null);
  const [inputText, setInputText] = useState("");
  const newsList = useSelector((state: RootState) => state?.news?.newsData)
  const [list, setList] = useState<any[]>([]);

  const observer = useRef(
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) setCount((prev) => ++prev)
    }, { rootMargin: '500px' }))

  // апи дает 500 новостей, это 25 страниц (отсчет страниц от 1)
  useEffect(() => {
    if (count <= 25 && idsList.length) dispatch(saveNews(count))
    // eslint-disable-next-line
  }, [count])

  useEffect(() => {
    const currentObserver = observer.current

    if (bottomOfList) currentObserver.observe(bottomOfList)

    return () => {
      if (bottomOfList) currentObserver.unobserve(bottomOfList)
    }
  }, [bottomOfList])

  const onSearch = (value: String) => {
    console.log(value)
  };

  const onhandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var lowerCase = e.target.value.toLowerCase();
    //   list.filter(post => {
    //     if (lowerCase === "") {

    //       console.log("-------empty",post)
    //       setList([post]) 
    //       return post;
    //     } else if (post?.title?.toLowerCase().includes(lowerCase)) {
    //     console.log("-------",post)
    //     setList([post])
    //     return post;
    //   }
    // });
    setInputText(lowerCase);
  }

  // newsList.filter(post => {
  //   if (inputText === "") {
  //     //if query is empty
  //     return post;
  //   } else if (post?.title?.toLowerCase().includes(inputText.toLowerCase())) {
  //     //returns filtered array
  //     return post;
  //   }
  // });

  return (
    <Content>

      <div className="container" style={{ paddingBottom: 30 }}>
        <div style={{ marginTop: "20px" }}>
          <Search
            placeholder="input search text"
            allowClear
            onChange={(e) => onhandleChange(e)}
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </div>
        {
          newsList && newsList.filter((d: any) => {
            if (d) {
              return (
                d.title.toLowerCase().search(inputText) != -1
              )
            }
          })
            .map((item: any, index: number) => {
              return (<Link to={`${url}/${urlSlug(item.title!)}?id=${item.id}`} key={item.id}><NewsCard item={item} /></Link>)
            })
        }
        {/* {list.map((item) => {
          return (<Link to={`${url}/${urlSlug(item.title!)}?id=${item.id}`} key={item.id}><NewsCard item={item} /></Link>)
        })} */}

        {!newsLoading && !idsLoading && (<li ref={setBottomOfList}></li>)}

        {newsLoading && (
          [...Array(10)].map((_, ind) => {
            return (<Card style={{ marginTop: 30 }} key={ind}>
              <Skeleton loading={newsLoading} title active paragraph={{ rows: 1 }} />
            </Card>)
          })
        )}
      </div>

      <Switch>
        <Route path={`${path}/:id`}>
          <NewsDetails />
        </Route>
      </Switch>
    </Content>
  )
}
