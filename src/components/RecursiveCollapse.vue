<template>
  <div>
    <el-card v-for="(entry, index) in dataValue" :key="entry.guid" class="box-card">
      <template slot="header">
        <div class="flex justify-between items-center">
          <div class="ml1">
            <p v-if="isSubChild" class="text-capitalize"><strong>{{ propertyName }}</strong></p>
            <p v-else class="text-capitalize"><strong>{{ id }}</strong></p>
          </div>

          <div>
            <span class="pr1"><strong>Times to repeat</strong></span>
            <el-input-number v-model="timesToRepeat" class="mr2" size="mini" controls-position="right" :min="1" />
            <el-tooltip class="item" effect="dark" content="Add new property" placement="top">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle />
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <el-button type="danger" size="medium" icon="el-icon-delete-solid" circle @click="deleteEntry(index)" />
            </el-tooltip>
          </div>
        </div>
      </template>
      <div v-for="(property, propertyName) in entry">
        <string v-if="typeof (property) === 'string'" :value="property" :parent-index="index" :property-name="propertyName" @value-changed="setValue" />
        <number v-if="typeof (property) === 'number'" :value="property" :parent-index="index" :property-name="propertyName" @value-changed="setValue" />
        <boolean v-if="typeof (property) === 'boolean'" :value="property" :parent-index="index" :property-name="propertyName" @value-changed="setValue" />
        <recursive-collapse v-if="typeof (property) === 'object'" :data="property" :parent-entry="id" :is-sub-child="true" :property-name="propertyName" @value-changed="setValue" />
      </div>
    </el-card>
  </div>
</template>

<script>
import string from '@/components/BaseStringInput';
import number from '@/components/BaseNumberInput';
import boolean from '@/components/BaseBooleanInput';

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
      dataValue: '',
      timesToRepeat: 1
    };
  },
  watch: {
    data () {
      this.dataValue = this.data;
    }
  },
  created () {
    this.dataValue = this.data;
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
    //   this.dataValue.push(entry);
    //   console.log(this.dataValue);
    // },
    deleteEntry (index) {
      console.log(index);
    },
    setValue (newValue) {
      this.dataValue[newValue.parentIndex][newValue.propertyName] = newValue.value;
      if (!this.hisSubChild) {
        const entryName = typeof (this.id) !== 'undefined' ? this.id : this.parentEntry;
        console.log(JSON.stringify(this.dataValue));
        this.$store.dispatch('updateEntry', {
          url: entryName + '/' + (newValue.parentIndex + 1),
          payload: this.dataValue[newValue.parentIndex]
        });
      }
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
