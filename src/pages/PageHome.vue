<template>
  <div class="home mb-3 py-7 px-4 d-flex">
    <div class="col-xs-6">
      <MazCard class="w-100 p-3" max-width="none">
        <h3 class="mb-3">Settings</h3>
        <MazInput
          v-model="settings.quicktypeNameSpace"
          placeholder="Quicktype namespace"
          autocomplete="Enter the namespace to use for generated models with Quicktype"
          class="mb-3"
          clearable
        />
        <div class="d-flex align-items-center">
          <span class="mr-3">Dark mode</span>
          <MazSwitch v-model="settings.darkMode" />
        </div>
        <div class="flex justify-end mt-3">
          <MazBtn rounded size="sm" :loading="isSaving" @click="save">
            {{ buttonText }}
          </MazBtn>
        </div>
      </MazCard>
    </div>
    <div class="col-xs-6">
      <MazCard class="w-100 pb-3" max-width="none">
        <h3 class="p-3">Available endpoints</h3>
        <a v-for="(value, endpoint) in endpoints" :key="value.key" class="home__endpoint d-flex align-items-center justify-content-between px-3 py-2 " :title="endpoint" target="_blank" :href="`http://localhost:5000/api/${endpoint}`">
          http://localhost:5000/api/{{ endpoint }}

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
    quicktypenamespace: '',
    darkMode: true
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
}
</script>

<style lang="scss" scoped>
.home {
  &__endpoint {
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
