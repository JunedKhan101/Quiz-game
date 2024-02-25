import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./Components/HomePage.jsx";
import Quiz from "./Components/Quiz.jsx";
import Result from "./Components/Result.jsx";
function App() {
  return (
    <Router>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/quiz" component={Quiz} />
            <Route path="/result" component={Result} />
        </Switch>
    </Router>
  );
}

export default App;
