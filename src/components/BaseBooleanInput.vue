<template>
  <div class="mb2">
    <div class="mb1 flex justify-between items-center">
      <div>
        <p v-show="!editPropertyName" class="mt0 mb0"><strong>{{ propertyName }}</strong></p>
        <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="parseToParent" @blur="editPropertyName = false" />
      </div>
      <div>
        <el-button class="ml1" type="warning" size="mini" icon="el-icon-edit" circle @click="editPropName" />
        <el-button class="ml1" type="danger" size="mini" icon="el-icon-delete" circle @click="deleteProp" />
      </div>
    </div>
    <el-radio v-model="inputValue" :value="true" :label="true" class="mr1" size="small" border @change="parseToParent">true</el-radio>
    <el-radio v-model="inputValue" :value="false" :label="false" class="mr1" size="small" border @change="parseToParent">false</el-radio>
    <el-radio v-model="inputValue" :value="'random'" :label="'random'" class="mr1" size="small" border @change="parseToParent">random</el-radio>
  </div>
</template>

<script>
export default {
  name: 'BooleanInput',
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
      inputValue: '',
      newPropertyName: '',
      editPropertyName: false
    };
  },
  created () {
    this.inputValue = this.model.value;
    this.newPropertyName = this.propertyName;
  },
  methods: {
    parseToParent () {
      // this.$emit('value-changed', {propertyName: this.newPropertyName, oldPropertyName: this.propertyName, value: this.inputValue});
    },
    editPropName () {
      this.editPropertyName = true;
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
