<template>
  <div class="space-y-4">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Todos</h2>
    <div v-if="todos.length === 0" class="text-gray-500 text-center py-4">
      No todos found in this workspace
    </div>
    <div v-else class="bg-white shadow rounded-lg divide-y divide-gray-200">
      <div
        v-for="todo in todos"
        :key="todo.id"
        class="p-4 hover:bg-gray-50 cursor-pointer"
        @click="selectedTodoId = selectedTodoId === todo.id ? null : todo.id"
      >
        <div class="flex items-center justify-between">
          <span class="text-gray-900">{{ todo.description }}</span>
          <div
            v-if="selectedTodoId === todo.id"
            class="flex items-center gap-2"
          >
            <button
              @click.stop="handleEdit(todo)"
              class="text-gray-500 hover:text-indigo-600 p-1"
              title="Edit todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.stop="handleDelete(todo)"
              class="text-gray-500 hover:text-red-600 p-1"
              title="Delete todo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <TodoModal
      v-model="showEditModal"
      :schema="schema"
      :is-edit="true"
      :edit-todo="editTodo"
      @todo-updated="handleTodoUpdated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Todo } from '@@/types';
import TodoModal from './TodoModal.vue';

const props = defineProps<{
  todos: Todo[];
  schema: string;
}>();

const emit = defineEmits<{
  (e: 'update:todos', todos: Todo[]): void;
}>();

const showEditModal = ref(false);
const editTodo = ref<Todo | undefined>(undefined);
const selectedTodoId = ref<number | null>(null);

const handleEdit = (todo: Todo) => {
  editTodo.value = todo;
  showEditModal.value = true;
  selectedTodoId.value = null;
};

const handleTodoUpdated = (updatedTodo: Todo) => {
  const newTodos = props.todos.map(todo =>
    todo.id === updatedTodo.id ? updatedTodo : todo
  );
  emit('update:todos', newTodos);
};

const handleDelete = async (todo: Todo) => {
  if (!confirm('Are you sure you want to delete this todo?')) return;

  try {
    const response = await fetch('/api/dooit/deleteTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: props.schema,
        todoId: todo.id,
      }),
    });

    if (!response.ok) throw new Error('Failed to delete todo');

    const newTodos = props.todos.filter(t => t.id !== todo.id);
    emit('update:todos', newTodos);
    selectedTodoId.value = null;
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
};
</script>