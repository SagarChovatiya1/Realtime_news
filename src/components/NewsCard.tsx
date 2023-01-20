import { UserOutlined, ClockCircleOutlined, StockOutlined } from "@ant-design/icons"
import { Card, Space, Typography } from "antd"
import { IItem } from "hacker-news-api-types";
import { timeSince } from "../utils/timeSince";
const { Text } = Typography;

interface IProps {
  item: IItem
}

export const NewsCard = ({ item }: IProps) => {

  return (
    <Card
      style={{ marginTop: 30 }}
      key={item.id}
      title={item.title}
    >
      <Space size='large' className="news-card">
        <Space>
          <UserOutlined />
          <Text>{item.by}</Text>
        </Space>
        <Space>
          <ClockCircleOutlined />
          <Text className="publish-time"><span>Published </span>{timeSince(item.time!.toString())}</Text>
        </Space>
        <Space>
          <StockOutlined />
          <Text>{item.score}</Text>
        </Space>
      </Space>
    </Card>
  )
}
