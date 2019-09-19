<template>
<div>
  <p v-if="isSubChild"><strong>{{propertyName}}</strong></p>
  <el-collapse>
      <el-collapse-item v-for="(entry, index) in data" :title="id">
        <template slot="title">
          <pre v-if="!isSubChild">/{{ id }}</pre>
          <el-tag v-else type="info">#{{ index }}</el-tag>
          <el-tag v-if="!isSubChild" type="success">/GET</el-tag>

          <div>
            <el-tooltip class="item" effect="dark" content="Duplicate" placement="top">
              <el-button type="primary" size="medium" icon="el-icon-document-copy" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Add new entry" placement="top">
              <el-button type="success" size="medium" icon="el-icon-document-add" circle></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="Delete" placement="top">
              <el-button type="danger" size="medium" icon="el-icon-delete-solid" circle></el-button>
            </el-tooltip>
          </div>
        </template>
        <div v-for="(property, propertyName, index) in entry">
          <string v-if="typeof (property) === 'string'" :value="property" :propertyName="propertyName"></string>
          <number v-if="typeof (property) === 'number'" :value="property" :propertyName="propertyName"></number>
          <boolean v-if="typeof (property) === 'boolean'" :value="property" :propertyName="propertyName"></boolean>
          <recursive-collapse v-if="typeof (property) === 'object'" :data="property" :is-sub-child="true" :propertyName="propertyName"></recursive-collapse>
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
        requirred: true,
        type: Array
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
        requirred: true,
        type: String
      }
    },
    data () {
      return {
        inputValue: ''
      };
    },
    created () {
      this.inputValue = this.value;
    }
  }
</script>