<template>
  <div class="mb-8">
    <select
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
    >
      <option value="">Select a workspace</option>
      <option v-for="workspace in workspaces" :key="workspace.id" :value="workspace.id">
        {{ workspace.description }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { Workspace } from '@@/types';

defineProps<{
  modelValue: string;
  workspaces: Workspace[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>