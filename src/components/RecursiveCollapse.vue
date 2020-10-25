<template>
  <div v-if="dataModel">
    <el-card class="box-card mb2">
      <template slot="header">
        <div class="property property--no-background">
          <div class="flex justify-between items-center mb1 drag-handle">
            <div>
              <div v-if="isSubChild">
                <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
                <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="updateModel" @blur="editPropertyName = false" />
              </div>
              <p v-else class="mt0 mb0"><strong>{{ id }}</strong></p>
            </div>
            <div v-if="isSubChild" class="property__actions">
              <el-button class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-edit" circle @click="editPropName" />
              <el-button class="ml1 property__actions--btn" type="primary" plain size="mini" icon="el-icon-delete" circle @click="deleteProp" />
            </div>
          </div>
          <div class="flex jitems-center" :class="isEndpoint && dataModel.type !== 'object' ? 'justify-between' : 'justify-end'">
            <div v-if="isEndpoint && dataModel.type !== 'object'">
              <span class="pr1"><small>Repeat</small></span>
              <el-input-number v-model="dataModel.timesToRepeat" size="mini" controls-position="right" :min="1" @change="setModel" />
            </div>
            <div>
              <add-property type="string" @addProperty="addNewProperty" />
              <add-property type="number" @addProperty="addNewProperty" />
              <add-property type="boolean" @addProperty="addNewProperty" />
              <add-property type="object" @addProperty="addNewProperty" />
              <add-property type="array" @addProperty="addNewProperty" />
              <el-select v-if="isEndpoint && models" v-model="modelToImport" filterable class="ml1" size="small" placeholder="Import model" @change="importModel">
                <el-option
                  v-for="(item, index) in Object.keys(models)"
                  :key="index"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </div>
          </div>
        </div>
      </template>
      <draggable v-model="sortable" handle=".drag-handle" @start="drag=true" @end="drag=false">
        <div v-for="(property, propName) in dataModel.value" :key="propName">
          <string v-if="property.type === 'string' || property.type === 'number'" ref="string" :model="property" :property-name="propName" />
          <boolean v-if="property.type === 'boolean'" :model="property" :property-name="propName" />
          <model v-if="property.type === 'model'" :model="property" :property-name="propName" />
          <recursive-collapse v-if="property.type === 'object' || property.type === 'array'" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propName" />
        </div>
      </draggable>
    </el-card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

import string from '@/components/BaseStringInput.vue';
import boolean from '@/components/BaseBooleanInput.vue';
import model from '@/components/ReferencedModel.vue';
import addProperty from '@/components/AddProperty.vue';
import { renameObjectKey, generateGuid, addToObject } from '../utils';
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

  dataModel: BaseDTO = new BaseDTO();
  modelToImport = '';
  stringDialogVisible = false;
  numberDialogVisible = false;
  booleanDialogVisible = false;
  objectDialogVisible = false;
  arrayDialogVisible = false;
  importDialogVisible = false;
  newPropertyName = '';
  editPropertyName = false;
  $lodash: any;

  get isEndpoint (): boolean {
    return this.$route.params.type === 'endpoints';
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
  }

  setModel (): void {
    this.$store.dispatch('setModel', this.dataModel);
  }

  editPropName (): void {
    this.editPropertyName = !this.editPropertyName;
    this.$nextTick(() => {
      (this.$refs.propertyName as HTMLElement).focus();
    });
  }

  addNewProperty (type: string, value: string): void {
    let newProperty: BaseDTO = new BaseDTO();
    let propertyName: string = value;
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
            value: false
          });
          break;
        case 'model':
          propertyName = this.modelToImport;
          newProperty = new BaseDTO({
            type: type,
            id: generateGuid(),
            value: value
          });
          break;
      }
    } else {
      // Handle objects and arrays
      newProperty =
        type === 'array'
          ? new BaseDTO({
            type: type,
            timesToRepeat: 1,
            id: generateGuid(),
            value: ''
          })
          : new BaseDTO({ type: type, id: generateGuid(), value: '' });
    }

    const clonedObject = this.$lodash.cloneDeep(this.dataModel.value);
    this.dataModel.value = addToObject(
      clonedObject,
      propertyName,
      newProperty,
      0
    );
  }

  importModel (): void {
    this.newPropertyName = this.modelToImport;
    this.addNewProperty('model', this.models[this.modelToImport].id);
    this.modelToImport = '';
  }
  // saveNewProperty () {
  //   console.log(this.propertyValuesDialogData);
  //   this.propertyValuesDialogVisible = false;
  // },
  // duplicate (entry) {
  //   console.log(entry);
  //   let duplicateEntry = {};
  //   duplicateEntry = entry;
  //   duplicateEntry.guid = this.generateGuid();
  //   this.dataModel.push(entry);
  //   console.log(this.dataModel);
  // },
  // generateFakerValues (obj) {
  //   if (typeof obj === 'object') {
  //     for (const key in obj) {
  //       if (typeof (obj[key]) !== 'object') {
  //         delete obj[key];
  //       }
  //       else if (typeof (obj[key]) === 'object') {
  //         if (obj[key].type === 'object' || obj[key].type === 'array') {
  //           const generatedData = this.generateFakerValues(obj[key].value);
  //           delete obj[key];
  //           obj[key] = generatedData;
  //         }

  //         if (obj[key].type === 'string' && obj[key].value.toString().startsWith('faker') || obj[key].type === 'number' && obj[key].value.toString().startsWith('faker')) {
  //           try {
  //             const fakerValue = eval(obj[key].value);
  //             delete obj[key];
  //             obj[key] = fakerValue;
  //           } catch (err) {
  //             // eslint-disable-next-line no-console
  //             console.error('Invalid faker function');
  //           }
  //         }
  //         else if (obj[key].type === 'string') {
  //           const value = obj[key].value;
  //           delete obj[key];
  //           obj[key] = value;
  //         }

  //         else if (obj[key].type === 'number') {
  //           const value = obj[key].value;
  //           delete obj[key];
  //           obj[key] = parseInt(value);
  //         }

  //         else if (obj[key].type === 'boolean') {
  //           const value = obj[key].value === 'random' ? faker.random.boolean() : obj[key].value;
  //           delete obj[key];
  //           obj[key] = value;
  //         }
  //       }
  //     }
  //   }
  //   return obj;
  // },
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
    // this.updateDataContentToDataModel(this.dataModel);
  }

  deleteProp (): void {
    this.$store.dispatch('deleteModelProperty', {
      id: this.dataModel.id
    });
  }
}
</script>

<style lang="scss">
  .el-collapse-item {
    margin-bottom: 10px;
  }

  .el-collapse-item__header {
    display: flex;
    justify-content: space-between;
    position: relative;
    background: rgba(0,0,0,0.03);
  }

  .el-collapse-item__arrow {
    position: absolute;
      right: 0;
    margin: 0 8px 0 0;
  }

  .el-collapse-item__wrap {
    background: transparent;
  }

  .el-collapse-item__content {
    background: rgba(0,0,0,0.02);
    border: 1px solid rgba(0, 0, 0, 0.03);
    padding: 0 15px 25px 15px;
  }

  .el-card__header {
    padding: 10px 20px;
  }
</style>
