<template>
  <div v-if="dataModel">
    <MazCard max-width="none" class="collapse mb-2 w-100">
      <div class="property">
        <div class="property__header d-flex justify-content-between align-items-center drag-handle" @click="setCollapseState">
          <div class="d-flex flex-column w-100">
            <div class="d-flex align-items-center justify-content-between" :class="{'mb-3' : !isSubChild}">
              <div v-if="isSubChild">
                <h1 v-show="!editPropertyName" class="h3">{{ propertyName }}</h1>
                <MazInput v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" placeholder="Property name" size="sm" @change="updateModel" @blur="closePropEditor" />
              </div>
              <div v-else class="d-flex justify-content-between w-100">
                <h1 class="h3">{{ id }}</h1>
                <a v-if="isEndpoint" :href="endpointUrl" target="blank" class="mr-2">
                  <MazBtn size="mini" color="grey" rounded>
                    <small>Open</small>
                  </MazBtn>
                </a>
              </div>
              <div class="d-flex align-items-center">
                <div v-if="isSubChild" class="property__actions d-flex align-items-center">
                  <div v-if="dataModel.type === 'object' || dataModel.type === 'model'" class="mr-2 d-flex align-items-center">
                    <small class="mr-2">Remove key</small>
                    <MazSwitch v-if="dataModel" v-model="dataModel.removeKey" />
                  </div>
                  <MazBtn title="Rename" fab outline size="mini" class="mr-2 property__actions--btn" color="primary" @click.stop="editPropName">
                    <span class="material-icons">edit</span>
                  </MazBtn>
                  <MazBtn title="Delete" fab outline size="mini" class="mr-2 property__actions--btn" color="primary" @click.stop="deleteProp">
                    <span class="material-icons">delete</span>
                  </MazBtn>
                </div>
                <MazInput v-if="dataModel.type === 'array'" v-model="dataModel.timesToRepeat" title="Repeat" class="property__repeat d-flex justify-content-center" placeholder="Repeat" size="sm" type="number" :min="1" @change="updateModel" @click.stop />
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
              <BaseStringInput v-if="property.type === 'string' || property.type === 'number'" ref="string" :model="property" :property-name="propName" :siblings="siblings" />
              <BaseBooleanInput v-if="property.type === 'boolean'" :model="property" :property-name="propName" :siblings="siblings" />
              <ReferencedModel v-if="property.type === 'model'" :model="property" :property-name="propName" :siblings="siblings" />
              <RecursiveCollapse v-if="property.type === 'object' || property.type === 'array'" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propName" :siblings="siblings" />
            </div>
          </draggable>

          <div class="property__add-container rounded py-5 d-flex flex-column align-items-center">
            <p class="mb-3 text-gray">Add new property</p>
            <div class="d-flex justify-content-center">
              <AddProperty type="string" @addProperty="addNewProperty" />
              <AddProperty type="number" @addProperty="addNewProperty" />
              <AddProperty type="boolean" @addProperty="addNewProperty" />
              <AddProperty type="object" @addProperty="addNewProperty" />
              <AddProperty type="array" @addProperty="addNewProperty" />
              <AddProperty type="model" @addProperty="addNewProperty" />
            </div>
          </div>
        </div>
      </MazTransitionExpand>
    </MazCard>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import BaseStringInput from '@/components/BaseStringInput.vue';
import BaseBooleanInput from '@/components/BaseBooleanInput.vue';
import ReferencedModel from '@/components/ReferencedModel.vue';
import AddProperty from '@/components/AddProperty.vue';
import { generateGuid } from '../utils';
import draggable from 'vuedraggable';
import { BaseDTO } from '@/types/';

@Component({
  name: 'RecursiveCollapse',
  components: {
    BaseStringInput,
    ReferencedModel,
    BaseBooleanInput,
    AddProperty,
    draggable
  }
})
export default class RecursiveCollapse extends Vue {
    @Prop({ type: Object, required: true }) readonly data!: BaseDTO;
    @Prop({ type: String, default: '' }) readonly id!: string;
    @Prop({ type: Boolean, required: true, default: false }) readonly isSubChild!: boolean;
    @Prop(String) readonly propertyName!: string;
    @Prop(String) readonly parentEntry!: string;

    dataModel: BaseDTO = new BaseDTO();
    newPropertyName = '';
    editPropertyName = false;
    $lodash: any;
    isOpen = false;
    $eventBus: any;

    get isEndpoint (): boolean {
      return this.$route.params.type === 'endpoints';
    }

    get models (): any {
      return this.$store.state.models;
    }

    get siblings (): string[] {
      return Object.keys(this.data.value);
    }

    get endpointUrl (): string {
      return `${window.location.origin}/${this.id}`;
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

    setCollapseState () {
      if (!this.editPropertyName) {
        this.isOpen = !this.isOpen;
        localStorage.setItem(this.data.id, this.isOpen.toString());
      }
    }

    editPropName (): void {
      this.editPropertyName = !this.editPropertyName;
      this.$nextTick(() => {
        (this.$refs.propertyName as any).focusInput();
        (this.$refs.propertyName as any).$el.getElementsByTagName('input')[0].select();
      });
    }

    addNewProperty (type: string, value: string): void {
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

    updateModel (): void {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.newPropertyName,
        oldPropertyName: this.propertyName,
        value: this.dataModel
      });
    }

    closePropEditor (): void {
      setTimeout(() => {
        this.editPropertyName = false;
      }, 100);
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
    opacity: 0.2;
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
