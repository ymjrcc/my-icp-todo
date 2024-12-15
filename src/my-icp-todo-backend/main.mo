import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Hash "mo:base/Hash";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";

actor {
    // 定义Todo类型
    public type Todo = {
        id: Nat;
        content: Text;
        completed: Bool;
    };

    private stable var nextId: Nat = 0;
    private var todos = HashMap.HashMap<Nat, Todo>(0, Nat.equal, Hash.hash);

    // 创建新的待办事项
    public func createTodo(content: Text) : async Todo {
        let todo: Todo = {
            id = nextId;
            content = content;
            completed = false;
        };
        todos.put(nextId, todo);
        nextId += 1;
        return todo;
    };

    // 获取所有待办事项
    public query func getAllTodos() : async [Todo] {
        return Iter.toArray(todos.vals());
    };

    // 更新待办事项
    public func updateTodo(id: Nat, content: Text, completed: Bool) : async ?Todo {
        let existingTodo = todos.get(id);
        switch (existingTodo) {
            case (null) { return null; };
            case (?todo) {
                let updatedTodo: Todo = {
                    id = id;
                    content = content;
                    completed = completed;
                };
                todos.put(id, updatedTodo);
                return ?updatedTodo;
            };
        };
    };

    // 删除待办事项
    public func deleteTodo(id: Nat) : async Bool {
        switch (todos.get(id)) {
            case (null) { return false; };
            case (?_) {
                todos.delete(id);
                return true;
            };
        };
    };

    // 根据ID获取待办事项
    public query func getTodo(id: Nat) : async ?Todo {
        return todos.get(id);
    };
};