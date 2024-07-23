import { useEffect, useState } from "react";
import "./styles/index.css";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import axios from "axios";

function App() {
  const Todos = ({ todos }) => {
    return (
      <div className="todos">
        {todos &&
          todos.map((todo) => {
            return (
              <div key={todo.id} className="todo">
                <button
                  onClick={() => modifyStatusTodo(todo)}
                  className="checkbox"
                  style={{ backgroundColor: todo.status ? "#A879E6" : "white" }}
                ></button>
                <p>{todo.name}</p>
                <button onClick={() => handleWithEditButtonClick(todo)}>
                  <AiOutlineEdit size={20} color="#64697b"></AiOutlineEdit>
                </button>
                <button onClick={() => deleteTodo(todo)}>
                  <AiOutlineDelete size={20} color="#64697b"></AiOutlineDelete>
                </button>
              </div>
            );
          })}
      </div>
    );
  };

  const handleWithNewButton = async () => {
    setInputVisibily(!inputVisibility);
  };
  const handleWithEditButtonClick = async (todo) => {
    setSelectedTodo(todo);
    setInputVisibily(true);
  };

  const getTodos = async () => {
    try {
      const res = await axios.get("http://localhost:3000/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const editTodo = async () => {
    if (inputValue === "") {
      alert("campo vazio");
      return
    }
    const res = await axios.patch("http://localhost:3000/todos", {
      id: selectedTodo.id,
      name: inputValue,
    });
    setSelectedTodo();
    setInputVisibily(false);
    setInputValue("");
    getTodos();
  };

  const createTodo = async () => {
    if (inputValue === "") {
      alert("campo vazio");
    } else {
      const res = await axios.post("http://localhost:3000/todos", {
        name: inputValue,
      });
      await getTodos();
      setTodos([...todos, res.data]);
      setInputVisibily(!inputVisibility);
      setInputValue("");
    }
  };

  const deleteTodo = async (todo) => {
    const response = await axios.delete(
      `http://localhost:3000/todos/${todo.id}`
    );
    getTodos();
  };

  async function modifyStatusTodo(todo) {
    const response = await axios.patch(`http://localhost:3000/todos`, {
      id: todo.id,
      status: !todo.status,
    });
    getTodos();
  }

  const [todos, setTodos] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [inputVisibility, setInputVisibily] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState();

  useEffect(() => {
    getTodos();
  }, []);
  return (
    <div>
      <header className="container">
        <div className="header">
          <h1>Dont be lazzy</h1>
        </div>
        <Todos todos={todos}></Todos>
        <input
          value={inputValue}
          style={{ display: inputVisibility ? "block" : "none" }}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          type="text"
          className="inputName"
        />
        <button
          onClick={
            inputVisibility
              ? selectedTodo
                ? editTodo
                : createTodo
              : handleWithNewButton
          }
          className="newTaskButton"
        >
          {inputVisibility ? "Confirm" : "New task"}
        </button>
      </header>
    </div>
  );
}

export default App;
