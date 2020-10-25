<template>
  <div class="mb2 property">
    <PropertyEditor :property-name="propertyName" :model="model" />
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

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

import faker from 'faker';
import PropertyEditor from '@/components/PropertyEditor.vue';
import { BaseDTO } from '@/types';

@Component({
  components: {
    PropertyEditor
  }
})
export default class BaseStringInput extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;

  objectModel: BaseDTO = new BaseDTO();
  fakerList: {[key: string]: any} = [];

  created () {
    this.objectModel = this.model;
    this.generateFakerList();
  }

  querySearch (queryString: string, cb: any) {
    const fakerList = this.fakerList;
    const results = queryString ? fakerList.filter(this.createFilter(queryString)) : fakerList;
    // call callback function to return suggestions
    cb(results);
  };

  createFilter (queryString: string) {
    return (fakerMethod: any) => {
      return (fakerMethod.value.toLowerCase().includes(queryString.toLowerCase()));
    };
  };

  generateFakerList () {
    let modules = Object.keys(faker);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _self = this;
    modules = modules.sort();
    modules.forEach((module) => {
      const ignore = ['locale', 'locales', 'localeFallback', 'definitions', 'fake'];
      if (ignore.indexOf(module) !== -1) {
        return;
      }
      for (const method in (faker as any)[module]) {
        if (typeof (faker as any)[module][method] === 'function') {
          const fakerMethod = {
            value: ''
          };
          fakerMethod.value = 'faker.' + module + '.' + method + '()';
          if (_self.fakerList.indexOf(fakerMethod) === -1) {
            _self.fakerList.push(fakerMethod);
          }
        }
      }
    });
  };

  updateModel () {
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.propertyName,
      oldPropertyName: this.propertyName,
      value: this.objectModel
    });
  };
}
</script>
