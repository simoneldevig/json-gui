<template>
  <div class="mb2">
    <div class="mb1 flex justify-between items-center">
      <div>
        <p class="mt0 mb1"><strong>{{ propertyName }}</strong></p>
        <router-link
          :to="`/models/${propertyName}`"
        >
          <el-button class="py1">
            Open up model...
          </el-button>
        </router-link>
      </div>
      <div>
        <el-button type="danger" size="mini" icon="el-icon-delete" circle @click="deleteProp" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReferencedModel',
  props: {
    model: {
      requirred: true,
      type: Object
    },
    propertyName: {
      requirred: true,
      type: String
    }
  },
  methods: {
    deleteProp () {
      this.$emit('delete-property', this.newPropertyName);
    }
  }
};
</script>
