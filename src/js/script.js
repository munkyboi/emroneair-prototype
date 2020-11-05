
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
    asideCurrentTab: 0,
    asideTabs: document.querySelectorAll('.aside .aside-tabs .nav-item'),
    asideTotalTabs: document.querySelectorAll('.aside .aside-tabs .nav-item').length - 1,
    contentCurrentTab: 0,
    contentTabs: document.querySelectorAll('.content-wrapper .nav-tabs .nav-item'),
    contentTotalTabs: document.querySelectorAll('.content-wrapper .nav-tabs .nav-item').length - 1,
    contentTabPositions: [],
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

  // QUILL
  initiateQuill()

  // SKETCHPAD
  initiateSketchpad()

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
        $('body').addClass('show-viewlist-context')
        $parentlist.addClass('show-viewlist-context')
        const $item = $(this).closest('.list-item')
        clearSelectableList($item, $('.viewlist .list'))
        $item.addClass('active')
      })
      $list.find('.close').on('click', function(e) {
        e.preventDefault()
        $parentlist = $(this).closest('.viewlist')
        $('body').removeClass('show-viewlist-context')
        $parentlist.removeClass('show-viewlist-context')
        $parentlist.find('.list-item.active').removeClass('active')
      })
      $list.find('.viewlist-content-overlay').on('click', function(e) {
        e.preventDefault()
        $parentlist = $(this).closest('.viewlist')
        $('body').removeClass('show-viewlist-context')
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

  // ASIDE TABS EVENT
  $('.aside .nav-tabs a').on('show.bs.tab', function(e) {
    const tabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
    tabs.forEach((tab, i) => {
      if (tab === e.target) {
        globalStates.ui.asideCurrentTab = i
      }
    })
    // console.log('aaaaaaaaaaaaaaaaaa', $(this))
  //   exitAllViewlist()
  //   if (typeof e.currentTarget.dataset.consist !== undefined) {
  //     // console.log('datatables...')
  //   }
  })

  // CONTENT TABS EVENT
  document.querySelectorAll('.content-wrapper .nav-tabs .nav-item').forEach(tab => {
    // globalStates.ui.contentTabPositions.push(tab.getBoundingClientRect().left)
    globalStates.ui.contentTabPositions.push(tab.getBoundingClientRect().left + Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0))
  })

  
  $('.content-wrapper .nav-tabs .nav-item').on('show.bs.tab', function(e) {
    exitAllViewlist();
    const tabsArrayLoc = globalStates.ui.contentTabPositions
    const tabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item');
    tabs.forEach((tab, i) => {
      if (tab === e.target) {
        globalStates.ui.contentCurrentTab = i;
      }
    });

    console.log(tabsArrayLoc)

    const tab = $(this);
    const tabcontainer = $('.content-wrapper .tabs-container');
    const tabwrapper = $('.content-wrapper .nav-tabs');
    const tabLocX = tabsArrayLoc[globalStates.ui.contentCurrentTab] + tab.width();
    const vw = window.outerWidth;
    console.log(tabLocX, vw);
    // if (tabLocX >= vw) {
      tabcontainer.animate({
        scrollLeft: tabsArrayLoc[globalStates.ui.contentCurrentTab]
      })
    // }
    console.log(tabwrapper[0].getBoundingClientRect().left, tabcontainer.scrollLeft())
  });

  // TABS SCROLLBAR
  // const TabsContainers = document.querySelectorAll('.tabs .tabs-container')
  // if (TabsContainers && TabsContainers.length) {
  //   TabsContainers.forEach(cont => {
  //     new PerfectScrollbar(cont, {
  //       // handlers: ['keyboard', 'wheel', 'touch'],
  //       wheelSpeed: 2,
  //       wheelPropagation: false,
  //       minScrollbarLength: 20,
  //       suppressScrollY: true
  //     })
  //   })
  // }
  

  // DYNAMIC DIALOG EVENT AND AJAX
  $('#dynamicDialog').on('show.bs.modal', function (event) {
    const button = $(event.relatedTarget)
    const title = button.data('title')
    const content = button.data('content')
    const size = button.data('size')
    const type = button.data('type')
    const modal = $(this)
    const _this = this
    modal.find('.modal-dialog').addClass(size)
    modal.find('.modal-title').text(title)
    if (type === 'image') {
      const img = new Image()
      img.src = content
      modal.addClass('imageViewer')
      modal.find('.modal-body').html(img)
      // modal.find('.modal-title').html('View Image')
      modal.find('.modal-footer').hide()
    } else {
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
          initiateQuill(_this)
          initiateSketchpad(_this)
        }
      })
    }
  })
  $('#dynamicDialog').on('hidden.bs.modal', function (event) {
    modal = $(this)
    modal.find('.modal-dialog').removeClass(['modal-sm', 'modal-lg', 'modal-xl'])
    modal.find('.modal-footer').show()
    modal.find('.modal-footer').html($('<button type="button" class="btn btn-default" data-dismiss="modal"><i class="mdi mdi-close"></i><span>Close</span></button><button type="button" class="btn btn-success"><i class="mdi mdi-check"></i><span>Save</span></button>'))
  })

  // ACCORDIONS
  $('.collapse').on('show.bs.collapse', function(event) {
    const accordion = $(this).closest('.accordion')
    accordion.addClass('show')
  })
  $('.collapse').on('hide.bs.collapse', function(event) {
    const accordion = $(this).closest('.accordion')
    accordion.removeClass('show')
  })
  hammerTime()



  windowResized()
  window.onresize = windowResized
}

// HAMMER TIME!
const hammerTime = () => {
  const asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  const asideTabLength = asideTabs.length - 1
  const hammerContainer = document.querySelector('.aside')
  var hammertime = new Hammer(hammerContainer);

  hammertime.on('swipeleft swiperight', function(ev) {
    if (ev.type === 'swiperight') {
      console.log('move left')
      if (globalStates.ui.asideCurrentTab > 0) {
        globalStates.ui.asideCurrentTab--
      } else {
        globalStates.ui.asideCurrentTab = asideTabLength
      }
    } else if (ev.type === 'swipeleft') {
      console.log('move right')
      if (globalStates.ui.asideCurrentTab < asideTabLength) {
        globalStates.ui.asideCurrentTab++
      } else {
        globalStates.ui.asideCurrentTab = 0
      }
    }
    $(asideTabs[globalStates.ui.asideCurrentTab]).tab('show')
  });

  const contentTabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item')
  const contentTabLength = contentTabs.length - 1
  const hammerContainerContent = document.querySelector('.content-wrapper .content-body')
  var hammertimeContent = new Hammer(hammerContainerContent);

  hammertimeContent.on('swipeleft swiperight', function(ev) {
    if (ev.type === 'swiperight') {
      console.log('move left')
      if (globalStates.ui.contentCurrentTab > 0) {
        globalStates.ui.contentCurrentTab--
      } else {
        globalStates.ui.contentCurrentTab = contentTabLength
      }
    } else if (ev.type === 'swipeleft') {
      console.log('move right')
      if (globalStates.ui.contentCurrentTab < contentTabLength) {
        globalStates.ui.contentCurrentTab++
      } else {
        globalStates.ui.contentCurrentTab = 0
      }
    }
    $(contentTabs[globalStates.ui.contentCurrentTab]).tab('show')
  });
}

// UTILITIES AND FUNCTIONS
const exitAllViewlist = () => {
  $('body').removeClass('show-viewlist-context')
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

// https://github.pytes.net/tail.DateTime/
const initiateDateTimePicker = (ref = document) => {
  if (ref.querySelectorAll('[data-toggle="datepicker"]').length > 0) {
    const pickers = ref.querySelectorAll('[data-toggle="datepicker"]')
    pickers.forEach(picker => {
      if (picker.classList.contains('current')) {
        picker.value = moment().format('MM/DD/YYYY')
      }
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
      if (picker.classList.contains('current')) {
        picker.value = moment().format('MM/DD/YYYY h:mm:ss A')
      }
      tail.DateTime(picker, {
        closeButton: false,
        time12h: true,
        dateFormat: 'mm/dd/YYYY',
        timeFormat: 'G:ii:ss A',
      });
    });
  }
  if (ref.querySelectorAll('[data-toggle="timepicker"]').length > 0) {
    const pickers = ref.querySelectorAll('[data-toggle="timepicker"]')
    pickers.forEach(picker => {
      if (picker.classList.contains('current')) {
        picker.value = moment().format('h:mm:ss A')
      }
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

// https://quilljs.com/docs/configuration/
const initiateQuill = (ref = document) => {
  if (ref.querySelectorAll('.editor').length > 0) {
    const editors = ref.querySelectorAll('.editor')
    editors.forEach(editor => {
      const container = editor.querySelector('.editor-field')
      const input = editor.querySelector('.editor-input')
      const quill = new Quill(container, {
        theme: 'snow',
      })
      quill.on('text-change', function(delta, oldDelta, source) {
        if (source == 'user') {
          input.value = quill.root.innerHTML
        }
      })
    })
  }
}

// https://theisensanders.com/responsive-sketchpad/
const initiateSketchpad = (ref = document) => {
  if (ref.querySelectorAll('.sketchpad').length > 0) {
    const sketchpads = ref.querySelectorAll('.sketchpad')
    sketchpads.forEach(sketchpad => {
      const container = sketchpad.querySelector('.sketchpad-canvas')
      const sizeSelect = sketchpad.querySelector('.sketchpad-size select')
      const colorBlack = sketchpad.querySelector('.sketchpad-colors .color-black')
      const colorRed = sketchpad.querySelector('.sketchpad-colors .color-red')
      const colorGreen = sketchpad.querySelector('.sketchpad-colors .color-green')
      const colorBlue = sketchpad.querySelector('.sketchpad-colors .color-blue')
      const undo = sketchpad.querySelector('.sketchpad-actions .undo')
      const redo = sketchpad.querySelector('.sketchpad-actions .redo')
      const clear = sketchpad.querySelector('.sketchpad-actions .clear')
      const pad = new Sketchpad(container, {
        line: {
          color: '#000000',
          size: 5
        },
        height: 400
      })
      $(sizeSelect).on('change', function(e) {
        pad.setLineSize(e.currentTarget.value)
      })
      $(colorBlack).on('click', function(e) {
        pad.setLineColor(e.currentTarget.value)
      })
      $(colorRed).on('click', function(e) {
        pad.setLineColor(e.currentTarget.value)
      })
      $(colorGreen).on('click', function(e) {
        pad.setLineColor(e.currentTarget.value)
      })
      $(colorBlue).on('click', function(e) {
        pad.setLineColor(e.currentTarget.value)
      })
      $(clear).on('click', function(e) {
        if (confirm('Are you sure you want to erase everything?')) {
          pad.clear()
        }
      })
      $(undo).on('click', function(e) {
        pad.undo()
      })
      $(redo).on('click', function(e) {
        pad.redo()
      })
    })
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