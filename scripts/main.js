  const SKYFACE = {
    elem: {
      visitorLoginModalFormPane: document.querySelector('#visitor-login-modal'),
      visitorLoginModalForm: document.querySelector('#visitor-login-modal-form'),
      visitorName: document.querySelector('#visitorName'),
      visitor: document.querySelector('#visitor'),
      welcomeNote: document.querySelector('#welcome-note'),

      errorPane: document.querySelector('.error-pane'),
      userInputPane: document.querySelector('.user-input-form-pane'),
      userInput: document.querySelector('#userInput'),
      weatherDataPane: document.querySelector('#weather-info'),

      cloud: document.querySelector('[data-weather="cloud"]'),
      cloudDescpt: document.querySelector('[data-weather="cloud_description"]'),
      temp: document.querySelector('[data-weather="temperature"]'),
      humid: document.querySelector('[data-weather="humidity"]'),
      zip: document.querySelector('[data-weather="zipcode"]'),
      country: document.querySelector('[data-weather="country"]')
    },

    identifyVisitor() {
      if ('sessionStorage' in window && !sessionStorage.getItem('visitorIdentified')) {
        console.log('New visitor');
        this.elem.visitorLoginModalFormPane.style.display = 'block'
        this.elem.visitorLoginModalForm.addEventListener('submit', this.loginVisitor, false)
      }
    },

    setVisitorName() {
      try {
        const name = sessionStorage.getItem('visitor')
        if (name) {
          this.elem.visitor.style.display = 'block'
          this.elem.visitor.innerHTML += name
          this.elem.visitorLoginModalFormPane.style.display = 'none'
          this.elem.userInputPane.style.display = 'block'
        }
      } catch (err) {}
    },

    loginVisitor() {
      const visitor = SKYFACE.elem.visitorName.value.trim()
      if (visitor !== '' || undefined) {
        sessionStorage.setItem('visitorIdentified', true)
        sessionStorage.setItem('visitor', visitor)
        SKYFACE.setVisitorName()
        console.log('Visitor identified as %s', visitor)
      }
    },

    init() {
      this.elem.userInput.addEventListener('submit', this.getWeatherData, false)
    },

    getWeatherData() {
      const zipcode = Number(this.zipcode.value || 12345)
      const country_code = this.country_code.value.trim().toLowerCase() || 'us'
      SKYFACE.zipcode = zipcode
      const API_KEY = 'a367d225baacdba14ed8988cdb1237eb'
      const API_URL = `http://api.openweathermap.org/data/2.5/weather?zip=${zipcode},${country_code}&APPID=${API_KEY}&units=imperial`
      console.log(API_URL)

      return fetch(API_URL)
        .then(response => {
          if (response.ok) {
            return response.json()
          } else {
            return Promise.reject(Object.assign({}, response, {
              status: response.status,
              statusText: response.statusText
            }))
          }
        })

        .then(data => {
          console.log(data)
          if (SKYFACE.elem.errorPane.innerHTML) {
            SKYFACE.elem.errorPane.innerHTML = ''
          }
          SKYFACE.elem.welcomeNote.style.display = 'none'
          SKYFACE.elem.weatherDataPane.style.display = 'block'

          SKYFACE.elem.zip.innerHTML = SKYFACE.zipcode
          SKYFACE.elem.country.innerHTML = data.sys.country
          SKYFACE.elem.temp.innerHTML = `${data.main.temp}<sup>o</sup>F`
          SKYFACE.elem.humid.innerHTML = `${data.main.humidity}%`
          SKYFACE.elem.cloud.innerHTML = data.weather[0].main
          SKYFACE.elem.cloudDescpt.innerHTML = data.weather[0].description
        })

        .catch(err => {
          console.log(err)
          if (err.status == 404) {
            SKYFACE.elem.errorPane.innerHTML = `<p>${err.status} ${err.statusText}</p>`
          } else SKYFACE.elem.errorPane.innerHTML = `<p><i class="fas fa-info-circle"></i> Sorry, something went wrong, please check your internet connection and try again</p>`
        })
    }
  }

  window.addEventListener('load', () => {
    SKYFACE.identifyVisitor();
    SKYFACE.setVisitorName()
    SKYFACE.init();
  })