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
      eventDate: '',
      guestsEstimation: '',    
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
      picture: 'https://i.pinimg.com/originals/75/4f/a1/754fa124b621f260d97c9fd5581251f8.jpg'
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
    },

    async showEventTypes(buffetId) {
      let response = await fetch('http://localhost:3000/api/v1/buffets/' + buffetId + '/event_types/')
      data = await response.json()
      this.eventTypesContent = true
      this.buffetToShowEventTypes = buffetId
      this.eventTypeList = data
      console.log(data)

    },
    async checkDisponibility(eventTypeId) {
      let eventDate = this.eventDate
      let guestsEstimation = this.guestsEstimation
      let order = Object()
      order.event_id = eventTypeId
      order.event_date = eventDate
      order.guests_estimation = guestsEstimation
      console.log(order)
      let response = await fetch('http://localhost:3000/api/v1/event_types/' + eventTypeId + '/available?' + order)
      data = await response.json()
      console.log() 

    }

  }

})

app.mount('#app')