<template>
  <div class="pl-1 pt-0.5" @click="expand(item)">
    <svg v-if="expanded === item" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
         stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
    </svg>
  </div>
</template>

<script>
export default {
  name: "BtnExpand",

  props: {
    item: {
      type: String,
      default: '',
      required: true,
    },

    expanded: {
      type: String|null,
      default: null,
      required: true,
    },
  },

  methods: {
    expand(item) {
      this.$emit('expand', item)
    }
  }
}
</script>

<style scoped>

</style>