<template>
  <div class="mb2">
      <p class="text-capitalize mt0 mb0"><strong>{{propertyName}}</strong></p>
      <el-input type="textarea" @blur="parseToParent" :autosize="{ minRows: 1}" v-model="inputValue"></el-input>
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
        this.$emit('value-changed', {propertyName: this.propertyName, value: this.inputValue, parentIndex: this.parentIndex})
      }
    }
  }
</script>