<template>
  <div class="referenced-model mb-3 property">
    <PropertyEditor :property-name="propertyName" :model="model" :hide-property-edit="true" />

    <div class="referenced-model__editor d-flex align-items-center">
      <router-link :to="`/models/${propertyName}`" class="text-decoration-none">
        <MazBtn size="mini" color="grey" rounded>
          Go to model...
        </MazBtn>
      </router-link>
    </div>
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

<style lang="scss" scoped>
.referenced-model {
  &__editor {
    height: 46px;
    background: var(--maz-bg-color-light);
    border-radius: var(--maz-border-radius);
    padding: 0 .8571rem;
  }
}
</style>
