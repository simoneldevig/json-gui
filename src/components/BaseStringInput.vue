<template>
  <div>
      <p><strong>{{propertyName}}</strong></p>
      <el-input type="textarea" :autosize="{ minRows: 1}" v-model="inputValue"></el-input>
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
        inputValue: ''
      };
    },
    created () {
      this.inputValue = this.value;
    }
  }
</script>