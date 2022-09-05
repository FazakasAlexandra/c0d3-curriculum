const { useState, useEffect } = React;
import Search from "./components/search"

const App = () => {
  return (
    <div className="row">
      <p>AAA</p>
      <Search/>
    </div>
  );
};

const rootNode = document.getElementById("root");
const root = ReactDOM.createRoot(rootNode);
root.render(React.createElement(App));
