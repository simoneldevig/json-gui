<template>
  <div>
    <el-card class="box-card">
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
            <el-tooltip class="item" effect="dark" content="Add new property" placement="top">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <!-- <el-button type="danger" size="medium" icon="el-icon-delete-solid" circle @click="deleteEntry(index)" /> -->
            </el-tooltip>
          </div>
        </div>
      </template>
      <div v-for="(property, propertyName, index) in dataModel">
        <string v-if="typeof (property) === 'string'" :value="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <number v-if="typeof (property) === 'number'" :value="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <boolean v-if="typeof (property) === 'boolean'" :value="property" :property-name="propertyName" @value-changed="setDataModelValue" @delete-property="deleteProperty" />
        <recursive-collapse v-if="typeof (property) === 'object'" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propertyName" @value-changed="setDataModelValue" />
      </div>
    </el-card>
  </div>
</template>

<script>
import string from '@/components/BaseStringInput';
import number from '@/components/BaseNumberInput';
import boolean from '@/components/BaseBooleanInput';
import { renameObjectKey } from '@/utils';


export default {
  name: 'RecursiveCollapse',
  components: {
    string,
    number,
    boolean
  },
  props: {
    data: {
      requirred: true
    },
    id: {
      requirred: true,
      type: String
    },
    isSubChild: {
      requirred: true,
      type: Boolean
    },
    propertyName: {
      type: String
    },
    parentEntry: {
      type: String
    }
  },
  data () {
    return {
      dataModel: null,
      dataContent: null,
      timesToRepeat: 0
    };
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
