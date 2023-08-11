import { shallowMount } from '@vue/test-utils'
import AccountContactMissingDialog from '@/dialogs/AccountContactMissingDialog.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)

// Prevent the warning "[Vuetify] Unable to locate target [data-app]"
document.body.setAttribute('data-app', 'true')

describe('AccountContactMissingDialog.vue', () => {
  let vuetify: any

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  it('renders the dialog', () => {
    const wrapper = shallowMount(AccountContactMissingDialog, {
      vuetify,
      propsData: { dialog: true }
    })
    expect(wrapper.find('#dialog-title').text()).toBe('Account Error')
  })

  it('redirects to user profile on OK click', () => {
    // Mocking sessionStorage
    const sessionStorageMock = {
      getItem () {
        return 'https://dev.account.bcregistry.gov.bc.ca'
      }
    }
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock })

    // Mounting the component
    const wrapper = shallowMount(AccountContactMissingDialog, {
      vuetify,
      propsData: { dialog: true }
    })

    // Override window.location.href
    let redirectedUrl = ''
    // eslint-disable-next-line accessor-pairs
    Object.defineProperty(window.location, 'href', {
      set (url: string) {
        redirectedUrl = url
      }
    })

    // Calling the method directly
    wrapper.vm.redirectToUserProfile()

    // Checking the logic inside the method
    expect(redirectedUrl).toBe('https://dev.account.bcregistry.gov.bc.ca/userprofile')
  })
})
