<template>
  <div class="property mb-3">
    <PropertyEditor :property-name="propertyName" :model="model" :siblings="siblings" />
    <MazSearch
      :value="objectModel.value"
      :replace-on-select="true"
      :initial-query="objectModel.value"
      :items="results"
      item-text="value"
      item-value="value"
      :loading="loading"
      :no-label="true"
      clearable
      :debounce="true"
      :required="true"
      :no-required-symbol="true"
      @request="querySearch"
      @input="updateModel"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import PropertyEditor from '@/components/PropertyEditor.vue';
import { BaseDTO } from '@/types';
import { FakerList } from '@/types/faker';

@Component({
  components: {
    PropertyEditor
  }
})
export default class BaseStringInput extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;
  @Prop({ type: Array, required: true }) readonly siblings!: string[];

  objectModel: BaseDTO = new BaseDTO();
  results: {[key: string]: any} = [];
  loading = false;

  @Watch('objectModel', { deep: true })
  objectModelChanged (): void {
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.propertyName,
      oldPropertyName: this.propertyName,
      value: this.objectModel
    });
  }

  created () {
    this.objectModel = this.model;
  }

  get fakerList (): FakerList {
    return this.$store.getters.getFakerList;
  }

  querySearch (queryString: string) {
    this.loading = true;
    const fakerList = this.fakerList;
    const results = queryString ? fakerList.filter(this.createFilter(queryString)) : fakerList;
    // call callback function to return suggestions
    this.results = results;
    this.loading = false;
  };

  createFilter (queryString: string) {
    return (fakerMethod: any) => {
      return (fakerMethod.value.toLowerCase().includes(queryString.toLowerCase()));
    };
  };

  updateModel (value: string) {
    this.objectModel.value = value;
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.propertyName,
      oldPropertyName: this.propertyName,
      value: this.objectModel
    });
  }
}
</script>
