<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Add New Todo</h3>
      <input
        v-model="description"
        type="text"
        placeholder="Enter todo description"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 mb-4"
      />
      <div class="flex justify-end gap-2">
        <button
          @click="$emit('update:modelValue', false)"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          @click="handleAdd"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Todo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  schema: string;
  workspaceId: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'todo-added', todo: any): void;
}>();

const description = ref('');

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    description.value = '';
  }
});

const handleAdd = async () => {
  if (!description.value.trim()) return;

  try {
    const response = await fetch('/api/dooit/addTodo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        schema: props.schema,
        workspaceId: props.workspaceId,
        description: description.value,
      }),
    });

    if (!response.ok) throw new Error('Failed to add todo');

    const newTodo = await response.json();
    emit('todo-added', newTodo);
    emit('update:modelValue', false);
    description.value = '';
  } catch (error) {
    console.error('Error adding todo:', error);
  }
};
</script>