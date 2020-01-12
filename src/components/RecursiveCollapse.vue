<template>
  <div>
    <el-card class="box-card mb2">
      <template slot="header">
        <div class="flex justify-between items-center">
          <div class="ml1">
            <p v-if="isSubChild" class="text-capitalize"><strong>{{ propertyName }}</strong></p>
            <p v-else class="text-capitalize"><strong>{{ id }}</strong></p>
          </div>

          <div>
            <span class="pr1"><strong>Times to repeat</strong></span>
            <el-input-number v-model="timesToRepeat" class="mr2" size="mini" controls-position="right" :min="1" @change="updateDataContentToDataModel(dataModel)" />
            <el-popover v-model="stringDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input ref="newStringProp" v-model="newPropertyName" class="mb2" size="small" @keyup.enter="stringDialogVisible = false, addNewProperty('string')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="stringDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="stringDialogVisible = false, addNewProperty('string')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default" @click="$refs.newStringProp.focus()">String</el-button>
            </el-popover>
            
            <el-popover v-model="numberDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input ref="newStringProp" v-model="newPropertyName" class="mb2" size="small" @keyup.enter="numberDialogVisible = false, addNewProperty('number')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="numberDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="numberDialogVisible = false, addNewProperty('number')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Number</el-button>
            </el-popover>

            <el-popover v-model="booleanDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input ref="newStringProp" v-model="newPropertyName" class="mb2" size="small" @keyup.enter="booleanDialogVisible = false, addNewProperty('boolean')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="booleanDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="booleanDialogVisible = false, addNewProperty('boolean')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Boolean</el-button>
            </el-popover>

            <el-popover v-model="objectDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input ref="newStringProp" v-model="newPropertyName" class="mb2" size="small" @keyup.enter="objectDialogVisible = false, addNewProperty('object')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="objectDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="objectDialogVisible = false, addNewProperty('object')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Object</el-button>
            </el-popover>
          </div>
        </div>
      </template>
      <div v-for="(property, propertyName, index) in dataModel" :key="propertyName">
        <string v-if="property.type === 'string' || property.type === 'number'" ref="string" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <boolean v-if="property.type === 'boolean'" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <recursive-collapse v-if="property.type === 'object' || property.type === 'array'" :data="property.value" :parent-entry="id" :is-sub-child="true" :property-name="propertyName" @value-changed="setDataModelValue" />
      </div>
    </el-card>
  </div>
</template>

<script>
import string from '@/components/BaseStringInput';
// import number from '@/components/BaseNumberInput';
import boolean from '@/components/BaseBooleanInput';
import { renameObjectKey } from '@/utils';
const faker = require('faker');

export default {
  name: 'RecursiveCollapse',
  components: {
    string,
    // number,
    boolean
  },
  props: {
    data: {
      default: null,
      requirred: true
    },
    id: {
      default: null,
      requirred: true,
      type: String
    },
    isSubChild: {
      default: false,
      requirred: true,
      type: Boolean
    },
    propertyName: {
      default: null,
      type: String
    },
    parentEntry: {
      default: null,
      type: String
    }
  },
  data () {
    return {
      dataModel: null,
      dataContent: null,
      timesToRepeat: 1,
      stringDialogVisible: false,
      numberDialogVisible: false,
      booleanDialogVisible: false,
      objectDialogVisible: false,
      newPropertyName: ''
    };
  },
  computed: {
    dataModelSize () {
      return Object.keys(this.dataModel).length;
    }
  },
  watch: {
    data () {
      this.dataModel = this.data[0];
    }
  },
  created () {
    this.dataModel = this.data[0];
    
    this.updateDataContentToDataModel(this.dataModel);

    this.timesToRepeat = this.data.length;
  },
  methods: {
    generateGuid () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    addNewProperty (type) {
      let newProperty = {};
      newProperty.type = type;

      switch (type) {
        case 'string':
          newProperty.value = '';
          break;
        case 'number':
          newProperty.value = 0;
          break;
        case 'boolean':
          newProperty.value = false;
          break;
        case 'object':
          newProperty.value = [{}];
          break;
      }

      Object.assign(this.dataModel, {[this.newPropertyName]: newProperty});

      this.newPropertyName = '';
    },
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
    updateDataContentToDataModel (dataModel) {
      let newData = [];
      for (let i = 0; i < this.timesToRepeat; i++) {
        let clonedObject = this.$lodash.cloneDeep(dataModel);
        Object.keys(clonedObject).forEach((propertyName, index, values) => { 
          if (clonedObject[propertyName].type === 'string' && clonedObject[propertyName].value.toString().startsWith('faker') || clonedObject[propertyName].type === 'number' && clonedObject[propertyName].value.toString().startsWith('faker')) {
            const fakerData = clonedObject[propertyName].value + '();';
            clonedObject[propertyName].value = eval(fakerData);
          }
          if (clonedObject[propertyName].type === 'boolean' && clonedObject[propertyName].value === 'random') {
            clonedObject[propertyName].value = faker.random.boolean();
          }
          if (clonedObject[propertyName].type === 'object' || clonedObject[propertyName].type === 'array') {
            this.updateDataContentToDataModel(clonedObject[propertyName].value[0]);
          }
        });
        newData.push(clonedObject);
      }
      this.dataContent = newData;
      this.$emit('updateData', this.dataContent);
    },
    setDataModelValue (changedValueObject) {
      if (changedValueObject.propertyName !== changedValueObject.oldPropertyName) {
        this.dataModel = renameObjectKey(this.dataModel, changedValueObject.oldPropertyName, changedValueObject.propertyName);
      }
      this.dataModel[changedValueObject.propertyName] = changedValueObject.value;
      this.updateDataContentToDataModel(this.dataModel);
    },
    deleteProperty (propertyName) {
      delete this.dataModel[propertyName];
      this.updateDataContentToDataModel(this.dataModel);
    }
  }
};
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
