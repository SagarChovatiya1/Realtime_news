import { PageHeader } from 'antd';
import { blue } from '@ant-design/colors';
import Logo from '../img/logo.png'

export const Header = () => {

  return (
    <PageHeader style={{ backgroundColor: "black", padding: '10px 0 20px' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <img className='logo' alt="The Hacker News Logo" decoding="async" src={Logo}></img>
      </div>
    </PageHeader>
  )
}
