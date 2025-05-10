<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Dooit</h1>

      <SchemaSelector v-model="selectedSchema"
                      :schemas="schemas"
                      @update:modelValue="handleSchemaChange" />

      <WorkspaceSelector v-if="selectedSchema"
                         v-model="selectedWorkspace"
                         :workspaces="workspaces"
                         @update:modelValue="handleWorkspaceChange" />

      <TodoList v-if="selectedWorkspace"
                :todos="todos"
                :schema="selectedSchema"
                @update:todos="todos = $event" />

      <button class="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700"
              v-if="selectedWorkspace"
              @click="showAddTodoModal = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <TodoModal v-model="showAddTodoModal"
                 :schema="selectedSchema"
                 :workspace-id="selectedWorkspace"
                 @todo-added="handleTodoAdded" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { DooitSchema, Workspace, Todo } from '@@/types';
import TodoModal from '~/components/TodoModal.vue';

useHead({
  title: 'Dooit',
});

const schemas = ref<DooitSchema[]>([]);
const workspaces = ref<Workspace[]>([]);
const todos = ref<Todo[]>([]);
const selectedSchema = ref('');
const selectedWorkspace = ref('');
const showAddTodoModal = ref(false);

onMounted(async () => {
  const response = await fetch('/api/dooit/getSchemas');
  schemas.value = await response.json();
});

const handleSchemaChange = async () => {
  selectedWorkspace.value = '';
  todos.value = [];
  if (!selectedSchema.value) {
    return;
  }
  const response = await fetch('/api/dooit/getWorkspaces?schema=' + selectedSchema.value)
  workspaces.value = await response.json();
}

const handleWorkspaceChange = async () => {
  todos.value = [];
  if (!selectedSchema.value || !selectedWorkspace.value) {
    return;
  }
  const response = await fetch(
    '/api/dooit/getTodos?schema=' + selectedSchema.value + '&workspaceId=' + selectedWorkspace.value
  );
  todos.value = await response.json();
}

function onTodoAdded(todo: Todo) {
  todos.value.push(todo);
}

function handleTodoAdded(todo: Todo) {
  onTodoAdded(todo);
}

</script>
