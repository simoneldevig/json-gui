<template>
  <div class="referenced-model mb-3 property">
    <PropertyEditor :property-name="propertyName" :model="model" :hide-property-edit="true" />

    <div class="p-relative">
      <MazSearch
        v-model="internalPropertyName"
        :replace-on-select="true"
        :initial-query="selectedModel"
        :items="results"
        item-text="value"
        item-value="value"
        :loading="loading"
        :no-label="true"
        clearable
        @request="querySearch"
        @input="updateModel"
      />
      <router-link :to="`/models/${propertyName}`" class="referenced-model__btn text-decoration-none">
        <MazBtn size="mini" color="grey" rounded>
          <small>Go to model...</small>
        </MazBtn>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import PropertyEditor from '@/components/PropertyEditor.vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BaseDTO } from '@/types';
import { company } from 'faker';

@Component({
  components: {
    PropertyEditor
  }
})
export default class ReferencedModel extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;

  modelToImport = '';
  objectModel: BaseDTO = new BaseDTO();
  results: {[key: string]: any} = [];
  loading = false;
  internalPropertyName = '';
  initialQuery = '';

  get models (): any {
    return this.$store.state.models;
  }

  get selectedModel (): any {
    let selectedModel;
    Object.keys(this.models).forEach(key => {
      if (this.models[key].id === this.model.value) {
        selectedModel = key;
      }
    });
    return selectedModel;
  }

  created () {
    this.internalPropertyName = this.model.value ? this.propertyName : '';
    this.initialQuery = this.model.value ? this.propertyName : '';
    this.objectModel = this.model;
  }

  querySearch (queryString: string) {
    this.loading = true;
    const modelList = Object.keys(this.models).reduce((arr: any, modelName) => {
      arr.push({ value: modelName });
      return arr;
    }, []);
    const results = queryString ? modelList.filter((x: any) => x.value.includes(queryString)) : modelList;
    // call callback function to return suggestions
    this.results = results;
    this.loading = false;
  };

  deleteProp () {
    this.$store.dispatch('deleteModelProperty', {
      id: this.model.id
    });
  }

  updateModel (referencedModel: string) {
    this.objectModel.value = this.models[referencedModel].id;
    this.$store.dispatch('updateModelProperty', {
      propertyName: this.propertyName,
      oldPropertyName: this.propertyName,
      value: this.objectModel
    });
  }
}
</script>

<style lang="scss" scoped>
.referenced-model {
  &:hover {
    .referenced-model__btn {
      opacity: 1;
    }
  }

  &__btn {
    position: absolute;
    top: 50%;
    right: 45px;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
}
</style>
