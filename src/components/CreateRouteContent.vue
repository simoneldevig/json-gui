<template>
  <div>
    <p><strong>Route name</strong></p>
    <el-input placeholder="Insert your new route name" v-model="routeName" @input="parseToParent">
      <template slot="prepend">/</template>
    </el-input>
  </div>
</template>

<script>
  export default {
    name: 'CreateRouteModal',
    data() {
      return {
        routeName: ''
      };
    },
    methods: {
      parseToParent () {
        this.$emit('add-route', this.routeName);
      }
    }
  }
</script>