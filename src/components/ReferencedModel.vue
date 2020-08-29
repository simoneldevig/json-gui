<template>
  <div class="mb2 property">
    <PropertyEditor :propertyName="propertyName" :model="model" :hidePropertyEdit="true" />

    <router-link
          :to="`/models/${propertyName}`"
        >
          <el-button class="py1">
            Open up model...
          </el-button>
        </router-link>
  </div>
</template>

<script>
import PropertyEditor from '@/components/PropertyEditor.vue';

export default {
  name: 'ReferencedModel',
  components: {
    PropertyEditor
  },
  props: {
    model: {
      default () {
        return {};
      },
      requirred: true,
      type: Object
    },
    propertyName: {
      default: '',
      requirred: true,
      type: String
    }
  },
  methods: {
    deleteProp () {
      this.$store.dispatch('deleteModelProperty', {
        id: this.model.id
      });
    }
  }
};
</script>
