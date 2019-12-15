<template>
  <div class="mb2">
    <p class="text-capitalize mt0 mb1"><strong>{{ propertyName }}</strong></p>
    <el-input type="textarea" :autosize="{ minRows: 1}" @blur="parseToParent" v-model="inputValue"/>
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
    },
    parentIndex: {
      requirred: true,
      type: Number
    }
  },
  data () {
    return {
      inputValue: ''
    };
  },
  created () {
    this.inputValue = this.value;
  },
  methods: {
    parseToParent () {
      this.$emit('value-changed', {propertyName: this.propertyName, value: this.inputValue, parentIndex: this.parentIndex});
    }
  }
};
</script>