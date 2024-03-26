function initLangSwitch() {
  var STORAGE_KEY = 'ugd.lang'
  
  var langButtons = document.querySelectorAll('.lang-button')
  for(var langButton of langButtons) {
    langButton.addEventListener('click', function() {
      var lang = this.value
      document.querySelector('html').setAttribute('lang', lang)
  
      var browserLang = getBrowserLang()
      if(lang === browserLang) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, lang)
      }
  
      this.setAttribute('disabled', 'disabled')
      this.setAttribute('aria-pressed', 'true')
      for(var otherLangButton of langButtons) {
        if(otherLangButton !== this) {
          otherLangButton.removeAttribute('disabled')
          otherLangButton.setAttribute('aria-pressed', 'false')
        }
      }
    })
  }
  
  function getBrowserLang() {
    return navigator.language.split('-')[0]
  }
  
  var storedLang = localStorage.getItem(STORAGE_KEY)
  var lang = storedLang || getBrowserLang()
  if(lang) {
      var btn = document.querySelector('.lang-button[value="' + lang + '"]')
      if(btn) {
          btn.click()
      }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", initLangSwitch)
} else {
  initLangSwitch()
}
