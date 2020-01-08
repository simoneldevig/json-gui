<template>
  <div>
    <el-card class="box-card mb2">
      <template slot="header">
        <div class="flex justify-between items-center">
          <div class="ml1">
            <p v-if="isSubChild" class="text-capitalize"><strong>{{ propertyName }}</strong></p>
            <p v-else class="text-capitalize"><strong>{{ id }}</strong></p>
            {{ dataContent.length }}
          </div>

          <div>
            <span class="pr1"><strong>Times to repeat</strong></span>
            <el-input-number v-model="timesToRepeat" class="mr2" size="mini" controls-position="right" :min="1" @change="updateDataContentToDataModel" />
            <!-- <el-button type="success" size="medium" icon="el-icon-document-add" circle /> -->
            <el-popover
              v-model="stringDialogVisible"
              placement="bottom"
              width="400"
            >
              <p class="mt0 mb1"><strong>Property name?</strong></p>
              <el-input ref="newStringProp" v-model=newPropertyName class="mb2" size="small" />

              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="stringDialogVisible = false">Cancel</el-button>
                <el-button type="primary" size="mini" @click="stringDialogVisible = false, addNewProperty('string')">Add</el-button>
              </div>
              <el-button slot="reference" @click="$refs.newStringProp.focus()" icon="el-icon-document-add" class="ml1" size="small" type="default">String</el-button>
            </el-popover>
            <!-- <el-popover
                placement="bottom"
                title="Title"
                width="200"
                trigger="click"
                content="this is content, this is content, this is content">
                <el-button slot="reference">Click to activate</el-button>
                <el-button slot="reference" icon="el-icon-document-add" @click="addNewProperty('string')" class="ml1" size="small" type="default">String</el-button>
              </el-popover> -->

            <el-button icon="el-icon-document-add" class="ml1" size="small" type="default" @click="addNewProperty('number')">Number</el-button>
            <el-button icon="el-icon-document-add" class="ml1" size="small" type="default" @click="addNewProperty('boolean')">Boolean</el-button>
            <el-button icon="el-icon-document-add" size="small" type="default" @click="addNewProperty('object/array')">Object</el-button>
            <!-- <el-dropdown trigger="click" @command="addNewProperty">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="string">Add string</el-dropdown-item>
                <el-dropdown-item command="number">Add number</el-dropdown-item>
                <el-dropdown-item command="boolen">Add boolean</el-dropdown-item>
                <el-dropdown-item command="object">Add object</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <!-- <el-button type="danger" size="medium" icon="el-icon-delete-solid" circle @click="deleteEntry(index)" /> -->
            </el-tooltip>
          </div>
        </div>
      </template>
      <div v-for="(property, propertyName, index) in dataModel" :key="propertyName">
        <string ref="string" v-if="property.type === 'string' || property.type === 'number'" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <!-- <number v-if="property.type === 'number'" :model="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" /> -->
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
      timesToRepeat: 0,
      stringDialogVisible: false,
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

    this.dataContent = this.data;

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
          newProperty.value = {};
          break;
      }

      this.dataModel[this.newPropertyName] = newProperty;
      this.newPropertyName = '';
      this.$refs[type][this.$refs[type].length - 1].$el.scrollIntoView({behavior: 'smooth', block: 'center'}); 
      this.$refs[type][this.$refs[type].length - 1].$refs.input.focus(); 
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
    updateDataContentToDataModel () {
      let newData = [];
      for (let i = 0; i < this.timesToRepeat; i++) {
        const clonedObject = Object.assign({}, this.dataModel);
        newData.push(clonedObject);
      }
      this.dataContent = newData;
    },
    setDataModelValue (changedValueObject) {
      if (changedValueObject.propertyName !== changedValueObject.oldPropertyName) {
        this.dataModel = renameObjectKey(this.dataModel, changedValueObject.oldPropertyName, changedValueObject.propertyName);
      }
      this.dataModel[changedValueObject.propertyName] = changedValueObject.value;
      this.updateDataContentToDataModel();
    },
    deleteProperty (propertyName) {
      delete this.dataModel[propertyName];
      this.updateDataContentToDataModel();
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
