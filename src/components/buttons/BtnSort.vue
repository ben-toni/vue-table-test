<template>
  <div class="pl-1" @click="sortColBy(sortValue)">
    <svg v-if="sortBy === sortValue && asc === true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="w-4 h-4" :class="sortBy === sortValue ? 'text-gray-700' : ''">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="w-4 h-4" :class="sortBy === sortValue ? 'text-gray-700' : ''">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "BtnSort",

  props: {
    sortValue: {
      type: String,
      default: '',
      required: true,
    },

    sortBy: {
      type: String,
      default: '',
      required: true,
    },

    asc: {
      type: Boolean,
      default: false,
      required: true,
    },
  },

  methods: {
    sortColBy(col) {
      this.$emit('sort', col)
    }
  }
}
</script>

<style scoped>

</style>