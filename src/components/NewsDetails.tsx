import { Button, Divider, Empty, Modal, Skeleton, Space, Typography } from "antd"
import { useHistory, useLocation } from "react-router-dom"
import queryString from 'query-string'
import { UserOutlined, ClockCircleOutlined, StockOutlined, LinkOutlined, CommentOutlined, SyncOutlined, HomeOutlined } from "@ant-design/icons"
import { timeSince } from "../utils/timeSince"
import { useNews } from "../hooks/useNews"
import { CommentsBlock } from "./CommentsBlock"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../store"
import { saveStory } from "../store/news"
import DOMPurify from "dompurify"
const { Link, Text, Title } = Typography;

export const NewsDetails = () => {

  const history = useHistory();
  const dispatch = useDispatch<AppDispatch>()
  const { search } = useLocation()
  const storyID = queryString.parse(search).id?.toString()
  const { newsData, newsLoading, storyLoading } = useNews()
  const [story] = newsData.filter((item) => item.id.toString() === storyID)

  const [rootCommentsNumber, setRootCommentsNumber] = useState(0)

  return (
    <Modal
      title={story ? <Title level={2} className='modal-title' style={{ marginBottom: 0 }}>{story.title}</Title> : ''}
      destroyOnClose
      open={true}
      footer={null}
      keyboard={true}
      onCancel={() => history.push('/news')}
      width={1100}
      className='modal'
    >
      <Skeleton active loading={(newsLoading || storyLoading) && !!storyID}></Skeleton>

      {(!storyID || !story) && !newsLoading && (
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 150, }}
          description={<span>This page does not exist</span>}
        >
          <Button onClick={() => history.push('/news')} icon={<HomeOutlined />}>Home</Button>
        </Empty>
      )}

      {!newsLoading && !storyLoading && story && (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space size='large' className="modal-meta-wrapper">
            <Space className="modal-meta-data">
              <Space>
                <UserOutlined />
                <Text>{story.by}</Text>
              </Space>
              <Space>
                <ClockCircleOutlined />
                <Text>Published {timeSince(story.time!.toString())}</Text>
              </Space>
              <Space>
                <StockOutlined />
                <Text>{story.score}</Text>
              </Space>
              <Space>
                <CommentOutlined />
                <Text>{story.kids?.length ? rootCommentsNumber || <SyncOutlined spin /> : 0}</Text>
              </Space>
            </Space>

            <Space>
              <Button onClick={() => dispatch(saveStory(story.id))} icon={<SyncOutlined />}>Refresh</Button>
              <Button onClick={() => history.push('/news')} icon={<HomeOutlined />}>Home</Button>
            </Space>
          </Space>

          {story.url && (
            <Space>
              <LinkOutlined />
              <Link className="link-to-story" href={story.url} target={'_blank'}>{story.url}</Link>
            </Space>
          )}

          {story.text && (
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(story.text) }}></div>
          )}

          <Divider orientation="left">Comments</Divider>

          <CommentsBlock story={story || ''} isRoot={true} onLoad={(num: number) => setRootCommentsNumber(num)} />

        </Space>
      )}
    </Modal>
  )
}
