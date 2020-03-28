<template>
  <div class="mb2">
    <div class="mb1 flex justify-between items-center">
      <div>
        <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
        <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="updateModel" @blur="editPropertyName = false" />
      </div>
      <div>
        <el-button class="ml1" type="warning" size="mini" icon="el-icon-edit" circle @click="editPropName" />
        <el-button class="ml1" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteProp" />
      </div>
    </div>
    <el-autocomplete
      ref="input"
      v-model="objectModel.value"
      class="w-100"
      placeholder="Please Input"
      :trigger-on-focus="true"
      :fetch-suggestions="querySearch"
      type="textarea"
      :autosize="{ minRows: 1}"
      @blur="updateModel"
    />
    <!-- <el-input v-model="inputValue" ref="input" type="textarea" :autosize="{ minRows: 1}" @blur="parseToParent" /> -->
  </div>
</template>

<script>
const faker = require('faker');

export default {
  name: 'BaseStringInput',
  props: {
    model: {
      requirred: true,
      type: Object
    },
    propertyName: {
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      inputValue: '',
      objectModel: {},
      newPropertyName: '',
      editPropertyName: false,
      fakerList: []
    };
  },
  created () {
    this.objectModel = this.model;
    this.newPropertyName = this.propertyName;
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
    parseToParent () {
      this.$emit('value-changed', {propertyName: this.newPropertyName, oldPropertyName: this.propertyName, value: this.inputValue});
    },
    updateModel () {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.newPropertyName,
        oldPropertyName: this.propertyName, 
        value: this.objectModel
      });
    },
    editPropName () {
      this.editPropertyName = !this.editPropertyName;
      this.$nextTick(() => {
        this.$refs.propertyName.focus();
      });
    },
    deleteProp () {
      this.$emit('delete-property', this.newPropertyName);
    }
  }
};
</script>
