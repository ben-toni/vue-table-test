<template>
  <div class="container mx-auto m-6 p-10">
    <vue-table/>
  </div>
</template>

<script>
import VueTable from "../components/VueTable.vue";

export default {
  name: "HomeView",

  components: {
    'vue-table': VueTable
  },
}
</script>