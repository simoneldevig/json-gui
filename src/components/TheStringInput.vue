<template>
  <el-input :value="property"></el-input>
</template>

<script>
  export default {
    name: 'StringInput',
    props: {
      value: {
        requirred: true,
        type: String
      }
    },
  }
</script>