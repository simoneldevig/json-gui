<template>
  <div class="mb1 flex justify-between items-center drag-handle">
    <div>
      <p v-show="!editPropertyName" class="mt0 mb0">{{ propertyName }}</p>
      <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="updateModel" @blur="editPropertyName = false" />
    </div>
    <div class="property__actions">
      <el-button v-if="!hideEdit" class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-edit" circle @click="editPropName" />
      <el-button class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-delete" circle @click="deleteProp" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { BaseDTO } from '@/types/';

@Component({})
export default class PropertyEditor extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;
  @Prop(Boolean) readonly hideEdit: boolean = false;

  editPropertyName = false;
  newPropertyName = '';

  editPropName () {
    this.editPropertyName = !this.editPropertyName;
    this.$nextTick(() => {
      (this.$refs.propertyName as HTMLElement).focus();
    });
  };

  updateModel () {
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.newPropertyName,
      oldPropertyName: this.propertyName,
      value: this.model
    });
  };

  deleteProp () {
    this.$store.dispatch('deleteModelProperty', {
      id: this.model.id
    });
  };

  created () {
    this.newPropertyName = this.propertyName;
  };
}
</script>
