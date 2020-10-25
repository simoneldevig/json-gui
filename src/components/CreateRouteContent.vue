<template>
  <div>
    <p><strong>Route name</strong></p>
    <el-input v-model="routeName" placeholder="Insert your new route name" @input="parseToParent">
      <template slot="prepend">/</template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class CreateRouteModal extends Vue {
  private routeName = '';

  parseToParent () {
    this.$emit('add-route', this.routeName);
  };
};
</script>
