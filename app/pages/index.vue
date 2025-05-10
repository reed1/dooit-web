<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Dooit</h1>

      <SchemaSelector
        v-model="selectedSchema"
        :schemas="schemas"
        @update:modelValue="handleSchemaChange"
      />

      <WorkspaceSelector
        v-if="selectedSchema"
        v-model="selectedWorkspace"
        :workspaces="workspaces"
        @update:modelValue="handleWorkspaceChange"
      />

      <TodoList
        v-if="selectedWorkspace"
        :todos="todos"
      />

      <AddTodoButton
        v-if="selectedWorkspace"
        @click="showAddTodoModal = true"
      />

      <AddTodoModal
        v-model="showAddTodoModal"
        :schema="selectedSchema"
        :workspace-id="selectedWorkspace"
        @todo-added="todos.push"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { DooitSchema, Workspace, Todo } from '@@/types'

const schemas = ref<DooitSchema[]>([])
const workspaces = ref<Workspace[]>([])
const todos = ref<Todo[]>([])
const selectedSchema = ref('')
const selectedWorkspace = ref('')
const showAddTodoModal = ref(false)

// Fetch schemas on component mount
onMounted(async () => {
  try {
    const response = await fetch('/api/dooit/getSchemas')
    schemas.value = await response.json()
  } catch (error) {
    console.error('Error fetching schemas:', error)
  }
})

// Handle schema selection
const handleSchemaChange = async () => {
  selectedWorkspace.value = ''
  todos.value = []

  if (!selectedSchema.value) return

  try {
    const response = await fetch('/api/dooit/getWorkspaces?schema=' + selectedSchema.value)
    workspaces.value = await response.json()
  } catch (error) {
    console.error('Error fetching workspaces:', error)
  }
}

// Handle workspace selection
const handleWorkspaceChange = async () => {
  todos.value = []

  if (!selectedSchema.value || !selectedWorkspace.value) return

  try {
    const response = await fetch(
      '/api/dooit/getTodos?schema=' + selectedSchema.value + '&workspaceId=' + selectedWorkspace.value
    )
    todos.value = await response.json()
  } catch (error) {
    console.error('Error fetching todos:', error)
  }
}
</script>
