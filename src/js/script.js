
// ============================================================
// ============================================================
// ============================================================
// ============================================================
// ========        MAIN SCRIPTS FOR EMRONEAIR         =========
// ============================================================
// ============================================================
// ============================================================
// ============================================================

var __EMR_GLOBAL_STATES__ = {
  dialog: {
    dialogTitle: '',
    dialogContent: '',
    dialogName: '',
    dialogContentURL: '',
  },
  toasts: {},
  ui: {
    preloaderStr: '<div class="ajaxloader"><div><div></div></div></div>',
    pageLoading: false,
    showMenu: false,
    debugMode: true,
    page: '',
    aside: '',
    asideCurrentTab: 0,
    asideTabs: '',
    asideTotalTabs: '',
    contentCurrentTab: 0,
    contentTabs: '',
    contentTotalTabs: '',
    contentTabPositions: [],
    contentTabWidth: [],
    content: '',
    fab: '',
    vw: 0,
    vh: 0,
    isMobile: false,
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
var emrGlobalStates = ObservableSlim.create(__EMR_GLOBAL_STATES__, true, function(changes) {
  console.log(__EMR_GLOBAL_STATES__, changes);
  changes.map((change) => {
    const property = change.property

    // ======================================
    // HANDLE MAIN PAGE PRELOADER
    // ======================================
    if (property === 'pageLoading') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('page-loading')
      } else {
        document.querySelector('body').classList.remove('page-loading')
      }

    // ======================================
    // HANDLE MENU BURGER
    // ======================================
    } else if (property === 'showMenu') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-sidebar')
      } else {
        document.querySelector('body').classList.remove('show-sidebar')
      }

    // ======================================
    // SHOW MAIN CONTEXT EVENT
    // ======================================
    } else if (property === 'showContext') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-context')
      } else {
        document.querySelector('body').classList.remove('show-viewlist-context')
        document.querySelector('body').classList.remove('show-context')
      }

    // ======================================
    // SHOW VIEWLIST CONTEXT EVENT
    // ======================================
    } else if (property === 'showViewlistContext') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('show-viewlist-context')
        emrGlobalStates.context.viewlistTarget.__getTarget.classList.add('show-viewlist-context')
      } else {
        document.querySelector('body').classList.remove('show-viewlist-context')
        emrGlobalStates.context.viewlistTarget.__getTarget.classList.remove('show-viewlist-context')
        if (emrGlobalStates.context.viewlistTarget) {
          if (emrGlobalStates.context.viewlistTarget.__getTarget.querySelector('.list-item.active')) {
            emrGlobalStates.context.viewlistTarget.__getTarget.querySelector('.list-item.active').classList.remove('active')
          }
        }
      }

    // ======================================
    // HANDLE MAIN CONTEXT AJAX
    // ======================================
    } else if (property === 'contextURL') {
      if (change.newValue !== '') {
        if (emrGlobalStates.context.contextType === 'page') {
          const contentWrapper = document.querySelector('.content .content-wrapper')
          async function doAjax(args) {
            let result
            try {
              result = await $.ajax({
                url: change.newValue,
                type: 'GET',
                data: args,
                beforeSend: () => {
                  emrGlobalStates.context.showContext = false
                  emrGlobalStates.ui.pageLoading = true
                  emrGlobalStates.ui.contentCurrentTab = 0
                  emrGlobalStates.ui.contentTabPositions = []
                  emrGlobalStates.ui.contentTabWidth = []
                  document.querySelector('.content-wrapper').innerHTML = ''
                  contentWrapper.innerHTML = emrGlobalStates.ui.preloaderStr
                }
              })
              return result
            }
            
            catch (err) {
              console.log(err)
            }
          }
          doAjax()
            .then((data) => {
              contentWrapper.innerHTML = data
              return 'html insert done'
            })
            .then((res) => {
              console.log(res)
              const hamm = new Promise((res) => {
                res(hammerTimeContent(contentWrapper))
              })
            })
        }
      } else {
        emrGlobalStates.context.asideListItemSelected = ''
        emrGlobalStates.context.showContext = false
        emrGlobalStates.ui.contentTabPositions = []
        emrGlobalStates.ui.contentTabWidth = []
        document.querySelector('.content-wrapper').innerHTML = ''
      }

    // ======================================
    // HANDLE ASIDE LIST SELECTABLE
    // ======================================
    } else if (property === 'asideListItemSelected') {
      if (change.newValue !== '') {
        if (document.querySelector('.aside .list-selectable .list-item.active')) {
          document.querySelector('.aside .list-selectable .list-item.active').classList.remove('active')
        }
        change.newValue.classList.add('active')
        emrGlobalStates.context.contextTitle = change.newValue.querySelector('.primary-text').innerHTML
        emrGlobalStates.context.contextType = change.newValue.querySelector('.list-link').getAttribute('data-type')
        emrGlobalStates.context.contextURL = change.newValue.querySelector('.list-link').getAttribute('data-content') + '?name=' + convertToSlug(change.newValue.querySelector('.primary-text').innerHTML)
      } else {
        document.querySelector('.aside .list-selectable .list-item.active').classList.remove('active')
        emrGlobalStates.context.contextTitle = ''
      }

    // ======================================
    // HANDLE CONTENT VIEWLIST SELECTABLE
    // ======================================
    } else if (property === 'viewlistItemSelected') {
      if (change.newValue !== '') {
        const cnt = new Promise((res) => {
          res(emrGlobalStates.context.viewlistTarget = change.newValue.closest('.viewlist'))
        })
        cnt.then(() => {
          if (emrGlobalStates.context.viewlistTarget.__getTarget.querySelector('.list-item.active')) {
            emrGlobalStates.context.viewlistTarget.__getTarget.querySelector('.list-item.active').classList.remove('active')
          }
        })
        cnt.then(() => {
          emrGlobalStates.context.viewlistItemSelected.__getTarget.classList.add('active')
          emrGlobalStates.context.showViewlistContext = true
        })
      } else {
        emrGlobalStates.context.showViewlistContext = false
      }

    // ======================================
    // HANDLE CONTEXT TITLE
    // ======================================
    } else if (property === 'contextTitle') {
      document.querySelector('.navbar .navbar-center .title-place').innerHTML = change.newValue

    // ======================================
    // HANDLE VIEWPORT ON RESIZE
    // ======================================
    } else if (property === 'vh') {
      document.documentElement.style.setProperty('--vh', `${change.newValue}px`)
    } else if (property === 'vw') {
      document.documentElement.style.setProperty('--vw', `${change.newValue}px`)

    // ======================================
    // HANDLE ASIDE HAMMER TIME SWIPE TABS
    // ======================================
    } else if (property === 'asideCurrentTab') {
      $(document.querySelectorAll('.aside .aside-tabs .nav-item')[change.newValue]).tab('show')

    // ======================================
    // HANDLE ASIDE HAMMER TIME SWIPE TABS
    // ======================================
    } else if (property === 'contentCurrentTab') {
      $(document.querySelectorAll('.content-wrapper .nav-tabs .nav-item')[change.newValue]).tab('show')
      const tabcontainer = document.querySelector('.content-wrapper .tabs-container')
      if (tabcontainer.scrollLeft !== tabcontainer.clientWidth) {
        $(tabcontainer).stop().animate({
          scrollLeft: emrGlobalStates.ui.contentTabPositions[change.newValue]
        }, 300)
      }
    }
  })
})

emrGlobalStates.ui.pageLoading = true
const initScripts = () => {
  emrGlobalStates.ui.pageLoading = false

  // INITIAL UI SETUP
  initiateUI()

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
      modal.find('.modal-footer').hide()
    } else {
      $.ajax({
        url: content,
        beforeSend: function() {
          modal.find('.modal-body').html(emrGlobalStates.ui.preloaderStr)
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

// CONTENT HAMMER TIME FUNCTIONS
const hammerTimeContent = (cnt) => {
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  const asideWidth = document.querySelector('.aside').clientWidth
  const sidebarWidth = document.querySelector('.sidebar').clientWidth

  const doIterate = new Promise((res) => {
    let count = 0
    const tabs = cnt.querySelectorAll('.nav-tabs .nav-item')
    var timeout
    console.log('start tab iteration')
    const doFunc = () => {
      const tabPosX = tabs[count].getBoundingClientRect().left - 1
      if (vw > 1024) {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX - asideWidth - sidebarWidth)
      } else if (vw > 812 && vw <= 1024) {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX - asideWidth)
      } else {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX + vw)
      }
      timeout = setTimeout(() => {
        if (count != tabs.length - 1) {
          count++
          doFunc()
        } else {
          console.log('done tab iteration')
          clearTimeout(timeout)
          res(count)
        }
      }, 10)
    }
    doFunc()
  })

  doIterate
  .then((res) => {
    // emrGlobalStates.ui.contentTabs = cnt.querySelectorAll('.nav-tabs .nav-item')
    emrGlobalStates.ui.contentTotalTabs = cnt.querySelectorAll('.nav-tabs .nav-item').length
    return emrGlobalStates.ui.contentTotalTabs
  })
  .then((res) => {
    console.log('========', res)
    if (res > 0) {
      const hammCnt = cnt.querySelector('.content-body')
      const hamm = new Hammer(hammCnt)
      hamm.on('swipeleft swiperight', function(ev) {
        if (emrGlobalStates.ui.isMobile) {
          if (ev.type === 'swiperight') {
            if (emrGlobalStates.ui.contentCurrentTab > 0) {
              emrGlobalStates.ui.contentCurrentTab = emrGlobalStates.ui.contentCurrentTab - 1
            } else {
              emrGlobalStates.ui.contentCurrentTab = emrGlobalStates.ui.contentTotalTabs - 1
            }
          } else if (ev.type === 'swipeleft') {
            if (emrGlobalStates.ui.contentCurrentTab < emrGlobalStates.ui.contentTotalTabs - 1) {
              emrGlobalStates.ui.contentCurrentTab = emrGlobalStates.ui.contentCurrentTab + 1
            } else {
              emrGlobalStates.ui.contentCurrentTab = 0
            }
          }
        }
      })
    }
    return 'hammer time initiated'
  })
  .then((res) => {
    console.log(res)
    $('.content-wrapper .nav-tabs .nav-item').on('show.bs.tab', function(e, i) {
      exitContentViewlist();
      emrGlobalStates.ui.contentCurrentTab = $(this).index('.content-wrapper .nav-tabs a[data-toggle="tab"]')
    })
    return 'hammer time content done'
  })
  .then((res) => {
    console.log(res)
    initiateViewlistFunctions(cnt)
    initiateDatatables(cnt)
    initiateDateTimePicker(cnt)
    initiateQuill(cnt)
    initiateSketchpad(cnt)
    initiateAccordions(cnt)
  }).then(() => {
    emrGlobalStates.context.showContext = true
    emrGlobalStates.ui.pageLoading = false
    console.log('done!')
  })
}

const exitContentViewlist = () => {
  emrGlobalStates.context.showViewlistContext = false
  emrGlobalStates.context.viewlistItemSelected = ''
}
const exitAllViewlist = () => {
  emrGlobalStates.context.contextTitle = ''
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

const initiateDatatables = (ref = document) => {
  if (ref.querySelectorAll('.datatables').length > 0) {
    $(ref).find('.datatables').DataTable({
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
      })
    })
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
      })
    })
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
      })
    })
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

const initiateViewlistFunctions = (ref = document) => {
  if (ref.querySelectorAll('.viewlist').length > 0) {
    ref.querySelectorAll('.viewlist').forEach(list => {
      list.querySelectorAll('.list-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault()
          emrGlobalStates.context.viewlistItemSelected = e.target.closest('.list-item')
        })
      })
      list.querySelector('.close').addEventListener('click', (e) => {
        e.preventDefault()
        exitContentViewlist()
      })
      list.querySelector('.viewlist-content-overlay').addEventListener('click', (e) => {
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
}

// ACCORDIONS
const initiateAccordions = (ref = document) => {
  if (ref.querySelectorAll('.collapse').length > 0) {
    $(ref).find('.collapse').on('show.bs.collapse', function(event) {
      const accordion = $(this).closest('.accordion')
      accordion.addClass('show')
    })
    $(ref).find('.collapse').on('hide.bs.collapse', function(event) {
      const accordion = $(this).closest('.accordion')
      accordion.removeClass('show')
    })
  }
}

const windowResized = () => {
  emrGlobalStates.ui.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) * 0.01;
  emrGlobalStates.ui.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) * 0.01;
  emrGlobalStates.ui.isMobile = is_touch_device()
}

const initiateTooltips = (ref = document) => {
  if (ref.querySelectorAll('[data-toggle="tooltip"]').length > 0) {
    $(ref.querySelectorAll('[data-toggle="tooltip"]')).tooltip()
  }
}

const initiateAside = () => {
  // ASIDE HAMMER TIME!
  emrGlobalStates.ui.asideCurrentTab = 0
  // emrGlobalStates.ui.asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  emrGlobalStates.ui.asideTotalTabs = document.querySelectorAll('.aside .aside-tabs .nav-item').length
  const asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  if (asideTabs.length > 0) {
    const hammerContainer = document.querySelector('.aside')
    var hammertime = new Hammer(hammerContainer);

    hammertime.on('swipeleft swiperight', function(ev) {
      if (emrGlobalStates.ui.isMobile) {
        if (ev.type === 'swiperight') {
          if (emrGlobalStates.ui.asideCurrentTab > 0) {
            emrGlobalStates.ui.asideCurrentTab--
          } else {
            emrGlobalStates.ui.asideCurrentTab = emrGlobalStates.ui.asideTotalTabs - 1
          }
        } else if (ev.type === 'swipeleft') {
          if (emrGlobalStates.ui.asideCurrentTab < emrGlobalStates.ui.asideTotalTabs - 1) {
            emrGlobalStates.ui.asideCurrentTab++
          } else {
            emrGlobalStates.ui.asideCurrentTab = 0
          }
        }
      }
    })
  }
  // ASIDE TABS EVENT
  if ($('.aside .nav-tabs a').length) {
    $('.aside .nav-tabs a').on('show.bs.tab', function(e) {
      const tabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
      tabs.forEach((tab, i) => {
        if (tab === e.target) {
          emrGlobalStates.ui.asideCurrentTab = i
        }
      })
    })
  }
  // ASIDE LIST SELECTABLE CLICK EVENT
  if ($('.aside .list-selectable').length) {
    $('.aside .list-selectable').each(function(e) {
      $(this).find('.list-link').on('click', function(e) {
        e.preventDefault()
        if (!emrGlobalStates.ui.pageLoading) {
          emrGlobalStates.context.asideListItemSelected = e.target.closest('.list-item')
        }
      })
    })
  }
  // ASIDE SEARCH FIELD
  if ($('.aside .search .form-control').length) {
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
  }
}

const initiateContextControl = () => {
  if ($('.content-controls .control-hide').length) {
    $('.content-controls .control-hide').on('click', function(e) {
      e.preventDefault()
      // update global state
      emrGlobalStates.context.contextURL = ''
    })
  }
}
const debounce = (func, wait, immediate) => {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

function is_touch_device() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}

const initiateUI = () => {
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
    emrGlobalStates.ui.showMenu = true
  })
  $('.sidebar-overlay').on('click', function(e) {
    e.preventDefault()
    emrGlobalStates.ui.showMenu = false
  })

  // ASIDE
  initiateAside()

  // CONTEXT CONTROL BUTTONS
  initiateContextControl()

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
}

// Document Ready
jQuery(function() {
  initScripts()
})