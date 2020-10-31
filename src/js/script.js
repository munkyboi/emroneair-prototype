
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
let __DIALOG_NAME__ = 'dialogname';
let __DIALOG_TITLE__ = 'Dialog Title';
let __DIALOG_CONTENT__ = 'Content here...';

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
    if (document.querySelectorAll('[data-toggle="datepicker"]').length > 0) {
      const pickers = document.querySelectorAll('[data-toggle="datepicker"]')
      pickers.forEach(picker => {
        new Pikaday({
          field: picker,
          format: 'MM/DD/YYYY',
          onSelect: function() {
              console.log(this.getMoment().format('Do MMMM YYYY'));
          }
        })
      });
    }
    // $('[data-toggle="datepicker"]').datepicker({
    //   weekStart: 1,
    //   daysOfWeekHighlighted: "6,0",
    //   autoclose: true,
    //   todayHighlight: true,
    //   format: 'yyyy-mm-dd'
    // });
    // $('[data-toggle="datepicker"]').datepicker("setDate", new Date())
    // $('.dateselect-icon').on('click', function(e) {
    //   e.preventDefault()
    //   const datepicker = $(this).siblings('[data-toggle="datepicker"]')
    //   datepicker.datepicker('show')
    //   // const input = $(this).siblings('.form-control')
    //   // input.trigger('focus')
    // })

    // MAIN CONTENT SCROLL DETECTION
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

    // LISTS SELECT
    if ($('.list').length) {
      $('.list').each(function(i, e) {
        $list = $(this)
        $list.find('.list-link').on('click', function(e) {
          e.preventDefault()
          const $item = $(this).closest('.list-item')
          const $parentlist = $(this).closest('.list')
          $parentlist.find('.list-item.active').removeClass('active')
          $item.addClass('active')
        })
      })
    }

    // VIEWLISTS MOBILE VIEW
    if ($('.viewlist').length) {
      $('.viewlist').each(function(i, e) {
        $list = $(this)
        console.log($list)
        $list.find('.list-link').on('click', function(e) {
          $parentlist = $(this).closest('.viewlist')
          $parentlist.addClass('show-viewlist-context')
        })
        $list.find('.close').on('click', function(e) {
          e.preventDefault()
          $parentlist = $(this).closest('.viewlist')
          $parentlist.removeClass('show-viewlist-context')
          $parentlist.find('.list-item.active').removeClass('active')
        })
        $list.find('.viewlist-content-overlay').on('click', function(e) {
          e.preventDefault()
          $parentlist = $(this).closest('.viewlist')
          $parentlist.removeClass('show-viewlist-context')
          $parentlist.find('.list-item.active').removeClass('active')
        })
      })
    }

    // ASIDE LISTS
    $('.aside .list-link').on('click', function(e) {
      e.preventDefault()
      $('body').addClass('show-context')
      const title = $(this).find('.primary-text').text()
      $('.navbar .navbar-center .title-place').html(title)

    })
    $('.control-hide').on('click', function(e) {
      e.preventDefault()
      exitAllViewlist()
      $('body').removeClass('show-context')
      setTimeout(() => {
        MainContainer.scrollTo(0,0)
      }, 300)
    })

    // ASIDE CONTENT SCROLLBAR
    const AsideListContainers = document.querySelectorAll('.list-container')
    if (AsideListContainers && AsideListContainers.length) {
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
      exitAllViewlist()
      if (typeof e.currentTarget.dataset.consist !== undefined) {
        console.log('datatables...')
      }
    })

    // TABS SCROLLBAR
    const TabsContainers = document.querySelectorAll('.tabs .tabs-container')
    if (TabsContainers && TabsContainers.length) {
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
    

    // FAB POPUP MENU SCROLLBAR
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

  // DYNAMIC DIALOG EVENT AND AJAX
  $('#dynamicDialog').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const title = button.data('title')
    const content = button.data('content')
    const size = button.data('size')
    const modal = $(this)
    modal.find('.modal-dialog').addClass(size)
    modal.find('.modal-title').text(title)
    $.ajax({
      url: content,
      beforeSend: function() {
        modal.find('.modal-body').html('loading content...')
      },
      success: function(result) {
        modal.find('.modal-body').html(result)
      }
    })
  })

  // UTILITIES AND FUNCTIONS
  function exitAllViewlist() {
    $('.viewlist').each(function(i, e) {
      $(this).removeClass('show-viewlist-context')
      $(this).find('.list-item.active').removeClass('active')
    })
  }
})()

$(window).on('resize', function(e) {
  __VH__ = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${__VH__}px`);
})
