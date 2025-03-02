<template>
  <div id="amalgamation-regular-information">
    <v-fade-transition>
      <div
        v-show="showSpinner"
        class="loading-container grayed-out"
      >
        <div class="loading__content">
          <v-progress-circular
            color="primary"
            size="50"
            indeterminate
          />
          <div class="loading-msg white--text">
            Fetching data
          </div>
        </div>
      </div>
    </v-fade-transition>

    <!-- Amalgamating Businesses -->
    <section class="mt-10">
      <header id="amalgamating-businesses">
        <h2>Amalgamating Businesses</h2>
        <p class="mt-4">
          Add the amalgamating businesses to the list.
        </p>
        <p class="mt-4">
          <strong>Important:</strong> The amalgamating businesses must be visible on your
          My Business Registry list before the amalgamation filing can be completed.
        </p>
      </header>

      <AmalgamatingBusinesses @valid="amalgamatingBusinessesValid=$event" />
    </section>

    <!-- Resulting Business Name and Type -->
    <section class="mt-10">
      <header id="resulting-business-name">
        <h2>Resulting Business Name and Type</h2>
      </header>

      <ExpandableHelp
        class="mt-4"
        helpLabel="Help with Business Type"
      >
        <template #content>
          <BusinessTypeHelp />
        </template>
      </ExpandableHelp>

      <ResultingBusinessName class="mt-5" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { Getter, Action } from 'pinia-class'
import { useStore } from '@/store/store'
import { CommonMixin, NameRequestMixin } from '@/mixins'
import { CorrectNameOptions, RouteNames } from '@/enums'
import { ExpandableHelp } from '@bcrs-shared-components/expandable-help'
import AmalgamatingBusinesses from '@/components/Amalgamation/AmalgamatingBusinesses.vue'
import ResultingBusinessName from '@/components/Amalgamation/ResultingBusinessName.vue'
import BusinessTypeHelp from '@/components/Amalgamation/BusinessTypeHelp.vue'

@Component({
  components: {
    AmalgamatingBusinesses,
    BusinessTypeHelp,
    ExpandableHelp,
    ResultingBusinessName
  }
})
export default class AmalgamationRegularInformation extends Mixins(CommonMixin, NameRequestMixin) {
  @Getter(useStore) getAmalgamatingBusinessesValid!: boolean
  @Getter(useStore) getCorrectNameOption!: CorrectNameOptions
  @Getter(useStore) getNameTranslationsValid!: boolean
  @Getter(useStore) getShowErrors!: boolean

  @Action(useStore) setIgnoreChanges!: (x: boolean) => void

  // Local properties
  showSpinner = false
  amalgamatingBusinessesValid = false

  /** Array of valid components. Must match validFlags below. */
  readonly validComponents = [
    'amalgamating-businesses',
    'resulting-business-name'
  ]

  /** Whether the Resulting Business Name and Type section is valid. */
  get getResultingBusinessNameValid (): boolean {
    return (this.getNameTranslationsValid && !!this.getCorrectNameOption)
  }

  /** Object of valid flags. Must match validComponents above. */
  get validFlags (): object {
    return {
      validAmalgamatingBusinesses: this.getAmalgamatingBusinessesValid,
      validResultingBusinessName: this.getResultingBusinessNameValid
    }
  }

  /** Called when component is created. */
  created (): void {
    // ignore data changes while page loads
    this.setIgnoreChanges(true)

    // watch data changes once page has loaded (in next tick)
    this.$nextTick(() => {
      this.setIgnoreChanges(false)
    })

    // listen for spinner show/hide events
    this.$root.$on('showSpinner', (flag = false) => { this.showSpinner = flag })
  }

  /** When we route to this step, validate the step and scroll to any errors. */
  @Watch('$route')
  private async scrollToInvalidComponent (): Promise<void> {
    if (this.getShowErrors && this.$route.name === RouteNames.AMALG_REG_INFORMATION) {
      // scroll to invalid components
      await this.$nextTick()
      await this.validateAndScroll(this.validFlags, this.validComponents)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/theme.scss';

.loading-container.grayed-out {
  // these are the same styles as dialog overlay:
  opacity: 0.46;
  background-color: rgb(33, 33, 33); // grey darken-4
  border-color: rgb(33, 33, 33); // grey darken-4
}

#amalgamation-regular-information {
  /* Set "header-counter" to 0 */
  counter-reset: header-counter;
}

h2::before {
  /* Increment "header-counter" by 1 */
  counter-increment: header-counter;
  content: counter(header-counter) '. ';
}

header p {
  padding-top: 0.5rem;
}
</style>
