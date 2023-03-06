<template>
  <div class="btn-group" role="group">
    <button v-for="item in items"
            type="button"
            :class="activeBtn(item)"
            @click="changeFilter(item)">
      {{ filterValue(item) }}
    </button>
  </div>
</template>

<script>
export default {
  name: "BtnGroup",

  props: {
    items: {
      type: Array,
      default: [],
      required: true,
    },

    active: {
      type: String|Array|null,
      default: null,
      required: true,
    },

    multiSelect: {
      type: Boolean,
      default: false,
      required: false,
    },

    hasFilter: {
      type: String,
      default: '',
      required: false,
    },
  },

  methods: {
    activeBtn(item) {
      if (this.multiSelect) {
        return this.active.includes(item) ? 'btn-active' : 'btn-inactive'
      } else {
        return item === this.active ? 'btn-active' : 'btn-inactive';
      }
    },

    filterValue(value) {
      if (this.hasFilter) {
        return this.$options.filters[this.hasFilter](value);
      } else {
        return value;
      }
    },

    changeFilter(item) {
      this.$emit('changeFilter', item);
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-group {
  @apply inline-flex rounded-md shadow-sm mr-4;

  button:first-child {
    @apply border rounded-l;
  }

  button:last-child {
    @apply border rounded-r;
  }

  button {
    @apply px-4 py-2 text-sm font-medium border-t border-b;
  }
}

.btn-active {
  @apply text-white bg-blue-500 border-blue-500;

  &:hover {
    @apply bg-blue-700 text-blue-100;
  }
}

.btn-inactive {
  @apply text-blue-500 bg-white border-blue-500;

  &:hover {
    @apply bg-blue-100 text-blue-700;
  }
}
</style>