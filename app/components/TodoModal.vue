<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black/20 flex items-center justify-center"
    @keyup.esc="closeModal"
    tabindex="0"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">{{ isEdit ? 'Edit Todo' : 'Add New Todo' }}</h3>
      <textarea
        ref="inputRef"
        v-model="description"
        placeholder="Enter todo description"
        class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 mb-4 min-h-[100px] resize-y"
        @keydown.enter.prevent="handleSubmit"
      ></textarea>
      <div class="flex justify-end gap-2">
        <button
          @click="closeModal"
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {{ isEdit ? 'Update' : 'Add Todo' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { Todo } from '@@/types';

const props = defineProps<{
  modelValue: boolean;
  schema: string;
  workspaceId?: string;
  isEdit?: boolean;
  editTodo?: Todo;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'todo-added', todo: Todo): void;
  (e: 'todo-updated', todo: Todo): void;
}>();

const description = ref('');
const inputRef = ref<HTMLTextAreaElement | null>(null);

const closeModal = () => {
  emit('update:modelValue', false);
  description.value = '';
};

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    description.value = '';
  } else if (props.isEdit && props.editTodo) {
    description.value = props.editTodo.description;
    nextTick(() => {
      inputRef.value?.focus();
    });
  } else {
    nextTick(() => {
      inputRef.value?.focus();
    });
  }
});

const handleSubmit = async () => {
  if (!description.value.trim()) return;

  try {
    if (props.isEdit && props.editTodo) {
      const response = await fetch('/api/dooit/updateTodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          schema: props.schema,
          todoId: props.editTodo.id,
          description: description.value,
        }),
      });

      if (!response.ok) throw new Error('Failed to update todo');

      const updatedTodo = await response.json();
      emit('todo-updated', updatedTodo);
    } else {
      if (!props.workspaceId) throw new Error('Workspace ID is required for adding todos');

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
    }
    closeModal();
  } catch (error) {
    console.error('Error handling todo:', error);
  }
};
</script>