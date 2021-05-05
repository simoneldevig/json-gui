<template>
  <div id="app" class="app d-flex" :class="{'maz-is-dark': typeof settings !== 'undefined' && settings.darkMode}">
    <notifications />
    <MazSidebar
      v-model="hasLeftSidebarOpen"
      class="navigation"
    >
      <router-link to="/" class="d-flex justify-content-center my-3">
        <svg class="navigation__logo" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="379.911px" height="129.417px" viewBox="0 0 379.911 129.417" enable-background="new 0 0 379.911 129.417" xml:space="preserve"> <g> <g id="qCCyEX.tif"> <g> <path fill-rule="evenodd" clip-rule="evenodd" class="navigation__logo--background" fill="#003366" d="M0,129.417C0,86.214,0,43.24,0,0c126.656,0,253.235,0,379.911,0 c0,43.204,0,86.177,0,129.417C253.254,129.417,126.676,129.417,0,129.417z M3.069,126.081c41.154,0,82.091,0,123.071,0 c0-41.034,0-81.89,0-122.7c-41.134,0-82.072,0-123.071,0C3.069,44.337,3.069,85.071,3.069,126.081z M209.854,63.737 c0,1.144,0,2.042,0,2.94c0,6.249-0.045,12.499,0.031,18.747c0.02,1.687-0.246,2.927-2.119,3.33 c-4.117,0.887-8.191,2.324-12.348,2.607c-7.416,0.508-14.221-1.787-19.686-6.925c-7.6-7.144-9.428-16.176-7.514-26.109 c1.285-6.661,4.67-12.135,10.473-15.758c8.873-5.539,18.316-6.295,27.869-2.062c3.58,1.587,6.729,4.15,10.322,6.427 c3.715-3.457,7.713-7.176,11.645-10.832c-1.336-1.404-2.525-2.683-3.75-3.927c-0.406-0.411-0.898-0.739-1.357-1.097 c-10.32-8.036-22.193-10.154-34.871-9.064c-10.906,0.937-20.605,4.876-28.324,12.709c-10.867,11.026-13.826,24.515-10.963,39.401 c2.531,13.167,10.146,22.896,22.113,28.489c18.607,8.695,36.713,6.202,54.033-4.212c1.357-0.816,1.939-1.724,1.924-3.377 c-0.084-9.664-0.037-19.33-0.047-28.995c-0.002-0.727-0.092-1.453-0.146-2.294C221.399,63.737,215.844,63.737,209.854,63.737z M244.508,23.206c0,1.149,0,2.048,0,2.946c0,13.413-0.08,26.826,0.045,40.237c0.041,4.479,0.266,9.011,1.002,13.419 c1.916,11.45,7.955,19.988,18.855,24.567c9.004,3.781,18.383,4.166,27.891,2.359c9.912-1.885,17.771-6.779,22.826-15.74 c3.809-6.752,4.717-14.15,4.754-21.701c0.07-14.578,0.023-29.157,0.016-43.735c0-0.728-0.082-1.455-0.133-2.3 c-6.262,0-12.375,0-18.756,0c0,1.035,0,1.932,0,2.828c0,14.079,0.057,28.158-0.045,42.236c-0.021,3.136-0.332,6.322-0.959,9.394 c-2.688,13.139-19.83,18.625-29.965,9.71c-4.494-3.954-5.977-9.215-6.059-14.795c-0.227-15.491-0.148-30.987-0.189-46.481 c-0.002-0.951,0-1.902,0-2.944C257.196,23.206,251.045,23.206,244.508,23.206z M358.104,106.198c0-27.829,0-55.349,0-82.878 c-6.383,0-12.576,0-18.797,0c0,27.73,0,55.251,0,82.878C345.637,106.198,351.78,106.198,358.104,106.198z" /> <path fill-rule="evenodd" clip-rule="evenodd" class="navigation__logo--text" fill="#FFFFFF" d="M209.854,63.737c5.99,0,11.545,0,17.285,0 c0.055,0.841,0.145,1.567,0.146,2.294c0.01,9.665-0.037,19.331,0.047,28.995c0.016,1.653-0.566,2.561-1.924,3.377 c-17.32,10.414-35.426,12.907-54.033,4.212c-11.967-5.593-19.582-15.322-22.113-28.489c-2.863-14.887,0.096-28.375,10.963-39.401 c7.719-7.833,17.418-11.772,28.324-12.709c12.678-1.09,24.551,1.028,34.871,9.064c0.459,0.357,0.951,0.686,1.357,1.097 c1.225,1.244,2.414,2.522,3.75,3.927c-3.932,3.656-7.93,7.375-11.645,10.832c-3.594-2.276-6.742-4.84-10.322-6.427 c-9.553-4.233-18.996-3.478-27.869,2.062c-5.803,3.623-9.188,9.097-10.473,15.758c-1.914,9.934-0.086,18.966,7.514,26.109 c5.465,5.138,12.27,7.433,19.686,6.925c4.156-0.283,8.23-1.721,12.348-2.607c1.873-0.403,2.139-1.644,2.119-3.33 c-0.076-6.248-0.031-12.498-0.031-18.747C209.854,65.779,209.854,64.881,209.854,63.737z" /> <path fill-rule="evenodd" clip-rule="evenodd" class="navigation__logo--text" fill="#FFFFFF" d="M244.508,23.206c6.537,0,12.688,0,19.283,0 c0,1.042-0.002,1.993,0,2.944c0.041,15.494-0.037,30.99,0.189,46.481c0.082,5.58,1.564,10.841,6.059,14.795 c10.135,8.915,27.277,3.429,29.965-9.71c0.627-3.071,0.938-6.258,0.959-9.394c0.102-14.078,0.045-28.157,0.045-42.236 c0-0.896,0-1.793,0-2.828c6.381,0,12.494,0,18.756,0c0.051,0.845,0.133,1.572,0.133,2.3c0.008,14.578,0.055,29.157-0.016,43.735 c-0.037,7.551-0.945,14.949-4.754,21.701c-5.055,8.961-12.914,13.855-22.826,15.74c-9.508,1.807-18.887,1.422-27.891-2.359 c-10.9-4.579-16.939-13.117-18.855-24.567c-0.736-4.408-0.961-8.939-1.002-13.419c-0.125-13.411-0.045-26.824-0.045-40.237 C244.508,25.254,244.508,24.355,244.508,23.206z" /> <path fill-rule="evenodd" clip-rule="evenodd" class="navigation__logo--text" fill="#FFFFFF" d="M358.104,106.198c-6.324,0-12.467,0-18.797,0 c0-27.627,0-55.147,0-82.878c6.221,0,12.414,0,18.797,0C358.104,50.85,358.104,78.369,358.104,106.198z" /> </g> </g> </g> <g> <path class="navigation__logo--background" fill="#003366" d="M28.231,65.212c0.942,0.613,1.719,1.237,2.332,1.873c0.612,0.636,1.106,1.342,1.484,2.12 c0.376,0.777,0.636,1.66,0.777,2.649c0.142,0.989,0.212,2.144,0.212,3.462v11.8c0,0.942,0.058,1.719,0.176,2.332 c0.117,0.611,0.341,1.083,0.671,1.414c0.329,0.329,0.812,0.553,1.449,0.672c0.636,0.116,1.495,0.176,2.579,0.176h1.484v9.186 h-6.077c-1.885,0-3.486-0.199-4.805-0.601c-1.319-0.401-2.403-1.06-3.25-1.978c-0.848-0.919-1.473-2.108-1.873-3.569 c-0.4-1.46-0.601-3.25-0.601-5.37V76.023c0-2.214-0.33-3.827-0.989-4.84c-0.66-1.012-1.791-1.684-3.392-2.014v-8.691 c2.92-0.565,4.381-2.59,4.381-6.077V41.047c0-4.145,0.812-7.102,2.438-8.868c1.625-1.767,4.392-2.649,8.302-2.649h5.865v9.186 h-1.413c-1.037,0-1.885,0.047-2.544,0.141c-0.66,0.095-1.166,0.307-1.519,0.636c-0.354,0.33-0.59,0.801-0.707,1.413 c-0.118,0.613-0.176,1.413-0.176,2.402v11.8c0,1.508-0.07,2.745-0.212,3.709c-0.141,0.966-0.388,1.814-0.742,2.544 c-0.353,0.731-0.848,1.39-1.484,1.979C29.963,63.929,29.173,64.553,28.231,65.212z" /> <path class="navigation__logo--background" fill="#003366" d="M60.983,74.893h12.012L59.994,98.281h-8.197L60.983,74.893z M58.228,57.793c0-1.13,0.212-2.201,0.636-3.215 c0.424-1.013,1.013-1.896,1.767-2.65c0.753-0.753,1.636-1.342,2.65-1.766c1.012-0.424,2.084-0.636,3.215-0.636 c1.13,0,2.201,0.212,3.215,0.636c1.013,0.424,1.896,1.013,2.65,1.766c0.753,0.754,1.342,1.637,1.766,2.65 c0.424,1.014,0.636,2.084,0.636,3.215s-0.212,2.202-0.636,3.215c-0.424,1.014-1.013,1.897-1.766,2.649 c-0.754,0.754-1.637,1.343-2.65,1.767c-1.014,0.424-2.084,0.636-3.215,0.636c-1.131,0-2.203-0.212-3.215-0.636 c-1.014-0.424-1.897-1.013-2.65-1.767c-0.754-0.752-1.343-1.636-1.767-2.649C58.439,59.995,58.228,58.923,58.228,57.793z" /> <path class="navigation__logo--background" fill="#003366" d="M101.012,65.212c-0.942-0.611-1.73-1.236-2.367-1.872c-0.636-0.636-1.13-1.343-1.484-2.12 c-0.354-0.777-0.601-1.66-0.742-2.649c-0.141-0.989-0.212-2.143-0.212-3.462V43.237c0-0.989-0.07-1.79-0.212-2.402 c-0.141-0.612-0.389-1.083-0.742-1.413c-0.353-0.329-0.848-0.541-1.484-0.636c-0.636-0.094-1.448-0.141-2.438-0.141h-1.484V29.53 h6.077c3.627,0,6.289,0.86,7.984,2.579c1.695,1.72,2.543,4.699,2.543,8.938v13.354c0,2.215,0.329,3.828,0.99,4.84 c0.659,1.014,1.79,1.685,3.391,2.014v8.691c-2.921,0.66-4.381,2.685-4.381,6.077v13.354c0,4.145-0.812,7.102-2.438,8.868 c-1.625,1.768-4.37,2.649-8.232,2.649h-5.935v-9.186h1.413c1.036,0,1.883-0.048,2.544-0.142c0.659-0.094,1.166-0.306,1.519-0.636 c0.353-0.33,0.588-0.802,0.707-1.413c0.117-0.613,0.176-1.413,0.176-2.402V75.246c0-1.413,0.082-2.615,0.248-3.604 c0.165-0.989,0.424-1.86,0.777-2.614c0.354-0.753,0.836-1.425,1.449-2.014C99.292,66.426,100.07,65.825,101.012,65.212z" /> </g> </svg>
      </router-link>

      <div>
        <router-link to="/" class="navigation__menu-item d-flex align-items-center pr-3 pl-6 py-2">
          Home
        </router-link>
      </div>

      <div>
        <div class="navigation__menu-item d-flex align-items-center pr-3 pl-6 py-2 p-relative" @click="setCollapseItem('endpoints')">
          <span class="material-icons mr-2 navigation__menu-icon p-absolute" :class="{'navigation__menu-icon--open': activeCollapse.includes('endpoints')}">
            arrow_right
          </span>
          Endpoints
        </div>
        <MazTransitionExpand>
          <div v-show="activeCollapse.includes('endpoints')">
            <router-link v-for="(value, propertyName) in endpoints" :key="propertyName" :to="'/endpoints/' + propertyName" class="navigation__menu-item navigation__menu-item--sub d-flex align-items-center justify-content-between pr-3 pl-6 py-2">
              <span class="d-flex align-items-center">
                <span class="material-icons mr-2">
                  cloud_queue
                </span>
                {{ propertyName }}
              </span>
              <div class="d-flex">
                <span class="material-icons navigation__menu-settings p-1 rounded mr-1" title="Duplicate" @click.prevent="duplicate(propertyName, 'endpoints')">
                  content_copy
                </span>
                <span class="material-icons navigation__menu-settings p-1 rounded" title="Settings" @click.prevent="openEditItemDialog(propertyName, 'endpoint')">
                  more_horiz
                </span>
              </div>
            </router-link>
            <div class="navigation__menu-item navigation__menu-item--sub d-flex align-items-center pr-3 pl-6 py-2" @click="openNewItemDialog('endpoint')">
              <span class="material-icons mr-2">
                add
              </span>
              <span>Add new endpoint</span>
            </div>
          </div>
        </MazTransitionExpand>
      </div>

      <div>
        <div class="navigation__menu-item d-flex align-items-center pr-3 pl-6 py-2 p-relative" @click="setCollapseItem('models')">
          <span class="material-icons mr-2 navigation__menu-icon p-absolute" :class="{'navigation__menu-icon--open': activeCollapse.includes('models')}">
            arrow_right
          </span>
          Models
        </div>
        <MazTransitionExpand>
          <div v-show="activeCollapse.includes('models')">
            <router-link v-for="(value, propertyName) in models" :key="propertyName" :to="'/models/' + propertyName" class="navigation__menu-item navigation__menu-item--sub d-flex align-items-center justify-content-between pr-3 pl-6 py-2">
              <span class="d-flex align-items-center">
                <span class="material-icons mr-2">
                  folder_open
                </span>
                {{ propertyName }}
              </span>
              <div class="d-flex">
                <span class="material-icons navigation__menu-settings p-1 rounded mr-1" title="Duplicate" @click.prevent="duplicate(propertyName, 'models')">
                  content_copy
                </span>
                <span class="material-icons navigation__menu-settings p-1 rounded" title="Settings" @click.prevent="openEditItemDialog(propertyName, 'model')">
                  more_horiz
                </span>
              </div>
            </router-link>
            <div class="navigation__menu-item navigation__menu-item--sub d-flex align-items-center pr-3 pl-6 py-2" @click="openNewItemDialog('model')">
              <span class="material-icons mr-2">
                add
              </span>
              <span>Add new model</span>
            </div>
          </div>
        </MazTransitionExpand>
      </div>
    </MazSidebar>

    <div class="container-fluid content">
      <router-view />
    </div>
    <ValidationObserver v-slot="{ handleSubmit }">
      <MazDialog
        v-model="createDialogVisible"
        :width="600"
        :title="`Create new ${newItemType}`"
        @closed="resetDialogState"
      >
        <ValidationProvider v-slot="{ errors, invalid, touched }" :mode="newItemName.length ? 'aggressive' : 'passive'" class="mb-3" tag="div" :rules="`required|alpha|${newItemType}`">
          <MazInput
            ref="createInput"
            v-model="newItemName"
            placeholder="Insert your new item name"
            clearable
            class="mb-3"
            :error="touched && invalid && errors.length > 0"
            @input="setnewItemName"
            @keyup.enter="createNewItem"
          />
          <MazSelect
            v-if="newItemType === 'endpoint'"
            v-model="selectedItemType"
            placeholder="Choose property type"
            :options="propertyTypeOptions"
          />
          <span v-if="touched && invalid" class="validation-error">{{ errors[0] }}</span>
        </ValidationProvider>
        <span slot="footer" class="dialog-footer">
          <MazBtn rounded size="sm" color="grey" class="mr-2" @click="createDialogVisible=false">
            Cancel
          </MazBtn>
          <MazBtn rounded size="sm" :loading="isLoading" @click="handleSubmit(createNewItem)">
            Create
          </MazBtn>
        </span>
      </MazDialog>
    </ValidationObserver>

    <ValidationObserver v-slot="{ handleSubmit }">
      <MazDialog
        v-model="editDialogVisible"
        :width="600"
        :title="`Edit ${editItemName}`"
        @closed="resetDialogState"
      >
        <ValidationProvider v-slot="{ errors, invalid, touched }" :mode="newItemName !== editItemName ? 'aggressive' : 'passive'" class="mb-3" tag="div" :rules="newItemName !== editItemName ? `required|alpha|${editType}` : 'required|alpha'">
          <MazInput
            ref="editInput"
            v-model="newItemName"
            placeholder="Edit your item name"
            clearable
            :error="touched && invalid && errors.length > 0"
            @input="setnewItemName"
            @keyup.enter="editEntry"
          />
          <span v-if="touched && invalid" class="validation-error">{{ errors[0] }}</span>
        </ValidationProvider>

        <span slot="footer" class="d-flex justify-content-between w-100">
          <MazBtn rounded size="sm" :loading="isLoading" color="danger" @click="deleteEntry">
            Delete item
          </MazBtn>
          <div>
            <MazBtn rounded size="sm" color="grey" class="mr-2" @click="editDialogVisible=false">
              Cancel
            </MazBtn>
            <MazBtn rounded size="sm" :loading="isLoading" color="success" @click="handleSubmit(editEntry)">
              Save
            </MazBtn>
          </div>
        </span>
      </MazDialog>
    </ValidationObserver>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapMutations } from 'vuex';

import { BaseResponseDTO } from '@/types';
import { resetObjectIds } from '@/utils';
import 'maz-ui/lib/css/base.css';

@Component({
  methods: {
    ...mapMutations([
      'setFakerList'
    ])
  }
})
export default class App extends Vue {
  private createDialogVisible = false;
  private editDialogVisible = false;
  private newItemName = '';
  private newItemType = '';
  private selectedItemType = 'array';
  private propertyTypeOptions: any = [
    { label: 'Array', value: 'array' },
    { label: 'Object', value: 'object' }
  ];

  private editItemName = '';
  private editType = '';
  private isLoading = false;
  private activeCollapse: string[] = [];
  private hasLeftSidebarOpen = true;
  setFakerList!: () => any;

  created () {
    this.$store.dispatch('getSettings');
    this.$store.dispatch('getModels');
    this.$store.dispatch('getEndpoints');
    this.$store.dispatch('getEndpoints');
    this.setFakerList();

    if (Object.keys(this.$route.params).length) {
      this.activeCollapse.push(this.$route.params.type);
    }
  }

  get endpoints (): BaseResponseDTO {
    return this.$store.state.endpoints;
  }

  get models (): BaseResponseDTO {
    return this.$store.state.models;
  }

  get settings (): any {
    return this.$store.state.settings;
  }

  setnewItemName (newItemName: string) {
    this.newItemName = newItemName;
  };

  openNewItemDialog (type: string) {
    this.createDialogVisible = true;
    this.newItemType = type;
    this.$nextTick(() => {
      (this.$refs.createInput as any).focusInput();
    });
  }

  async duplicate (itemName: string, itemType: string) {
    const duplicate = resetObjectIds(Vue.prototype.$lodash.cloneDeep((this as any)[itemType][itemName]));
    const numberOfDuplicates = Object.keys((this as any)[itemType]).filter((x: string|string[]) => x.includes(itemName)).length;

    const newItemName = `${itemName}-copy${numberOfDuplicates > 1 ? numberOfDuplicates : ''}`;

    try {
      await this.$store.dispatch('duplicateEntry', {
        type: itemType,
        id: newItemName,
        payload: duplicate
      }).then(() => {
        this.$router.push(`/${itemType}/${newItemName}`);
      });
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error(ex);
      this.$notify({
        title: 'Warning',
        text: 'An error happened. Please check the console',
        type: 'warning'
      });
    }
  }

  openEditItemDialog (itemName: string, itemType: string) {
    this.editDialogVisible = true;
    this.editItemName = itemName;
    this.newItemName = itemName;
    this.editType = itemType;
    this.$nextTick(() => {
      (this.$refs.editInput as any).focusInput();
    });
  }

  async editEntry () {
    this.editDialogVisible = false;
    await this.$store.dispatch('editEntry', {
      type: `${this.editType}s`,
      name: this.editItemName,
      newName: this.newItemName
    }).then(() => {
      this.$notify({
        title: `${this.editItemName} has been renamed`,
        text: '',
        type: 'success'
      });
      if (this.$route.params.id === this.editItemName) {
        this.$router.push(`/${this.editType}/${this.newItemName}`);
      }
    });
  };

  createNewItem () {
    this.createDialogVisible = false;
    this.$store.dispatch('createNewItem', {
      type: this.newItemType,
      propertyType: this.newItemType === 'endpoint' ? this.selectedItemType : 'model',
      name: this.newItemName
    });
  };

  resetDialogState () {
    this.editItemName = '';
    this.newItemName = '';
    this.selectedItemType = 'array';
    this.newItemType = '';
    this.editType = '';
  }

  async deleteEntry () {
    this.isLoading = true;
    await this.$store.dispatch('deleteEntry', {
      type: `${this.editType}s`,
      name: this.editItemName
    }).then(() => {
      this.$notify({
        title: `${this.editItemName} has been deleted`,
        text: '',
        type: 'success'
      });
      if (this.$route.params.id === this.editItemName) {
        this.$router.push('/');
      }
      this.isLoading = false;
      this.editDialogVisible = false;
    });
  }

  setCollapseItem (item: string): void {
    const itemIndex = this.activeCollapse.indexOf(item);
    if (itemIndex !== -1) {
      this.activeCollapse.splice(itemIndex, 1);
    } else {
      this.activeCollapse.push(item);
    }
  }
};
</script>

<style lang="scss">
  .content {
    flex: 1;
  }

  .navigation {
    position: sticky;
    min-height: 100vh;
    padding-left: 0 !important;

    &__menu {
      height: 100%;
      overflow: auto;
    }

    &__logo {
      margin: 10px 0;
      height: 45px;

      &--background {
        fill: var(--maz-primary);
      }

      &--text {
        fill: transparent;
      }
    }

    &__menu-item {
      cursor: pointer;
      text-decoration: none;
      color: var(--text-color);

      &--sub {
        .material-icons {
          font-size: 14px;
        }
      }

      &:hover,
      &.router-link-exact-active {
        background: rgba(255, 255, 255, 0.1);

        .navigation__menu-settings {
          visibility: visible;
          opacity: 1;
        }
      }
    }

    &__menu-settings {
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease-in-out;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    &__menu-icon {
      transition: transform 0.2s ease-in-out;
      left: 15px;

      &--open {
        transform: rotate(90deg);
      }

      &--setings {
        font-size: 18px;
      }
    }

  }
</style>
