<template>
  <div>
    <p><strong>Item name</strong></p>
    <el-input v-model="itemName" placeholder="Insert your new item name" @input="parseToParent">
      <template slot="prepend">/</template>
    </el-input>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class CreateItemModal extends Vue {
  private itemName = '';

  parseToParent () {
    this.$emit('add-item', this.itemName);
  };
};
</script>
