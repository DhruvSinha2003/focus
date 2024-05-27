import "./App.css";
import Background from "./components/Background";
import Timer from "./components/Timer";
import TodoList from "./components/ToDo";

function App() {
  return (
    <div className="App" style={{ background: "orange" }}>
      <TodoList />
      <Timer />
      <Background />
    </div>
  );
}

export default App;
