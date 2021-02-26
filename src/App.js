import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./Componenets/HomePage";
import Quiz from "./Componenets/Quiz";
import Result from "./Componenets/Result.js";
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
