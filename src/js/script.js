
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========         MAIN SCRIPTS FOR F8PHOTO          =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================



let __PAGE__ = '';
let __VH__ = window.innerHeight * 0.01;
let __FAB__ = '';

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

    // DATATABLES
    $('.datatables').DataTable({
      "scrollX": true,
      "order": [[ 0, "asc" ]]
    })

    // TOOLTIP
    $('[data-toggle="tooltip"]').tooltip()

    // DATEPICKER
    $('[data-toggle="datepicker"]').datepicker({
      weekStart: 1,
      daysOfWeekHighlighted: "6,0",
      autoclose: true,
      todayHighlight: true,
      format: 'yyyy-mm-dd'
    });
    $('[data-toggle="datepicker"]').datepicker("setDate", new Date())
    $('.dateselect-icon').on('click', function(e) {
      e.preventDefault()
      const datepicker = $(this).siblings('[data-toggle="datepicker"]')
      datepicker.datepicker('show')
      // const input = $(this).siblings('.form-control')
      // input.trigger('focus')
    })

    // MAIN
    // const MainContainer = document.querySelector('body > app > .main > .content .content-body')
    // if (MainContainer) {
    //   const MainPS = new PerfectScrollbar(MainContainer, {
    //     wheelSpeed: 2,
    //     wheelPropagation: false,
    //     minScrollbarLength: 20,
    //     suppressScrollX: true
    //   })
    //   MainContainer.addEventListener('ps-scroll-y', (e) => {
    //     if (e.target.scrollTop > 60) {
    //       $('body').addClass('page-scrolled')
    //     } else {
    //       $('body').removeClass('page-scrolled')
    //     }
    //   })
    // }
    $('body > app > .main > .content .content-body').on('scroll', function(e) {
      if (e.currentTarget.scrollTop > 60) {
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

    // ASIDE CONTENT
    // const AsideContainer = document.querySelector('.aside  .aside-content')
    // if (AsideContainer) {
    //   const AsidePS = new PerfectScrollbar(AsideContainer, {
    //     wheelSpeed: 2,
    //     wheelPropagation: false,
    //     minScrollbarLength: 20,
    //     suppressScrollX: true
    //   })
    // }
    const AsideListContainers = document.querySelectorAll('.aside  .aside-content .list-container')
    if (AsideListContainers.length > 0) {
      AsideListContainers.forEach(cont => {
        new PerfectScrollbar(cont, {
          wheelSpeed: 2,
          wheelPropagation: false,
          minScrollbarLength: 20,
          suppressScrollX: true
        })
      })
    }

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

    // TABS EVENT
    $('.nav-tabs a').on('show.bs.tab', function(e) {
      if (typeof e.currentTarget.dataset.consist !== undefined) {
        console.log('datatables...')
      }
    });
    // TABS SCROLLBAR
    const TabsContainers = document.querySelectorAll('.tabs .tabs-container')
    if (TabsContainers.length > 0) {
      TabsContainers.forEach(cont => {
        new PerfectScrollbar(cont, {
          // handlers: ['keyboard', 'wheel', 'touch'],
          wheelSpeed: 2,
          wheelPropagation: false,
          minScrollbarLength: 20,
          suppressScrollY: true
        })
      })
    }
    

    // FAB DROPDOWN MENU
    const FABMenuContainer = document.querySelector('.fab > .dropdown-menu > .dropdown-menu-container')
    if (FABMenuContainer) {
      const FABMenuPS = new PerfectScrollbar(FABMenuContainer, {
        wheelSpeed: 2,
        wheelPropagation: false,
        minScrollbarLength: 20,
        suppressScrollX: true
      })
    }
  }
})()

$(window).on('resize', function(e) {
  __VH__ = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${__VH__}px`);
})
