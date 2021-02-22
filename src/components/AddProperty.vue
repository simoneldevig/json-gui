<template>
  <div>
    <MazBtn :title="`Add new ${type}`" rounded class="ml-2" size="mini" outline @click="addProperty(type)">+ {{ typeDisplayName }}</MazBtn>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import faker from 'faker';

@Component({})
export default class AddProperty extends Vue {
  @Prop({ type: String, required: true }) readonly type!: string;
  isVisible = false;

  get typeDisplayName (): string {
    return this.type.toLowerCase().charAt(0).toUpperCase() + this.type.toLowerCase().slice(1);
  }

  addProperty () {
    this.$emit('addProperty', this.type, faker.commerce.product().toLowerCase());
  };

  setFocus () {
    (this.$refs.newPropField as HTMLElement).focus();
  };
};
</script>
