import "./App.css";
import Background from "./components/Background";
import MusicPlayer from "./components/MusicPlayer";
import Timer from "./components/Timer";
import TodoList from "./components/ToDo";
function App() {
  return (
    <div className="App">
      <MusicPlayer />
      <TodoList />
      <Timer />
      <Background />
    </div>
  );
}

export default App;
