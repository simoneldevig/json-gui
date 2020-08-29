<template>
  <div class="mb2 property">
    <PropertyEditor :propertyName="propertyName" :model="model" />
    <el-autocomplete
      ref="input"
      v-model="objectModel.value"
      class="w-100"
      placeholder="Please Input"
      :trigger-on-focus="true"
      :fetch-suggestions="querySearch"
      type="textarea"
      :autosize="{ minRows: 1}"
      :popper-append-to-body="false"
      @blur="updateModel"
    />
  </div>
</template>

<script>
import faker from 'faker';
import PropertyEditor from '@/components/PropertyEditor.vue';

export default {
  name: 'BaseStringInput',
  components: {
    PropertyEditor
  },
  props: {
    model: {
      default () {
        return {};
      },
      requirred: true,
      type: Object
    },
    propertyName: {
      default: '',
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      objectModel: {},
      fakerList: []
    };
  },
  created () {
    this.objectModel = this.model;
    this.generateFakerList();
  },
  methods: {
    querySearch (queryString, cb) {
      var fakerList = this.fakerList;
      var results = queryString ? fakerList.filter(this.createFilter(queryString)) : fakerList;
      // call callback function to return suggestions
      cb(results);
    },
    createFilter (queryString) {
      return (fakerMethod) => {
        return (fakerMethod.value.toLowerCase().includes(queryString.toLowerCase()));
      };
    },
    generateFakerList () {
      let modules = Object.keys(faker);
      let _self = this;
      modules = modules.sort();
      modules.forEach(function (module) {
        const ignore = ['locale', 'locales', 'localeFallback', 'definitions', 'fake'];
        if (ignore.indexOf(module) !== -1) {
          return;
        }        
        for (const method in faker[module]) {
          if (typeof faker[module][method] === "function") {
            let fakerMethod = {};
            fakerMethod.value = 'faker.' + module + '.' + method + '()';
            if (_self.fakerList.indexOf(fakerMethod) === -1) {
              _self.fakerList.push(fakerMethod);
            }
          }
        }
      });
    },
    updateModel () {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.propertyName,
        oldPropertyName: this.propertyName, 
        value: this.objectModel
      });
    }
  }
};
</script>
