
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========        MAIN SCRIPTS FOR EMRONEAIR         =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================

var __PAGE__ = '';
var __ASIDE__ = '';
var __CONTENT__ = '';
var __VH__ = window.innerHeight * 0.01;
var __FAB__ = '';
var __DIALOG_NAME__ = 'dialogname';
var __DIALOG_TITLE__ = 'Dialog Title';
var __DIALOG_CONTENT__ = 'Content here...';
var __GLOBAL_STATES__ = {
  dialog: {
    title: '',
    content: '',
    name: ''
  },
  toasts: {},
  ui: {
    debugMode: true,
    page: __PAGE__,
    aside: __ASIDE__,
    content: __CONTENT__,
    fab: __FAB__,
    vw: window.innerWidth * 0.01,
    vh: window.innerHeight * 0.01
  },
  context: {
    contextTitle: '',
    showContext: false,
  }
};

// STATE MANAGEMENT
var globalStates = ObservableSlim.create(__GLOBAL_STATES__, true, function(changes) {
  console.log(__GLOBAL_STATES__, changes);
  changes.map((change) => {
    const property = change.property
    if (property === 'showContext') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-context')
      } else {
        document.querySelector('body').classList.remove('show-context')
      }
    } else if (property === 'contextTitle') {
      if (change.type === 'update') {
        document.querySelector('.navbar .navbar-center .title-place').innerHTML = change.newValue
      }
    } else if (property === 'vh') {
      document.documentElement.style.setProperty('--vh', `${change.newValue}px`);
    } else if (property === 'vw') {
      document.documentElement.style.setProperty('--vw', `${change.newValue}px`);
    }
  })
});

const initScripts = () => {
  // DATATABLES
  $('.datatables').DataTable({
    "scrollX": true,
    "order": [[ 0, "asc" ]]
  })

  // TOOLTIP
  $('[data-toggle="tooltip"]').tooltip()

  // DATEPICKER
  initiateDateTimePicker()

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
  if ($('.list.list-selectable').length) {
    $('.list.list-selectable').each(function(i, e) {
      $list = $(this)
      $list.find('.list-link').on('click', function(e) {
        e.preventDefault()
        const $item = $(this).closest('.list-item')
        clearSelectableList($item, $('.list.list-selectable'))
        $item.addClass('active')
      })
    })
  }

  // VIEWLISTS MOBILE VIEW
  if ($('.viewlist').length) {
    $('.viewlist').each(function(i, e) {
      $list = $(this)
      $list.find('.list-link').on('click', function(e) {
        e.preventDefault()
        $parentlist = $(this).closest('.viewlist')
        $parentlist.addClass('show-viewlist-context')
        const $item = $(this).closest('.list-item')
        clearSelectableList($item, $('.viewlist .list'))
        $item.addClass('active')
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
    // update global state
    globalStates.context.contextTitle = $(this).find('.primary-text').text()
    globalStates.context.showContext = true;

  })
  $('.control-hide').on('click', function(e) {
    e.preventDefault()
    exitAllViewlist()
    setTimeout(() => {
      MainContainer.scrollTo(0,0)
    }, 300)
    // update global state
    globalStates.context.showContext = false;
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
      // console.log('datatables...')
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
  if (FABMenuContainer && FABMenuContainer.length) {
    const FABMenuPS = new PerfectScrollbar(FABMenuContainer, {
      wheelSpeed: 2,
      wheelPropagation: false,
      minScrollbarLength: 20,
      suppressScrollX: true
    })
  }

  // DYNAMIC DIALOG EVENT AND AJAX
  $('#dynamicDialog').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const title = button.data('title')
    const content = button.data('content')
    const size = button.data('size')
    const modal = $(this)
    const _this = this
    modal.find('.modal-dialog').addClass(size)
    modal.find('.modal-title').text(title)
    $.ajax({
      url: content,
      beforeSend: function() {
        modal.find('.modal-body').html('loading content...')
      },
      success: function(result) {
        modal.find('.modal-body').html(result)
      },
      complete: function() {
        initiateDateTimePicker(_this)
      }
    })
  })


  windowResized()
  window.onresize = windowResized
}

  // UTILITIES AND FUNCTIONS
  const exitAllViewlist = () => {
    $('.viewlist').each(function(i, e) {
      $(this).removeClass('show-viewlist-context')
      $(this).find('.list-item.active').removeClass('active')
    })
  }

  const clearSelectableList = (ref, obj) => {
    obj.each(function(i, lists) {
      $(lists).find('.list-item.active').each((i, item) => {
        if (item !== ref) {
          $(item).removeClass('active')
        }
      })
    })
  }

  const initiateDateTimePicker = (ref = document) => {
    if (ref.querySelectorAll('[data-toggle="datepicker"]').length > 0) {
      const pickers = ref.querySelectorAll('[data-toggle="datepicker"]')
      pickers.forEach(picker => {
        tail.DateTime(picker, {
          closeButton: false,
          dateFormat: 'mm/dd/YYYY',
          timeFormat: false,
          time12h: true,
          timeIncrement: false,
          timeHours: false,
          timeMinutes: false,
          timeSeconds: false,
          viewDecades: false,
        });
      });
    }
    if (ref.querySelectorAll('[data-toggle="datetimepicker"]').length > 0) {
      const pickers = ref.querySelectorAll('[data-toggle="datetimepicker"]')
      pickers.forEach(picker => {
        tail.DateTime(picker, {
          closeButton: false,
          time12h: true,
          dateFormat: 'mm/dd/YYYY',
        });
      });
    }
    if (ref.querySelectorAll('[data-toggle="timepicker"]').length > 0) {
      const pickers = ref.querySelectorAll('[data-toggle="timepicker"]')
      pickers.forEach(picker => {
        tail.DateTime(picker, {
          dateFormat: false,
          closeButton: true,
          timeFormat: 'G:ii:ss A',
          time12h: true,
          timeSeconds: null,
        });
      });
    }
  }

  const windowResized = () => {
    console.log('window resized')
    // set global state
    const vw = window.innerWidth * 0.01;
    const vh = window.innerHeight * 0.01;
    if (document.documentElement.style.length === 0) {
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    globalStates.ui.vw = vw;
    globalStates.ui.vh = vh;
  }

// Document Ready
jQuery(function() {
  initScripts()
})