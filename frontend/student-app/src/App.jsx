import { Provider } from "react-redux";
import store from "./store/store";
/**css */
import "./style.css";

function App() {
  return (
    <Provider {...{ store }}>
       <h1>Hello World Philip</h1>
    </Provider>
  )
}

export default App
