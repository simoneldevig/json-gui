<template>
  <div class="home mb-3 py-7 px-4 d-flex">
    <div class="col-xs-6">
      <MazCard class="w-100 p-3" max-width="none">
        <h3 class="mb-3">Settings</h3>
        <ValidationObserver v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(save)">
            <ValidationProvider v-slot="{ errors, invalid }" tag="div" class="mb-3" rules="required|alpha">
              <MazInput
                v-model="settings.quicktypeNameSpace"
                placeholder="Quicktype namespace"
                :error="invalid"
                autocomplete="Enter the namespace to use for generated models with Quicktype"
                clearable
              />
              <span v-if="invalid" class="validation-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <div class="flex justify-end mt-3">
              <MazBtn rounded size="sm" :loading="isSaving" type="submit">
                {{ buttonText }}
              </MazBtn>
            </div>
          </form>
        </ValidationObserver>
      </MazCard>
    </div>
    <div class="col-xs-6">
      <MazCard class="w-100 pb-3" max-width="none">
        <h3 class="p-3">Available endpoints</h3>
        <a v-for="(value, endpoint) in endpoints" :key="value.key" class="home__endpoint d-flex align-items-center justify-content-between px-3 py-2 " :title="endpoint" target="_blank" :href="getLink(endpoint)">
          {{ getLink(endpoint) }}

          <MazBtn class="home__endpoint--btn" rounded size="mini">
            Open
          </MazBtn>
        </a>
      </MazCard>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { BaseResponseDTO } from '@/types';
import { MazList, MazListItem } from 'maz-ui';
@Component({ components: { MazList, MazListItem } })
export default class Home extends Vue {
  private settings = {
    quicktypenamespace: ''
  };

  private isSaving = false;
  private buttonText = 'Save';

  @Watch('computedSettings', { deep: true, immediate: true })
  onSettingsChange (): void {
    this.settings = this.computedSettings;
  }

  get computedSettings (): any {
    return this.$store.state.settings;
  }

  get endpoints (): BaseResponseDTO {
    return this.$store.state.endpoints;
  }

  async save () {
    this.isSaving = true;

    await this.$store.dispatch('saveSettings', this.settings).then(() => {
      this.isSaving = false;
      this.buttonText = 'Saved!';

      setTimeout(() => {
        this.buttonText = 'Save';
      }, 2000);
    });
  }

  getLink (path: string) {
    return `${window.location.origin}/${path}`;
  }
}
</script>

<style lang="scss" scoped>
.home {
  &__endpoint {
    font-size: 14px;

    &--btn {
      height: 30px;
      opacity: 0;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.1);

      .home__endpoint--btn {
        opacity: 1;
      }
    }
  }
}
</style>
