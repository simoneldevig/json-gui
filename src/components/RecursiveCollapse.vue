<template>
  <div v-if="dataModel">
    <MazCard max-width="none" class="collapse mb-2 w-100">
      <div class="property">
        <div class="property__header d-flex justify-content-between align-items-center drag-handle" @click="setCollapseState">
          <div class="d-flex flex-column w-100">
            <div class="d-flex align-items-center justify-content-between" :class="{'mb-3' : !isSubChild}">
              <div v-if="isSubChild">
                <h1 v-show="!editPropertyName" class="h3">{{ propertyName }}</h1>
                <MazInput v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" placeholder="Property name" size="sm" @change="updateModel" @blur="editPropertyName = false" />
              </div>
              <h1 v-else class="h3">{{ id }}</h1>
              <div class="d-flex align-items-center">
                <div v-if="isSubChild" class="property__actions">
                  <MazBtn title="Rename" fab outline size="mini" class="mr-2 property__actions--btn" color="primary" @click.stop="editPropName">
                    <span class="material-icons">edit</span>
                  </MazBtn>
                  <MazBtn title="Delete" fab outline size="mini" class="mr-2 property__actions--btn" color="primary" @click.stop="deleteProp">
                    <span class="material-icons">delete</span>
                  </MazBtn>
                </div>
                <MazInput v-if="isEndpoint && dataModel.type !== 'object'" v-model="dataModel.timesToRepeat" title="Repeat" class="property__repeat d-flex justify-content-center" placeholder="Repeat" size="sm" type="number" :min="1" @change="setModel" />
              </div>
            </div>
            <small v-if="!isSubChild" class="d-block">To use values from faker.js, simply insert faker.js functions into the inputs. E.g. faker.name.findName() <br>docs can be found here: <a href="https://github.com/marak/Faker.js/">https://github.com/marak/Faker.js</a></small>
          </div>
        </div>
      </div>
      <MazTransitionExpand>
        <div v-show="isOpen || !isSubChild">
          <draggable v-model="sortable" class="property__content" handle=".drag-handle" @start="drag=true" @end="drag=false">
            <div v-for="(property, propName) in dataModel.value" :key="propName">
              <string v-if="property.type === 'string' || property.type === 'number'" ref="string" :model="property" :property-name="propName" />
              <boolean v-if="property.type === 'boolean'" :model="property" :property-name="propName" />
              <model v-if="property.type === 'model'" :model="property" :property-name="propName" />
              <recursive-collapse v-if="property.type === 'object' || property.type === 'array'" :depth="depth + 1" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propName" />
            </div>
          </draggable>

          <div class="property__add-container rounded py-5 d-flex flex-column align-items-center">
            <p class="mb-3 text-gray">Add new property</p>
            <div class="d-flex justify-content-center">
              <add-property type="string" @addProperty="addNewProperty" />
              <add-property type="number" @addProperty="addNewProperty" />
              <add-property type="boolean" @addProperty="addNewProperty" />
              <add-property type="object" @addProperty="addNewProperty" />
              <add-property type="array" @addProperty="addNewProperty" />
              <add-property type="model" @addProperty="addNewProperty" />
            </div>
          </div>
        </div>
      </MazTransitionExpand>
    </MazCard>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import string from '@/components/BaseStringInput.vue';
import boolean from '@/components/BaseBooleanInput.vue';
import model from '@/components/ReferencedModel.vue';
import addProperty from '@/components/AddProperty.vue';
import { renameObjectKey, generateGuid } from '../utils';
import draggable from 'vuedraggable';
import { BaseDTO } from '@/types/';

@Component({
  components: {
    string,
    model,
    boolean,
    addProperty,
    draggable
  }
})
export default class RecursiveCollapse extends Vue {
    @Prop({ type: Object, required: true }) readonly data!: BaseDTO;
    @Prop({ type: String, default: '' }) readonly id!: string;
    @Prop({ type: Boolean, required: true, default: false }) readonly isSubChild!: boolean;
    @Prop(String) readonly propertyName!: string;
    @Prop(String) readonly parentEntry!: string;
    @Prop(Number) readonly depth!: number;

    dataModel: BaseDTO = new BaseDTO();
    stringDialogVisible = false;
    numberDialogVisible = false;
    booleanDialogVisible = false;
    objectDialogVisible = false;
    arrayDialogVisible = false;
    importDialogVisible = false;
    newPropertyName = '';
    editPropertyName = false;
    $lodash: any;
    isOpen = false;
    $eventBus: any;
    modelToImport = '';

    get isEndpoint (): boolean {
      return this.$route.params.type === 'endpoints';
    }

    get backgroundColor () {
      const opacity = 0.05 * this.depth;
      return `rgba(255, 255, 255, ${opacity})`;
    }

    get dataModelSize (): number {
      return Object.keys(this.dataModel).length;
    }

    get models (): any {
      return this.$store.state.models;
    }

    get sortable () {
      // Convert value object to array for making it sortabel
      return this.dataModel.value ? Object.entries((this.dataModel.value as any)) : [];
    }

    set sortable (value) {
      // Convert sorted valye array back to object
      this.dataModel.value = Object.fromEntries(value);
    }

    @Watch('data')
    onDataChange (value: BaseDTO): void {
      this.dataModel = value;
    }

    created (): void {
      this.newPropertyName = this.propertyName;
      this.dataModel = this.data;
      this.isOpen = localStorage.getItem(this.data.id) === 'true';
    }

    mounted () {
      this.$eventBus.$on('TRIGGER_PROPERTY_EDIT', (id: string) => {
        if (id === this.dataModel.id) {
          this.editPropName();
          this.isOpen = true;
        }
      });
    }

    setModel (): void {
      this.$store.dispatch('setModel', this.dataModel);
    }

    setCollapseState () {
      this.isOpen = !this.isOpen;
      localStorage.setItem(this.data.id, this.isOpen.toString());
    }

    editPropName (): void {
      this.editPropertyName = !this.editPropertyName;
      this.$nextTick(() => {
        (this.$refs.propertyName as any).focusInput();
        (this.$refs.propertyName as any).$el.getElementsByTagName('input')[0].select();
      });
    }

    addNewProperty (type: string, value: string): void {
      console.log(type, value);
      let newProperty: BaseDTO = new BaseDTO();
      const propertyName: string = value;
      if (type !== 'object' && type !== 'array') {
        switch (type) {
          case 'string':
            newProperty = new BaseDTO({
              type: type,
              id: generateGuid(),
              value: ''
            });
            break;
          case 'number':
            newProperty = new BaseDTO({
              type: type,
              id: generateGuid(),
              value: '0'
            });
            break;
          case 'boolean':
            newProperty = new BaseDTO({
              type: type,
              id: generateGuid(),
              value: 'false'
            });
            break;
          case 'model':
            newProperty = new BaseDTO({
              type: type,
              id: generateGuid(),
              value: ''
            });
            break;
        }
      } else {
        // Handle objects and arrays
        newProperty = type === 'array' ? new BaseDTO({ type: type, timesToRepeat: 1, id: generateGuid() }) : new BaseDTO({ type: type, id: generateGuid() });
      }

      const clonedObject = this.$lodash.cloneDeep(this.dataModel.value);
      clonedObject[propertyName] = newProperty;
      this.dataModel.value = clonedObject;

      this.$nextTick(() => {
        this.$eventBus.$emit('TRIGGER_PROPERTY_EDIT', newProperty.id);
      });
    }

    // importModel (modelToImport: string): void {
    //   this.modelToImport = modelToImport;
    //   this.newPropertyName = this.modelToImport;
    //   this.addNewProperty('modelRef', this.models[this.modelToImport].id);
    //   this.modelToImport = '';
    // }

    updateModel (): void {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.newPropertyName,
        oldPropertyName: this.propertyName,
        value: this.dataModel
      });
    }

    setDataModelValue (changedValueObject: any): void {
      console.log(changedValueObject);
      if (
        changedValueObject.propertyName !== changedValueObject.oldPropertyName
      ) {
        this.dataModel = renameObjectKey(
          this.dataModel,
          changedValueObject.oldPropertyName,
          changedValueObject.propertyName
        );
      }
      this.dataModel[(changedValueObject.propertyName as string)].value =
            changedValueObject.value;
      this.setModel();
    }

    deleteProp (): void {
      this.$store.dispatch('deleteModelProperty', {
        id: this.dataModel.id
      });
    }
}
</script>

<style lang="scss">
.collapse {
  border: 1px solid var(--maz-bg-color-light);
}

.property {
  &__add-container {
    margin: 15px;
    opacity: 0.5;
    background: var(--maz-background-color);
    border: 2px dotted var(--maz-muted-color);
    transition: opacity 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }

  &__repeat {
    max-width: 70px;

    .maz-input__input {
      text-align: center;
    }
  }
}
</style>
