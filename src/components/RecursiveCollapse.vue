<template>
  <div v-if="dataModel[0]">
    <el-card class="box-card mb2">
      <template slot="header">
        <div>
          <div class="flex justify-between items-center">
            <div>
              <p v-if="isSubChild"><strong>{{ propertyName }}</strong></p>
              <p v-else><strong>{{ id }}</strong></p>
            </div>
            <div v-if="isEndpoint">
              <span class="pr1"><strong>Times to repeat</strong></span>
              <el-input-number v-model="dataModel[0].timesToRepeat" size="mini" controls-position="right" :min="1" @change="setModel" />
            </div>
          </div>
          <div class="flex justify-end items-center">
            <el-popover @after-enter="setFocus" v-model="stringDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input v-if="stringDialogVisible" ref="newPropField" v-model="newPropertyName" class="mb2" size="small" @keyup.enter.native="stringDialogVisible = false, addNewProperty('string')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="stringDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="stringDialogVisible = false, addNewProperty('string')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">String</el-button>
            </el-popover>
            <el-popover @after-enter="setFocus" v-model="numberDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input v-if="numberDialogVisible" ref="newPropField" v-model="newPropertyName" class="mb2" size="small" @keyup.enter.native="numberDialogVisible = false, addNewProperty('number')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="numberDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="numberDialogVisible = false, addNewProperty('number')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Number</el-button>
            </el-popover>

            <el-popover @after-enter="setFocus" v-model="booleanDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input v-if="booleanDialogVisible" ref="newPropField" v-model="newPropertyName" class="mb2" size="small" @keyup.enter.native="booleanDialogVisible = false, addNewProperty('boolean')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="booleanDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="booleanDialogVisible = false, addNewProperty('boolean')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Boolean</el-button>
            </el-popover>

            <el-popover @after-enter="setFocus" v-model="objectDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input v-if="objectDialogVisible" ref="newPropField" v-model="newPropertyName" class="mb2" size="small" @keyup.enter.native="objectDialogVisible = false, addNewProperty('object')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="objectDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="objectDialogVisible = false, addNewProperty('object')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Object</el-button>
            </el-popover>

            <el-popover @after-enter="setFocus" v-model="arrayDialogVisible" placement="bottom" width="400">
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input v-if="arrayDialogVisible" ref="newPropField" v-model="newPropertyName" class="mb2" size="small" @keyup.enter.native="arrayDialogVisible = false, addNewProperty('array')" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="arrayDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="arrayDialogVisible = false, addNewProperty('array')">Add</el-button>
              </div>
              <el-button slot="reference" icon="el-icon-document-add" class="ml1" size="small" type="default">Array</el-button>
            </el-popover>

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
      </template>
      <div v-for="(property, propertyName) in dataModel[0].value" :key="propertyName">
        <string v-if="property.type === 'string' || property.type === 'number'" ref="string" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <boolean v-if="property.type === 'boolean'" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <model v-if="property.type === 'model'" :model="property" :property-name="propertyName" @delete-property="deleteProperty" />
        <recursive-collapse v-if="Array.isArray(property) && property[0].type === 'object' || Array.isArray(property) && property[0].type === 'array'" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propertyName" @value-changed="setDataModelValue" />
      </div>
    </el-card>
  </div>
</template>

<script>
import string from '@/components/BaseStringInput';
import boolean from '@/components/BaseBooleanInput';
import model from '@/components/ReferencedModel';
import { renameObjectKey, generateGuid } from '@/utils';
import { mapMutations } from 'vuex';

export default {
  name: 'RecursiveCollapse',
  components: {
    string,
    model,
    boolean
  },
  props: {
    data: {
      default: null,
      requirred: true,
      type: [Array, Object]
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
      stringDialogVisible: false,
      numberDialogVisible: false,
      booleanDialogVisible: false,
      objectDialogVisible: false,
      arrayDialogVisible: false,
      importDialogVisible: false,
      newPropertyName: '',
      modelToImport: null
    };
  },
  computed: {
    isEndpoint () {
      return this.$route.params.type === 'endpoints';
    },
    dataModelSize () {
      return Object.keys(this.dataModel).length;
    },
    models () {
      return this.$store.state.models;
    }
  },
  watch: {
    data () {
      this.dataModel = this.data;
    }
  },
  created () {
    this.dataModel = this.data;
  },
  methods: {
    ...mapMutations([
      'setCurrentModel'
    ]),
    setModel () {
      this.setCurrentModel(this.dataModel);
    },
    addNewProperty (type, value) {
      let newProperty;
      if (type !== 'object' && type !== 'array') {
        newProperty = {};
        newProperty.type = type;
        newProperty.id = generateGuid();

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
          case 'model':
            newProperty.value = value;
            break;
        }
      } else {
        newProperty = [];
        let newPropertyObject = {};
        newPropertyObject.type = type;
        newPropertyObject.id = generateGuid();
        newPropertyObject.value = {
          timesToRepeat: 1
        };
        newProperty.push(newPropertyObject);
      }

      Object.assign(this.dataModel[0].value, {[this.newPropertyName]: newProperty});

      this.newPropertyName = '';
    },
    importModel () {
      this.newPropertyName = this.modelToImport;
      this.addNewProperty('model', this.models[this.modelToImport][0].id);
      this.modelToImport = null;
    },
    setFocus () {
      this.$refs.newPropField.focus();
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
    setDataModelValue (changedValueObject) {
      console.log(changedValueObject)
      if (changedValueObject.propertyName !== changedValueObject.oldPropertyName) {
        this.dataModel = renameObjectKey(this.dataModel, changedValueObject.oldPropertyName, changedValueObject.propertyName);
      }
      this.dataModel[changedValueObject.propertyName].value = changedValueObject.value;
      this.setModel();
      // this.updateDataContentToDataModel(this.dataModel);
    },
    deleteProperty (propertyName) {
      delete this.dataModel[propertyName];
      // this.updateDataContentToDataModel(this.dataModel);
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
