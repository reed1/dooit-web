<template>
  <div class="mb-4">
    <select :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            class="w-full bg-white rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3">
      <option value="">Select a schema</option>
      <option v-for="schema in schemas" :key="schema.name" :value="schema.name">
        {{ schema.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import type { DooitSchema } from '@@/types';

defineProps<{
  modelValue: string;
  schemas: DooitSchema[];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>