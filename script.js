const app = Vue.createApp({
  data() {
    return {
      searchInput: '',
      buffetList: [],
      buffetDetails: false,
      buffetToShowDetails: null,
      eventTypesContent: false,
      buffetToShowEventTypes: null,
      eventTypeList: [],
      buffetName: '',
      eventDate: '',
      guestsEstimation: '',
      disponibilityRequested: false,
      disponibilityResponse: '',
      disponibilityResponseContent: '',
      eventPrice: '',
      social_name: '',
      phone: '',
      email: '',
      address: '',
      neighborhood: '',
      city: '',
      state: '',
      zip_code: '',
      description: '',
      events_per_day: '',
      rating_average: ''
    }
  },

  computed: {
    resultList() {
      if(this.searchInput) {
        return this.buffetList.filter(buffet => {
          return buffet.social_name.toLowerCase().includes(this.searchInput.toLowerCase())
        })
      } else {
        return this.buffetList
      }
    }
  },

  async mounted() {
    this.resultList = await this.getBuffets()
  },

  methods: {
    async getBuffets() {
      let response = await fetch('http://localhost:3000/api/v1/buffets/')
      data = await response.json()
      
      this.buffetList = []

      data.forEach(item => {
        let buffet = new Object()
        buffet.id = item.id
        buffet.social_name = item.social_name
        buffet.phone = item.phone
        buffet.email = item.email
        buffet.address = item.address
        buffet.neighborhood = item.neighborhood
        buffet.city = item.city
        buffet.state = item.state
        buffet.zip_code = item.zip_code
        buffet.description = item.description
        buffet.events_per_day = item.events_per_day

        this.buffetList.push(buffet)
      })
    },

    hideDetails() {
      this.buffetDetails = false
    },

    async showDetails(buffetId) {
      let response = await fetch('http://localhost:3000/api/v1/buffets/' + buffetId)
      data = await response.json()
      console.log(data)
      this.buffetDetails = true
      this.buffetToShowDetails = buffetId
      this.social_name = data.social_name
      this.phone = data.phone
      this.email = data.email
      this.address = data.address
      this.neighborhood = data.neighborhood
      this.city = data.city
      this.state = data.state
      this.zip_code = data.zip_code
      this.description = data.description
      this.events_per_day = data.events_per_day
      if (data.rating_average == null) {
        this.rating_average = '--'
      } else {
        this.rating_average = data.rating_average
      }
    },

    async showEventTypes(buffetId, buffetName) {
      this.buffetName = buffetName
      let response = await fetch('http://localhost:3000/api/v1/buffets/' + buffetId + '/event_types/')
      data = await response.json()
      this.eventTypesContent = true
      this.buffetToShowEventTypes = buffetId
      this.eventTypeList = data
    },

    hideEventTypes() {
      this.eventTypesContent = false
    },

    async checkDisponibility(eventTypeId) {
      let eventDate = this.eventDate
      let guestsEstimation = this.guestsEstimation
      let url = `http://localhost:3000/api/v1/event_types/${eventTypeId}/available?order[event_type_id]=${eventTypeId}&order[event_date]=${eventDate}&order[guests_estimation]=${guestsEstimation}`
      let response = await fetch(url)
      data = await response.json()
      console.log(data)
      this.disponibilityRequested = true
      if (response.status == 422) {
        this.disponibilityResponse = data
        this.disponibilityResponseContent = "O buffet não possui disponibilidade para realizar este evento."
      } else if (response.status == 200) {
        this.disponibilityResponse = data.success
        this.disponibilityResponseContent = "O buffet possui disponibilidade para realizar este evento."
        this.eventPrice = data.event_price
      }
    }
  }

})

app.mount('#app')
