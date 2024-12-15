import { useState, useEffect } from 'react';
import { my_icp_todo_backend } from 'declarations/my-icp-todo-backend';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

  // 加载所有待办事项
  const loadTodos = async () => {
    try {
      const result = await my_icp_todo_backend.getAllTodos();
      setTodos(result);
    } catch (error) {
      console.error("加载待办事项失败:", error);
    }
  };

  // 组件加载时获取待办事项
  useEffect(() => {
    loadTodos();
  }, []);

  // 添加新待办事项
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await my_icp_todo_backend.createTodo(newTodo);
      setNewTodo("");
      loadTodos();
    } catch (error) {
      console.error("添加待办事项失败:", error);
    }
  };

  // 切换待办事项状态
  const handleToggle = async (todo) => {
    try {
      await my_icp_todo_backend.updateTodo(
        todo.id,
        todo.content,
        !todo.completed
      );
      loadTodos();
    } catch (error) {
      console.error("更新待办事项失败:", error);
    }
  };

  // 删除待办事项
  const handleDelete = async (id) => {
    try {
      await my_icp_todo_backend.deleteTodo(id);
      loadTodos();
    } catch (error) {
      console.error("删除待办事项失败:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ICP Todo 应用</h1>
      
      {/* 添加待办事项表单 */}
      <form onSubmit={handleAddTodo} className="mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="输入新的待办事项..."
          className="border p-2 mr-2 rounded"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          添加
        </button>
      </form>

      {/* 待办事项列表 */}
      <ul>
        {todos.map((todo) => (
          <li 
            key={todo.id}
            className="flex items-center justify-between border-b py-2"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo)}
                className="mr-2"
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.content}
              </span>
            </div>
            <button
              onClick={() => handleDelete(todo.id)}
              className="text-red-500"
            >
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;