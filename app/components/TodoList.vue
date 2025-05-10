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
        class="p-4 hover:bg-gray-50"
      >
        <div class="flex items-center">
          <span class="text-gray-900">{{ todo.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo } from '@@/types';

defineProps<{
  todos: Todo[];
}>();
</script>