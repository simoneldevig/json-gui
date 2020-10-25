<template>
  <div class="mb2 property">
    <PropertyEditor :property-name="propertyName" :model="model" :hide-property-edit="true" />

    <router-link :to="`/models/${propertyName}`">
      <el-button class="py1">
        Open up model...
      </el-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import PropertyEditor from '@/components/PropertyEditor.vue';
import { Component, Vue, Prop } from 'vue-property-decorator';
import { BaseDTO } from '@/types';

@Component({
  components: {
    PropertyEditor
  }
})
export default class ReferencedModel extends Vue {
  @Prop({ type: Object, required: true }) readonly model!: BaseDTO;
  @Prop({ type: String, required: true }) readonly propertyName!: string;

  deleteProp () {
    this.$store.dispatch('deleteModelProperty', {
      id: this.model.id
    });
  }
}
</script>
