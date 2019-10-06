<template>
<div>
  <p class="text-capitalize mb0" v-if="isSubChild"><strong>{{propertyName}}</strong></p>
  <el-collapse :accordion="true">
      <el-collapse-item v-for="(entry, index) in dataValue" :title="id" :key="entry.guid">
        <template slot="title">
          <div class="flex items-center ml1">
            <el-tag v-if="!isSubChild" class="mr2" type="info"><pre class="m0">/{{ id }}</pre></el-tag>
            <el-tag v-else type="info">#{{ index }}</el-tag>
          </div>

          <div class="mr3 pr1">
            <el-tooltip class="item" effect="dark" content="Duplicate" placement="top">
              <el-button @click="duplicate(entry)" type="primary" size="medium" icon="el-icon-document-copy" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Add new entry" placement="top">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <el-button @click="deleteEntry(index)" type="danger" size="medium" icon="el-icon-delete-solid" circle></el-button>
            </el-tooltip>
          </div>
        </template>
        <div v-for="(property, propertyName) in entry">
          <string v-if="typeof (property) === 'string'" v-on:value-changed="setValue" :value="property" :parentIndex="index" :propertyName="propertyName"></string>
          <number v-if="typeof (property) === 'number'" v-on:value-changed="setValue" :value="property" :parentIndex="index" :propertyName="propertyName"></number>
          <boolean v-if="typeof (property) === 'boolean'" v-on:value-changed="setValue" :value="property" :parentIndex="index" :propertyName="propertyName"></boolean>
          <recursive-collapse v-if="typeof (property) === 'object'" v-on:value-changed="setValue" :data="property" :parentEntry="id" :is-sub-child="true" :propertyName="propertyName"></recursive-collapse>
        </div>
      </el-collapse-item>
    </el-collapse>
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
        dataValue: ''
      };
    },
    created() {
      this.dataValue = this.data;
    },
    watch: {
      data () {
        this.dataValue = this.data;
      }
    },
    methods: {
      generateGuid () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },
      duplicate (entry) {
        console.log(entry)
        let duplicateEntry = {};
        duplicateEntry = entry;
        duplicateEntry.guid = this.generateGuid();
        this.dataValue.push(entry);
        console.log(this.dataValue)
      },
      deleteEntry (index) {
        console.log(index);
      },
      setValue (newValue) {
        this.dataValue[newValue.parentIndex][newValue.propertyName] = newValue.value;
        if (!this.hisSubChild) {
          const entryName = typeof (this.id) !== 'undefined' ? this.id : this.parentEntry;
          console.log(JSON.stringify(this.dataValue))
          this.$store.dispatch('updateEntry', {
            url: entryName + '/' + (newValue.parentIndex + 1),
            payload: this.dataValue[newValue.parentIndex]
          });
        }
      }
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
</style>