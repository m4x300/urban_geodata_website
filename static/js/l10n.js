var langButtons = document.querySelectorAll('.lang-button')
for(var langButton of langButtons) {
  langButton.addEventListener('click', function() {
    var lang = this.value
    document.querySelector('html').setAttribute('lang', lang)
    document.cookie = 'ugd.lang=' + lang + '; path=/; SameSite=strict'
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

var cookieLang = document.cookie.match(/ugd.lang=([^;]+)/)
var lang = cookieLang ? cookieLang[1] : navigator.language.split('-')[0]
if(lang) {
    var btn = document.querySelector('.lang-button[value="' + lang + '"]')
    if(btn) {
        btn.click()
    }
}
