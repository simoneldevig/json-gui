<template>
 <div>
    <p><strong>{{propertyName}}</strong></p>
    <el-input-number v-model="inputValue" :min="0"></el-input-number>
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
        inputValue: ''
      };
    },
    created () {
      this.inputValue = this.value;
    }
  }
</script>