<template>
  <div class="mb2">
    <p class="text-capitalize mt0 mb1"><strong>{{ propertyName }}</strong></p>
    <el-input-number v-model="inputValue" @blur="parseToParent" :min="0" @change="parseToParent"/>
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