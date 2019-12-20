<template>
  <div class="mb2">
    <p v-show="!editPropertyName" class="mt0 mb1">
      <strong>{{ propertyName }}</strong>
      <i class="ml1 el-icon-edit" @click="editPropName" />
      <i class="ml1 el-icon-delete" @click="deleteProp" />
    </p>
    <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="parseToParent" @blur="editPropertyName = false" />
    <el-input v-model="inputValue" type="textarea" :autosize="{ minRows: 1}" @blur="parseToParent" />
  </div>
</template>

<script>
export default {
  name: 'BaseStringInput',
  props: {
    value: {
      requirred: true,
      type: String
    },
    propertyName: {
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
    this.inputValue = this.value;
    this.newPropertyName = this.propertyName;
  },
  methods: {
    parseToParent () {
      this.$emit('value-changed', {propertyName: this.newPropertyName, oldPropertyName: this.propertyName, value: this.inputValue});
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
