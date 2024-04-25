import './App.css';
import Timer from './components/Timer';
import Background from './components/Background';
import TodoList from './components/ToDo';

function App() {
  return (
    <div className="App">
      <TodoList />
      <Timer />
      <Background />
    </div>
  );
}

export default App;