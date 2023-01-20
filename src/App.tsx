import './index.css';
import { Layout } from 'antd';
import { Header } from './components/Header';
import { NewsList } from './components/NewsList';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

export const App = () => {

  return (
    <BrowserRouter>
      <Switch>

        <Route path="/news">
          <Layout>
            <Header />
            <NewsList />
          </Layout>
        </Route>

        <Route path="/">
          <Redirect to={'/news'} />
        </Route>

      </Switch>
    </BrowserRouter>
  );
}
