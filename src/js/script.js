
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========         MAIN SCRIPTS FOR F8PHOTO          =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================

(() => {
  let quickviewProdId = 0
  const toastDelay = 5000
  const brandSliderView = 6
  const productSliderView = 5

  $(document).ready(function() {
    initScripts()
  })

  // INITIALIZE SCRIPTS
  const initScripts = () => {
    $(window).scroll()
    $(window).resize()

    $(window).scroll(function(e) {
      const scrolled = document.body.scrollTop || document.documentElement.scrollTop
      if (scrolled >= 60) {
        $('body').addClass('page-scrolled')
      } else {
        $('body').removeClass('page-scrolled')
      }
    })

    // SIDEBAR
    $('.burger').on('click', function(e) {
      $('body').toggleClass('show-sidebar')
    })
    $('.sidebar-overlay').on('click', function(e) {
      $('body').toggleClass('show-sidebar')
    })

    // LISTS
    $('.list .list-link').on('click', function(e) {
      const $item = $(this).closest('.list-item')
      $('.list .list-item').each(function(i, e) {
        $(e).removeClass('active')
      })
      $item.addClass('active')
    })

    // ASIDE LISTS
    $('.aside .list-link').on('click', function(e) {
      $('body').addClass('show-context')
    })
    $('.control-hide').on('click', function(e) {
      $('body').removeClass('show-context')
    })
  }
})()
