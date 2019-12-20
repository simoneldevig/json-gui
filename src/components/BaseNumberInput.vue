<template>
  <div class="mb2">
    <p v-show="!editPropertyName" class="mt0 mb1"><strong>{{ propertyName }}</strong><i class="ml1 el-icon-edit" @click="editPropName" /></p>
    <el-input v-show="editPropertyName" ref="propertyName" v-model="newPropertyName" size="medium" @change="parseToParent" @blur="editPropertyName = false" />
    <el-input-number v-model="inputValue" size="small" :min="0" @blur="parseToParent" @change="parseToParent" />
  </div>
</template>

<script>
export default {
  name: 'BaseNumberInput',
  props: {
    value: {
      requirred: true,
      type: Number
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
    }
  }
};
</script>
