<template>
  <div class="mb2 property">
    <PropertyEditor :property-name="propertyName" :model="model" />

    <el-radio v-model="objectModel.value" :value="true" :label="true" class="mr1" size="small" border @change="updateModel">true</el-radio>
    <el-radio v-model="objectModel.value" :value="false" :label="false" class="mr1" size="small" border @change="updateModel">false</el-radio>
    <el-radio v-model="objectModel.value" :value="'random'" :label="'random'" class="mr1" size="small" border @change="updateModel">random</el-radio>
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
