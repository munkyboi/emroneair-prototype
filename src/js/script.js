
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========         MAIN SCRIPTS FOR F8PHOTO          =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================



let __PAGE__ = ''
let __VH__ = window.innerHeight * 0.01;

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
    $(window).trigger('scroll')
    $(window).trigger('resize')

    document.documentElement.style.setProperty('--vh', `${__VH__}px`);

    // $(window).scroll(function(e) {
    //   const scrolled = document.body.scrollTop || document.documentElement.scrollTop
    //   if (scrolled >= 60) {
    //     $('body').addClass('page-scrolled')
    //   } else {
    //     $('body').removeClass('page-scrolled')
    //   }
    // })

    // MAIN
    const MainContainer = document.querySelector('body > app > .main > .content > .context')
    const MainPS = new PerfectScrollbar(MainContainer, {
      wheelSpeed: 2,
      wheelPropagation: false,
      minScrollbarLength: 20,
      suppressScrollX: true
    })
    MainContainer.addEventListener('ps-scroll-y', (e) => {
      if (e.target.scrollTop > 60) {
        $('body').addClass('page-scrolled')
      } else {
        $('body').removeClass('page-scrolled')
      }
    })

    // SIDEBAR
    $('.burger').on('click', function(e) {
      e.preventDefault()
      $('body').toggleClass('show-sidebar')
    })
    $('.sidebar-overlay').on('click', function(e) {
      e.preventDefault()
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
      e.preventDefault()
      $('body').addClass('show-context')
    })
    $('.control-hide').on('click', function(e) {
      e.preventDefault()
      $('body').removeClass('show-context')
      setTimeout(() => {
        MainContainer.scrollTo(0,0)
      }, 300)
    })
    const AsideContainer = document.querySelector('.aside  .list')
    const AsidePS = new PerfectScrollbar(AsideContainer, {
      wheelSpeed: 2,
      wheelPropagation: false,
      minScrollbarLength: 20
    })

    // ASIDE SEARCH FIELD
    $('.aside .search .form-control').on('keyup', function(e) {
      if (e.currentTarget.value.length > 0) {
        $(this).parent().addClass('not-empty')
      } else {
        $(this).parent().removeClass('not-empty')
      }
    })
    $('.aside .search .clear').on('click', function(e) {
      e.preventDefault()
      $(this).parent().removeClass('not-empty')
      $(this).parent().find('.form-control').val('')
    })

    // TABS SCROLLBAR
    const TabsContainer = document.querySelector('.tabs .tabs-container')
    const TabsPS = new PerfectScrollbar(TabsContainer, {
      // handlers: ['keyboard', 'wheel', 'touch'],
      wheelSpeed: 2,
      wheelPropagation: false,
      minScrollbarLength: 20
    })
  }
})()

$(window).on('resize', function(e) {
  __VH__ = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${__VH__}px`);
})
