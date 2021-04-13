<template>
  <div class="property-editor mb-1 d-flex justify-content-between align-items-center drag-handle">
    <div>
      <span v-show="!editPropertyName" class="property-editor__name d-flex align-items-center">{{ propertyName }}
        <span class="property-editor__type" :class="`property-editor__type--${model.type}`">{{ model.type }}</span>
      </span>
      <ValidationObserver v-slot="{ handleSubmit }">
        <ValidationProvider v-slot="{ errors, invalid }" tag="div" class="d-flex align-items-center" rules="required|alpha">
          <MazInput v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" :error="invalid" placeholder="Property name" size="sm" @change="handleSubmit(updateModel)" @blur="handleSubmit(close)" />
          <span v-if="invalid" class="validation-error ml-2">{{ errors[0] }}</span>
        </ValidationProvider>
      </ValidationObserver>
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
  $eventBus: any;

  editPropName () {
    this.editPropertyName = !this.editPropertyName;
    this.$nextTick(() => {
      const propertyInput = this.$refs.propertyName as any;
      propertyInput.focusInput();
      propertyInput.$el.getElementsByTagName('input')[0].select();
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

  close () {
    this.editPropertyName = false;
  }

  mounted () {
    this.$eventBus.$on('TRIGGER_PROPERTY_EDIT', (id: string) => {
      if (id === this.model.id) {
        this.editPropName();
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.property-editor {
  min-height: 40px;

  &__name {
    font-size: 15px;
  }

  &__type {
    margin-left: 7px;
    padding: 0px 5px;
    border-radius: 4px;
    line-height: inherit;
    background: var(--maz-secondary);
    color: var(--maz-black);
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
}
</style>
