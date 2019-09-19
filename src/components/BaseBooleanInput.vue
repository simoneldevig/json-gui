<template>
  <div>
    <p><strong>{{propertyName}}</strong></p>
    <el-switch
      v-model="inputValue"
      active-text="true"
      inactive-text="false">
    </el-switch>
  </div>
</template>

<script>
  export default {
    name: 'BooleanInput',
    props: {
      value: {
        requirred: true,
        type: Boolean
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