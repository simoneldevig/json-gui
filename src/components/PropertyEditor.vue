<template>
  <div class="property-editor mb-1 d-flex justify-content-between align-items-center drag-handle">
    <div>
      <span v-show="!editPropertyName" class="property-editor__name">{{ propertyName }}</span>
      <MazInput v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" placeholder="Property name" size="sm" @change="updateModel" @blur="editPropertyName = false" />
    </div>
    <div :class="{'property__actions': !editPropertyName}">
      <MazBtn v-if="!hideEdit" title="Rename" fab outline size="mini" class="property__actions--btn mr-2" color="primary" @click="editPropName">
        <span class="material-icons">edit</span>
      </MazBtn>
      <MazBtn title="Delete" fab outline size="mini" class="property__actions--btn" color="primary" @click="deleteProp">
        <span class="material-icons">delete</span>
      </MazBtn>
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
      (this.$refs.propertyName as any).$el.children[0].focus();
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

<style lang="scss" scoped>
.property-editor {
  min-height: 40px;

  &__name {
    font-size: 15px;
  }
}
</style>
