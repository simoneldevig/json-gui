<template>
  <div class="boolean mb-3 property">
    <PropertyEditor :property-name="propertyName" :model="model" />

    <div class="boolean__inputs d-flex">
      <MazRadio v-model="objectModel.value" radio-value="true" name="true" class="mr-3" @change="updateModel">true</MazRadio>
      <MazRadio v-model="objectModel.value" radio-value="false" name="false" class="mr-3" @change="updateModel">false</MazRadio>
      <MazRadio v-model="objectModel.value" radio-value="random" name="random" @change="updateModel">random</MazRadio>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import PropertyEditor from '@/components/PropertyEditor.vue';
import { BaseDTO } from '@/types';

@Component({
  components: {
    PropertyEditor
  }
})
export default class BooleanInput extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;

  objectModel: BaseDTO = new BaseDTO();
  editPropertyName = false;

  created () {
    this.objectModel = this.model;
  }

  updateModel () {
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.propertyName,
      oldPropertyName: this.propertyName,
      value: this.objectModel
    });
  };

  editPropName () {
    this.editPropertyName = true;
    this.$nextTick(() => {
      (this.$refs.propertyName as HTMLElement).focus();
    });
  };

  deleteProp () {
    this.$store.dispatch('deleteModelProperty', {
      id: this.model.id
    });
  };
}
</script>

<style lang="scss" scoped>
.boolean {
  &__inputs {
    height: 46px;
    background: var(--maz-bg-color-light);
    border-radius: var(--maz-border-radius);
    padding: 0 .8571rem;
  }
}

</style>
