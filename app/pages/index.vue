<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Dooit</h1>

      <!-- Schema Selection -->
      <div class="mb-8">
        <select
          v-model="selectedSchema"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          @change="handleSchemaChange"
        >
          <option value="">Select a schema</option>
          <option v-for="schema in schemas" :key="schema.name" :value="schema.name">
            {{ schema.label }}
          </option>
        </select>
      </div>

      <!-- Workspace Selection -->
      <div v-if="selectedSchema" class="mb-8">
        <select
          v-model="selectedWorkspace"
          class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
          @change="handleWorkspaceChange"
        >
          <option value="">Select a workspace</option>
          <option v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
            {{ workspace.description }}
          </option>
        </select>
      </div>

      <!-- Todo List -->
      <div v-if="selectedWorkspace" class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Todos</h2>
        <div v-if="todos.length === 0" class="text-gray-500 text-center py-4">
          No todos found in this workspace
        </div>
        <div v-else class="bg-white shadow rounded-lg divide-y divide-gray-200">
          <div
            v-for="todo in todos"
            :key="todo.id"
            class="p-4 hover:bg-gray-50"
          >
            <div class="flex items-center">
              <span class="text-gray-900">{{ todo.description }}</span>
            </div>
          </div>
        </div>
      </div>
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
