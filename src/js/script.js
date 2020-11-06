
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
    name: '',
  },
  toasts: {},
  ui: {
    pageLoading: false,
    showMenu: false,
    debugMode: true,
    page: __PAGE__,
    aside: __ASIDE__,
    asideCurrentTab: 0,
    asideTabs: '',
    asideTotalTabs: '',
    contentCurrentTab: 0,
    contentTabs: '',
    contentTotalTabs: '',
    contentTabPositions: [],
    contentTabWidth: [],
    content: __CONTENT__,
    fab: __FAB__,
    vw: 0,
    vh: 0,
  },
  context: {
    contextType: '',
    contextURL: '',
    contextTitle: '',
    contextPage: '',
    asideListTarget: '',
    asideListItemSelected: '',
    asideShowContent: false,
    showContext: false,
    showViewlistContext: false,
    viewlistTarget: '',
    viewlistItemSelected: '',
  }
};

// STATE MANAGEMENT
var globalStates = ObservableSlim.create(__GLOBAL_STATES__, true, function(changes) {
  console.log(__GLOBAL_STATES__, changes);
  changes.map((change) => {
    const property = change.property
    // MOBILE PRELOADER
    if (property === 'pageLoading') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('page-loading')
      } else {
        document.querySelector('body').classList.remove('page-loading')
      }
    // BURGER
    } else if (property === 'showMenu') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-sidebar')
      } else {
        document.querySelector('body').classList.remove('show-sidebar')
      }
    // EXITING CONTEXT EVENT
    } else if (property === 'showContext') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-context')
      } else {
        document.querySelector('body').classList.remove('show-context')
      }
    // VIEWLIST CONTEXT
    } else if (property === 'showViewlistContext') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-viewlist-context')
      } else {
        document.querySelector('body').classList.remove('show-viewlist-context')
        globalStates.context.viewlistTarget.classList.add('show-viewlist-context')
        const handleListActive = new Promise((res, rej) => {
          res(
            globalStates.context.viewlistTarget.__getTarget
              .querySelectorAll('.list-item')
              .forEach((e) => {
                e.classList.remove('active')
              })
          )
        })
        handleListActive.then(() => {
          return globalStates.context.viewlistTarget.classList.remove('show-viewlist-context')
        })
      }
    // MAIN CONTEXT AJAX
    } else if (property === 'contextURL') {
      if (change.newValue !== '') {
        globalStates.context.showContext = false
        globalStates.ui.pageLoading = true
        if (globalStates.context.contextType === 'page') {
          const contentWrapper = $('.content .content-wrapper')
          $.ajax({
            url: change.newValue,
            beforeSend: function() {
              contentWrapper.html('<div class="ajaxloader"><div><div></div></div></div>')
            },
            success: function(result) {
              contentWrapper.html(result)
            },
            complete: function() {
              const _this = document.querySelector('.content .content-wrapper')
              hammerTimeContent()
              initiateViewlistFunctions()
              initiateDatatables()
              initiateDateTimePicker(_this)
              initiateQuill(_this)
              initiateSketchpad(_this)
              initiateAccordions()
              globalStates.context.showContext = true
              globalStates.ui.pageLoading = false
            }
          })
        }
      } else {
        exitAllViewlist()
        globalStates.context.showContext = false
        document.querySelector('.content-wrapper').innerHTML = ''
      }
    // ASIDE LIST ACTIVE
    } else if (property === 'asideListItemSelected') {
      if (change.newValue !== '') {
        const handleListActive = new Promise((res, rej) => {
          res(
            document.querySelectorAll('.aside .list-selectable')
              .forEach((el) => {
                el.querySelectorAll('.list-item')
                  .forEach((e) => {
                    e.classList.remove('active')
                  })
              })
          )
        })
        handleListActive.then(() => {
          return change.newValue.classList.add('active')
        })
        handleListActive.then(() => {
          globalStates.context.contextType = change.newValue.querySelector('.list-link').getAttribute('data-type')
          globalStates.context.contextTitle = change.newValue.querySelector('.primary-text').innerHTML;
          globalStates.context.contextURL = change.newValue.querySelector('.list-link').getAttribute('data-content') + '?name=' + convertToSlug(change.newValue.querySelector('.primary-text').innerHTML)
          globalStates.context.viewlistItemSelected = ''
          globalStates.context.viewlistTarget = ''
        })
      }
    // VIEWLIST ACTIVE
    } else if (property === 'viewlistItemSelected') {
      if (change.newValue !== '') {
        const handleListActive = new Promise((res, rej) => {
          res(
            globalStates.context.viewlistTarget.__getTarget
              .querySelectorAll('.list-item')
              .forEach((e) => {
                e.classList.remove('active')
              })
          )
        })
        handleListActive.then(() => {
          return globalStates.context.viewlistItemSelected.__getTarget.classList.add('active')
        })
        handleListActive.then(() => {
          return globalStates.context.viewlistTarget.classList.add('show-viewlist-context')
        })
      }
    // CONTEXT TITLE
    } else if (property === 'contextTitle') {
      document.querySelector('.navbar .navbar-center .title-place').innerHTML = change.newValue
    } else if (property === 'vh') {
      document.documentElement.style.setProperty('--vh', `${change.newValue}px`);
    } else if (property === 'vw') {
      document.documentElement.style.setProperty('--vw', `${change.newValue}px`);
    }
  })
});

globalStates.ui.pageLoading = true

const initScripts = () => {

  globalStates.ui.pageLoading = false

  // DATATABLES
  initiateDatatables()

  // TOOLTIP
  initiateTooltips()

  // DATEPICKER
  initiateDateTimePicker()

  // QUILL
  initiateQuill()

  // SKETCHPAD
  initiateSketchpad()
  
  // ASIDE HAMMER TIME!
  hammerTimeAside()

  // MAIN CONTENT SCROLL DETECTION
  $('body > app > .main > .content .content-body').on('scroll', function(e) {
    if (e.currentTarget.scrollTop > 60) {
      $('body').addClass('page-scrolled')
    } else {
      $('body').removeClass('page-scrolled')
    }
  })

  // BURGER SIDEBAR
  $('.burger').on('click', function(e) {
    e.preventDefault()
    globalStates.ui.showMenu = true
  })
  $('.sidebar-overlay').on('click', function(e) {
    e.preventDefault()
    globalStates.ui.showMenu = false
  })

  // ASIDE LISTS
  initiateAsideList()

  $('.control-hide').on('click', function(e) {
    e.preventDefault()
    // update global state
    globalStates.context.contextURL = ''
    globalStates.context.asideListItemSelected = ''
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
  })

  // TODO: REFACTOR
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
          modal.find('.modal-body').html('<div class="ajaxloader"><div><div></div></div></div>')
        },
        success: function(result) {
          modal.find('.modal-body').html(result)
        },
        complete: function() {
          initiateDatatables()
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

  // WINDOW EVENTS
  windowResized()
  window.onresize = windowResized
}

// ========================================
// ======= UTILITIES AND FUNCTIONS ========
// ========================================

// HAMMER TIME!
const hammerTimeAside = () => {
  globalStates.ui.asideCurrentTab = 0
  globalStates.ui.asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  globalStates.ui.asideTotalTabs = document.querySelectorAll('.aside .aside-tabs .nav-item').length - 1
  const asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  if (asideTabs.length > 0) {
    const hammerContainer = document.querySelector('.aside')
    var hammertime = new Hammer(hammerContainer);

    hammertime.on('swipeleft swiperight', function(ev) {
      if (ev.type === 'swiperight') {
        // console.log('move left')
        if (globalStates.ui.asideCurrentTab > 0) {
          globalStates.ui.asideCurrentTab--
        } else {
          globalStates.ui.asideCurrentTab = globalStates.ui.asideTotalTabs
        }
      } else if (ev.type === 'swipeleft') {
        // console.log('move right')
        if (globalStates.ui.asideCurrentTab < globalStates.ui.asideTotalTabs) {
          globalStates.ui.asideCurrentTab++
        } else {
          globalStates.ui.asideCurrentTab = 0
        }
      }
      $(asideTabs[globalStates.ui.asideCurrentTab]).tab('show')
    });
  }
}

const hammerTimeContent = () => {
  iterateTabs()
  const contentTabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item')
  if (contentTabs.length > 0) {
    const hammerContainerContent = document.querySelector('.content-wrapper .content-body')
    var hammertimeContent = new Hammer(hammerContainerContent)

    hammertimeContent.on('swipeleft swiperight', function(ev) {
      if (ev.type === 'swiperight') {
        // console.log('move left')
        if (globalStates.ui.contentCurrentTab > 0) {
          globalStates.ui.contentCurrentTab--
        } else {
          globalStates.ui.contentCurrentTab = globalStates.ui.contentTotalTabs
        }
      } else if (ev.type === 'swipeleft') {
        // console.log('move right')
        if (globalStates.ui.contentCurrentTab < globalStates.ui.contentTotalTabs) {
          globalStates.ui.contentCurrentTab++
        } else {
          globalStates.ui.contentCurrentTab = 0
        }
      }
      $(contentTabs[globalStates.ui.contentCurrentTab]).tab('show')
      const tabcontainer = $('.content-wrapper .tabs-container');
      if (tabcontainer.scrollLeft() !== tabcontainer.width()) {
        tabcontainer.stop().animate({
          scrollLeft: globalStates.ui.contentTabPositions[globalStates.ui.contentCurrentTab]
        }, 300)
      }
    });
  }
  $('.content-wrapper .nav-tabs .nav-item').on('hide.bs.tab', function(e) {
  })
  $('.content-wrapper .nav-tabs .nav-item').on('show.bs.tab', function(e) {
    exitContentViewlist();
    const tabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item');
    tabs.forEach((tab, i) => {
      if (tab === e.target) {
        globalStates.ui.contentCurrentTab = i;
      }
    });
  });
}

const exitContentViewlist = () => {
  globalStates.context.showViewlistContext = false
  globalStates.context.viewlistItemSelected = ''
}
const exitAllViewlist = () => {
  globalStates.context.contextTitle = ''
  $('body').removeClass('show-viewlist-context')
  $('.aside').each(function(i, e) {
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

const initiateDatatables = () => {
  if ($('.datatables').length) {
    $('.datatables').DataTable({
      "scrollX": true,
      "order": [[ 0, "asc" ]]
    })
  }
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

const initiateViewlistFunctions = () => {
  if ($('.viewlist').length) {
    $('.viewlist').each(function(i, e) {
      $list = $(this)
      $list.find('.list-link').on('click', function(e) {
        e.preventDefault()
        globalStates.context.showViewlistContext = true
        globalStates.context.viewlistTarget = e.target.closest('.viewlist')
        globalStates.context.viewlistItemSelected = e.target.closest('.list-item')
      })
      $list.find('.close').on('click', function(e) {
        e.preventDefault()
        exitContentViewlist()
      })
      $list.find('.viewlist-content-overlay').on('click', function(e) {
        e.preventDefault()
        exitContentViewlist()
      })
    })
  }
}

function convertToSlug(Text) {
  return Text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'')
      ;
}

const initiateAccordions = () => {
  // ACCORDIONS
  if ($('.collapse').length) {
    $('.collapse').on('show.bs.collapse', function(event) {
      const accordion = $(this).closest('.accordion')
      accordion.addClass('show')
    })
    $('.collapse').on('hide.bs.collapse', function(event) {
      const accordion = $(this).closest('.accordion')
      accordion.removeClass('show')
    })
  }
}

const windowResized = () => {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.01;
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.01;
  // if (document.documentElement.style.length === 0) {
  //   document.documentElement.style.setProperty('--vw', `${vw}px`);
  //   document.documentElement.style.setProperty('--vh', `${vh}px`);
  // }
  globalStates.ui.vw = vw;
  globalStates.ui.vh = vh;
}

// CONTENT TABS ITERATION
const iterateTabs = (ref = document) => {
  globalStates.ui.contentCurrentTab = 0
  const vw = Math.max(ref.documentElement.clientWidth || 0, window.innerWidth || 0)
  const asideWidth = ref.querySelector('.aside').clientWidth
  const sidebarWidth = ref.querySelector('.sidebar').clientWidth
  ref.querySelectorAll('.content-wrapper .nav-tabs .nav-item').forEach(tab => {
    globalStates.ui.contentTabWidth.push(tab.clientWidth)
    const tabLeft = tab.getBoundingClientRect().left - 1
    if (vw < 812) {
      globalStates.ui.contentTabPositions.push(tabLeft + vw)
    } else if (vw < 1024) {
      globalStates.ui.contentTabPositions.push(tabLeft - asideWidth)
    } else {
      globalStates.ui.contentTabPositions.push(tabLeft - asideWidth - sidebarWidth)
    }
  })
  globalStates.ui.contentTabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item')
  globalStates.ui.contentTotalTabs = document.querySelectorAll('.content-wrapper .nav-tabs .nav-item').length - 1
}

const initiateTooltips = (ref = document) => {
  if (ref.querySelectorAll('[data-toggle="tooltip"]').length > 0) {
    $(ref.querySelectorAll('[data-toggle="tooltip"]')).tooltip()
  }
}

const initiateAsideList = () => {
  if ($('.aside .list-selectable').length) {
    $('.aside .list-selectable').each(function(e) {
      $aside = $(this)
      $aside.find('.list-link').on('click', function(e) {
        e.preventDefault()
        globalStates.context.asideListTarget = e.target.closest('.list-selectable')
        globalStates.context.asideListItemSelected = e.target.closest('.list-item')
      })
    })
  }
}

// Document Ready
jQuery(function() {
  initScripts()
})