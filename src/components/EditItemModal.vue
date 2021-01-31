<template>
  <div>
    <MazInput
      v-model="itemName"
      placeholder="Insert your new item name"
      class="mb-3"
      clearable
      @input="parseToParent"
    />
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
