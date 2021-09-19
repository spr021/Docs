import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Home from "./view/pages/Home"
import Login from "./view/pages/Login"
import NewDoc from "./view/pages/NewDoc";
import Doc from "./view/pages/Doc";
import Profile from "./view/pages/Profile";

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/new">
            <NewDoc />
          </Route>
          <Route exact path="/doc/:title">
            <Doc />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
