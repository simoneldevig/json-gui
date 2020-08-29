<template>
  <div class="mb2 property">
    <PropertyEditor :propertyName="propertyName" :model="model" />

    <el-radio v-model="objectModel.value" :value="true" :label="true" class="mr1" size="small" border @change="updateModel">true</el-radio>
    <el-radio v-model="objectModel.value" :value="false" :label="false" class="mr1" size="small" border @change="updateModel">false</el-radio>
    <el-radio v-model="objectModel.value" :value="'random'" :label="'random'" class="mr1" size="small" border @change="updateModel">random</el-radio>
  </div>
</template>

<script>
import PropertyEditor from '@/components/PropertyEditor.vue';

export default {
  name: 'BooleanInput',
  components: {
    PropertyEditor
  },
  props: {
    model: {
      default: null,
      requirred: true,
      type: Object
    },
    propertyName: {
      default: null,
      requirred: true,
      type: String
    }
  },
  data () {
    return {
      editPropertyName: false
    };
  },
  created () {
    this.objectModel = this.model;
  },
  methods: {
    updateModel () {
      this.$store.dispatch('updateModelProperty', {
        propertyName: this.propertyName,
        oldPropertyName: this.propertyName, 
        value: this.objectModel
      });
    },
    editPropName () {
      this.editPropertyName = true;
      this.$nextTick(() => {
        this.$refs.propertyName.focus();
      });
    },
    deleteProp () {
      this.$store.dispatch('deleteModelProperty', {
        id: this.model.id
      });
    }
  }
};
</script>
