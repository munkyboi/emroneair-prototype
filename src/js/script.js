
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
    dialogLoading: false,
    dialogTitle: '',
    dialogContent: '',
    dialogName: '',
    dialogContentURL: '',
    dialogTemplate: `
    <div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="customDialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-skin">
          <div class="modal-preloader"><div><div></div></div></div>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class='mdi mdi-close'></i></button>
          <div class="modal-content">
            <form class="modal-form">
              <div class="modal-header"><h5 class="modal-title">Dialog Title</h5></div>
              <div class="modal-body"></div>
              <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">
                  <i class="mdi mdi-close"></i>
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    `,
  },
  toasts: {},
  ui: {
    preloaderStr: `<div class="ajaxloader"><div><div></div></div></div>`,
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
    datepickers: [],
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
  consoleLog(__EMR_GLOBAL_STATES__, changes);
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

    } else if (property === 'dialogLoading') {
      if (change.newValue === true) {
        document.querySelector('body').classList.add('dialog-loading')
      } else {
        document.querySelector('body').classList.remove('dialog-loading')
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
    // HANDLE MAIN CONTEXT AJAX
    // ======================================
    } else if (property === 'contextURL') {
      if (change.newValue !== '') {
        if (emrGlobalStates.context.contextType === 'pageload') {
          var contentWrapper = document.querySelector('.content .content-wrapper')
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
                  document.querySelector('.content-wrapper').innerHTML = ''
                  contentWrapper.innerHTML = emrGlobalStates.ui.preloaderStr
                  emrGlobalStates.ui.contentCurrentTab = 0
                  emrGlobalStates.ui.contentTabPositions = []
                  emrGlobalStates.ui.contentTabWidth = []
                }
              })
              return result
            }
            
            catch (err) {
              consoleLog(err)
            }
          }
          doAjax()
            .then((data) => {
              contentWrapper.innerHTML = data
              // emrGlobalStates.ui.contentCurrentTab = 0
              // emrGlobalStates.ui.contentTabPositions = []
              // emrGlobalStates.ui.contentTabWidth = []
              return 'html insert done'
            })
            .then((res) => {
              consoleLog(res)
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
    // SHOW VIEWLIST CONTEXT EVENT
    // ======================================
    } else if (property === 'showViewlistContext') {
      consoleLog('global showViewlistContext', change)
      if (change.newValue === true) {
        consoleLog('SEEEEEEEEEEEEEEEEEEEEE')
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
    // HANDLE CONTENT VIEWLIST SELECTABLE
    // ======================================
    } else if (property === 'viewlistItemSelected') {
      consoleLog('global viewlistItemSelected', change.newValue)
      if (change.newValue !== '') {
        const cnt = new Promise((res) => {
          res(emrGlobalStates.context.viewlistTarget = change.newValue.closest('.viewlist'))
        })
        cnt.then((e) => {
          if (e.querySelector('.list-item.active')) {
            e.querySelector('.list-item.active').classList.remove('active')
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
      if (tabcontainer) {
        const ylimit = Math.round(document.querySelector('.content-wrapper .tabs-container .nav-tabs').offsetWidth - tabcontainer.offsetWidth)
        const scrollY = Math.round(emrGlobalStates.ui.contentTabPositions.__getTarget[change.newValue] > ylimit ? ylimit : emrGlobalStates.ui.contentTabPositions.__getTarget[change.newValue])
        consoleLog('tab position', scrollY, ylimit,  Math.round(emrGlobalStates.ui.contentTabPositions.__getTarget[change.newValue]))
        if (tabcontainer.scrollLeft <= ylimit) {
          $(tabcontainer).animate({
            scrollLeft: scrollY
          }, 150)
        }
      }
    }
  })
})

emrGlobalStates.ui.pageLoading = true
const initScripts = () => {
  emrGlobalStates.ui.pageLoading = false

  // INITIAL UI SETUP
  initiateUI()

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

  new Promise((res) => {
    let count = 0
    const tabs = cnt.querySelectorAll('.nav-tabs .nav-item')
    var timeout
    consoleLog('start tab iteration')
    const doFunc = () => {
      const tabPosX = tabs[count].getBoundingClientRect().left
      if (vw > 1024) {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX - asideWidth - sidebarWidth)
      } else if (vw > 812 && vw <= 1024) {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX - asideWidth)
      } else {
        emrGlobalStates.ui.contentTabPositions.push(tabPosX + vw)
      }
      emrGlobalStates.ui.contentTabWidth.push(tabs[count].clientWidth)
      timeout = setTimeout(() => {
        if (count != tabs.length - 1) {
          count++
          doFunc()
        } else {
          consoleLog('done tab iteration')
          clearTimeout(timeout)
          res(count)
        }
      }, 10)
    }
    if (tabs.length > 0) {
      doFunc()
    } else {
      res()
    }
  })
  .then((res) => {
    // emrGlobalStates.ui.contentTabs = cnt.querySelectorAll('.nav-tabs .nav-item')
    emrGlobalStates.ui.contentTotalTabs = cnt.querySelectorAll('.nav-tabs .nav-item').length
    return emrGlobalStates.ui.contentTotalTabs
  })
  .then((res) => {
    consoleLog('tabs detected', res)
    if (res > 0) {
      const hammCnt = cnt.querySelector('.content-body')
      const hamm = new Hammer(hammCnt, {
        touchAction: 'pan-y',
        inputClass: Hammer.TouchMouseInput
      })
      // hamm.set({ direction: Hammer.DIRECTION_HORIZONTAL });
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
    } else {
      initiateDatatables(cnt)
    }
    return 'hammer time initiated'
  })
  .then((res) => {
    consoleLog(res)
    $('.content-wrapper .nav-tabs .nav-item').on('show.bs.tab', function(e, i) {
      // $('.content-wrapper > .tabs > .tabs-container > .nav-tabs > .nav-item.active').removeClass('active')
      // $(e.currentTarget).addClass('active')
      // $('.content-wrapper .tab-content .tab-pane.show.active').removeClass('show active')
      // const tabcnt = document.querySelector(e.target.getAttribute('href'))
      // $(tabcnt).addClass('show active')
    })
    $('.content-wrapper .nav-tabs .nav-item').on('shown.bs.tab', function(e, i) {
      exitContentViewlist();
      emrGlobalStates.ui.contentCurrentTab = $(e.currentTarget).index('.content-wrapper > .tabs > .tabs-container > .nav-tabs > .nav-item')
      const tabcnt = document.querySelector(e.target.getAttribute('href'))
      initiateDatatables(tabcnt)
    })
    return 'hammer time content done'
  })
  .then((res) => {
    consoleLog(res)
    initiateMainScrolLDetector()
    initiateViewlistFunctions(cnt)
    initiateSelect2(cnt)
    initiateDateTimePicker(cnt)
    initiateQuill(cnt)
    initiateSketchpad(cnt)
    initiateAccordions(cnt)
    initiatePDFJS()
    initiateButtonLinks(cnt)
    initiateTooltips(cnt)
    initiateToolbarPortable(cnt)
    initiateCustomDialog(cnt)
    initiateMultiFields(cnt)
    // first tab with datatable
    if (document.querySelectorAll('.content-wrapper .tabs-container .nav-item').length > 0) {
      const firstTabDatatable = document.querySelector(document.querySelectorAll('.content-wrapper .tabs-container .nav-item')[0].getAttribute('href'))
      initiateDatatables(firstTabDatatable)
    }
    return 'pageload scripts initiated'
  }).then((res) => {
    consoleLog(res)
    emrGlobalStates.context.showContext = true
    emrGlobalStates.ui.pageLoading = false
    consoleLog('done!')
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

const initiateDatatables = (ref = document.querySelector('.main')) => {
  consoleLog('datatable initiated....', ref)
  if (ref.querySelectorAll('.datatable').length > 0) {
    $(ref).find('.datatable').each(function(i,e) {
      const datatable = $(e)
      const datatablePagination = datatable.find('.datatable-pagination')
      const datatablePagingInfo = datatablePagination.find('.datatable-paging-info')
      const datatablePagingNext = datatablePagination.find('.datatable-paging-next')
      const datatablePagingPrev = datatablePagination.find('.datatable-paging-prev')
      const datatableCont = datatable.find('.datatables')
      const isSelectable = datatableCont.hasClass('selectable')
      const isMultiSelectable = datatableCont.hasClass('selectable-multi')
      let datatableIfno
      
      if (!$.fn.DataTable.isDataTable(datatableCont)) {
        const dt = datatableCont.DataTable({
          // "scrollX": true,
          "order": [[ 0, "asc" ]],
          "dom": 'rt'
        })

        const updatePagingInfo = () => {
          dtInfo = dt.page.info()
          datatablePagingInfo.html(`${dtInfo.page + 1} of ${dtInfo.pages}`)
          if (dtInfo.page === 0) {
            datatablePagingPrev.attr('disabled', true)
          } else {
            datatablePagingPrev.attr('disabled', false)
          }
          
          if (dtInfo.page < dtInfo.pages - 1) {
            datatablePagingNext.attr('disabled', false)
          } else {
            datatablePagingNext.attr('disabled', true)
          }
        }

        datatablePagingPrev.on('click', function(ev) {
          dt.page('previous').draw('page')
        })

        datatablePagingNext.on('click', function(ev) {
          dt.page('next').draw('page')
        })

        updatePagingInfo()

        datatableCont.on('draw.dt', function (e) {
          setTimeout(() => {
            window.onresize()
          }, 300)
          updatePagingInfo()
        //   initiateTooltips(e.currentTarget)
        //   initiateModalToggles(e.currentTarget)
        });
        
        datatable.find('.datatable-toolbar .search .form-control').on('keyup click', function (e) {
          datatableSearch(datatableCont, $(this))
          if (e.currentTarget.value.length > 0) {
            $(this).parent().addClass('not-empty')
          } else {
            $(this).parent().removeClass('not-empty')
          }
        })
        datatable.find('.datatable-toolbar .search .clear').on('click', function(e) {
          e.preventDefault()
          $(this).parent().removeClass('not-empty')
          const field = $(this).parent().find('.form-control').val('')
          datatableSearch(datatableCont, field)
        })
        datatable.find('.datatable-toolbar .dropdown-menu .dropdown-item').on('click', function (e) {
          datatableLengthChange(datatableCont, $(this))
        })

        if (isMultiSelectable) {
          datatableCont.on('click', 'tr', function () {
            $(this).toggleClass('selected')
          })
        }

        if (isSelectable) {
          datatableCont.on('click', 'tr', function () {
            $(this).closest('table').find('tr.selected').removeClass('selected')
            $(this).toggleClass('selected')
          })
        }
      }
    })
  }
}

const initiateSelect2 = (ref = document) => {
  consoleLog('initiating select2...', ref)
  if (ref.querySelectorAll('.select2').length > 0) {
    ref.querySelectorAll('.select2').forEach(item => {
      const isEditable = item.classList.contains('editable') ? true : false
      const placeholder = item.getAttribute('placeholder') ? item.getAttribute('placeholder') : 'please select'
      consoleLog('placeholder', placeholder)
      $(item).select2({
        tags: isEditable,
        placeholder: placeholder,
        allowClear: false
      })
    })
  }
}

const datatableSearch = (datatable, field) => {
  datatable.DataTable().search(
      field.val(),
      false, // regex
      true // smart search
  ).draw()
}

const datatableLengthChange = (datatable, field) => {
  datatable.DataTable().page.len(field.data('value')).draw()
}

// https://github.pytes.net/tail.DateTime/
const initiateDateTimePicker = (ref = document) => {
  const dpickers = ref.querySelectorAll('[data-toggle="datepicker"]')
  const dtpickers = ref.querySelectorAll('[data-toggle="datetimepicker"]')
  const tpickers = ref.querySelectorAll('[data-toggle="timepicker"]')
  consoleLog('initiating DateTime Picker...', ref, dpickers)
  if (dpickers.length > 0) {
    dpickers.forEach(picker => {
      // check if it belongs to a hidden parent
      // if ($(picker).closest('.modal.show').length) {
        if (picker.classList.contains('current')) {
          picker.value = moment().format('MM/DD/YYYY')
        }
        const newPicker = tail.DateTime(picker, {
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

        emrGlobalStates.ui.datepickers.push(newPicker)
      // } else {
      //   consoleLog('failed to initiate date picker...')
      // }
    })
  }
  if (dtpickers.length > 0) {
    dtpickers.forEach(picker => {
      // check if it belongs to a hidden parent
      // if ($(picker).closest('.modal.show').length) {
        if (picker.classList.contains('current')) {
          picker.value = moment().format('MM/DD/YYYY h:mm:ss A')
        }
        const newPicker = tail.DateTime(picker, {
          closeButton: false,
          time12h: true,
          dateFormat: 'mm/dd/YYYY',
          timeFormat: 'G:ii:ss A',
        })

        emrGlobalStates.ui.datepickers.push(newPicker)
      // } else {
      //   consoleLog('failed to initiate date picker...')
      // }
    })
  }
  if (tpickers.length > 0) {
    tpickers.forEach(picker => {
      // check if it belongs to a hidden parent
      // if ($(picker).closest('.modal.show').length) {
        if (picker.classList.contains('current')) {
          picker.value = moment().format('h:mm:ss A')
        }
        const newPicker = tail.DateTime(picker, {
          dateFormat: false,
          closeButton: true,
          timeFormat: 'G:ii:ss A',
          time12h: true,
          timeSeconds: null,
        })

        emrGlobalStates.ui.datepickers.push(newPicker)
      // } else {
      //   consoleLog('failed to initiate date picker...')
      // }
    })
  }
}

const removeDatePickers = (ref = document) => {
  consoleLog('removing datepicker...', ref)
  const removeFunc = (item) => {
    emrGlobalStates.ui.datepickers.forEach((globalitem, i) => {
      if (globalitem.e.__getTarget === item) {
        globalitem.__getTarget.remove()
        emrGlobalStates.ui.datepickers.splice(i, 1)
      }
    })
    return true
  }

  new Promise((res) => {
    if (ref.querySelectorAll('[data-toggle="datepicker"]').length > 0) {
      $(ref).find('[data-toggle="datepicker"]').each(function(i, item) {
        res(removeFunc(item))
      })
    }
  }).then(() => {
    if (ref.querySelectorAll('[data-toggle="datetimepicker"]').length > 0) {
      $(ref).find('[data-toggle="datetimepicker"]').each(function(i, item) {
        removeFunc(item)
      })
    }
  }).then(() => {
    if (ref.querySelectorAll('[data-toggle="timepicker"]').length > 0) {
      $(ref).find('[data-toggle="timepicker"]').each(function(i, item) {
        removeFunc(item)
      })
    }
  })
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
  consoleLog('initiating sketchpad...', ref)
  if (ref.querySelectorAll('.sketchpad').length > 0) {
    const sketchpads = ref.querySelectorAll('.sketchpad')
    sketchpads.forEach(sketchpad => {
      consoleLog('sketchpad ===> ', sketchpad)
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
  consoleLog('initiating viewlist function...', ref)
  if (ref.querySelectorAll('.viewlist').length > 0) {
    ref.querySelectorAll('.viewlist').forEach(list => {
      list.querySelectorAll('.list-link').forEach(link => {
        link.addEventListener('click', (e) => {
          // e.preventDefault()
          emrGlobalStates.context.viewlistItemSelected = ''
          setTimeout(() => {
            emrGlobalStates.context.viewlistItemSelected = e.target.closest('.list-item')
          }, 100)
        })
      })
      list.querySelector('.close').addEventListener('click', (e) => {
        // e.preventDefault()
        exitContentViewlist()
      })
      list.querySelector('.viewlist-content-overlay').addEventListener('click', (e) => {
        // e.preventDefault()
        exitContentViewlist()
      })
    })
  }
}

const initiateButtonLinks = (ref = document) => {
  consoleLog('Initiate Button Links...', ref)
  if (ref.querySelectorAll('[data-toggle=pageload]').length > 0) {
    ref.querySelectorAll('[data-toggle=pageload]').forEach(button => {
      button.addEventListener('click', (e) => {
        // e.preventDefault()
        emrGlobalStates.context.contextType = e.currentTarget.getAttribute('data-type')
        emrGlobalStates.context.contextURL = e.currentTarget.getAttribute('data-content')
        consoleLog('aaaaaaaaaaaa', e.currentTarget)
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
  consoleLog('tooltip initiated', ref.querySelectorAll('[data-toggle="tooltip"]').length)
  if (ref.querySelectorAll('[data-toggle="tooltip"]').length > 0) {
    ref.querySelectorAll('[data-toggle="tooltip"]').forEach((item) => {
      $(item).tooltip()
    })
  }
}

// const initiateModalToggles = (ref = document) => {
//   consoleLog('modal togglers initiated', ref.querySelectorAll('[data-toggle="modal"]').length)
//   if (ref.querySelectorAll('[data-toggle="modal"]').length > 0) {
//     ref.querySelectorAll('[data-toggle="modal"]').forEach((item) => {
//       $(item).on('click', function(e) {
//         const modal = $(this).data('target')
//         consoleLog(modal)
        
//         // modal.modal('show')
//       })
//     })
//   }
// }

const initiateMultiFields = (ref = document) => {
  if (ref.querySelectorAll('.multifield').length > 0) {
    $(ref.querySelectorAll('.multifield')).multifield()
  }
}

const initiateAside = () => {
  // ASIDE HAMMER TIME!
  emrGlobalStates.ui.asideCurrentTab = 0
  // emrGlobalStates.ui.asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  emrGlobalStates.ui.asideTotalTabs = document.querySelectorAll('.aside .aside-tabs .nav-item').length
  const asideTabs = document.querySelectorAll('.aside .aside-tabs .nav-item')
  if (asideTabs.length > 0) {
    document.querySelectorAll('.aside .aside-content .list-container').forEach((asideContainer) => {
      // const hammerContainer = document.querySelector('.aside .aside-content .list-container')
      var hammertime = new Hammer(asideContainer, {
        touchAction: 'pan-y',
        inputClass: Hammer.TouchMouseInput
      });
  
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
        // e.preventDefault()
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

const is_touch_device = () => {
  consoleLog('check if touch device...')
  return ( 'ontouchstart' in window ) ||  
         ( navigator.maxTouchPoints > 0 ) ||  
         ( navigator.msMaxTouchPoints > 0 ); 
}

const initiatePDFJS = (url = '/docs/sample-pdf.pdf') => {
  if (!!document.querySelector('.pdf-viewer')) {
    // If absolute URL from the remote server is provided, configure the CORS
    // header on that server.

    // Loaded via <script> tag, create shortcut to access PDF.js exports.
    var pdfjsLib = window['pdfjs-dist/build/pdf'];

    // The workerSrc property shall be specified.
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/js/modules/pdfjs-worker.js';

    var pdfDoc = null,
        pageNum = 1,
        pageRendering = true,
        pageNumPending = null,
        scale = 1,
        canvas = document.getElementById('pdf-viewer-canvas'),
        ctx = canvas.getContext('2d');

    /**
     * Get page info from document, resize canvas accordingly, and render page.
     * @param num Page number.
     */
    function renderPage(num) {
      pageRendering = true;
      // document.querySelector('.pdf-viewer').classList.add('loading')
      // Using promise to fetch the page
      pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        var renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(function() {
          pageRendering = false;
          document.querySelector('.pdf-viewer').classList.remove('loading')
          if (pageNumPending !== null) {
            // New page rendering is pending
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });
      });

      // Update page counters
      document.querySelector('.pdf-viewer .pdf-viewer-pagenum').textContent = num;
    }

    /**
     * If another page rendering in progress, waits until the rendering is
     * finised. Otherwise, executes rendering immediately.
     */
    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    /**
     * Displays previous page.
     */
    function onPrevPage() {
      if (!pageRendering) {
        if (pageNum <= 1) {
          return;
        }
        pageNum--;
        queueRenderPage(pageNum);
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-prev').addEventListener('click', onPrevPage);

    /**
     * Displays next page.
     */
    function onNextPage() {
      if (!pageRendering) {
        if (pageNum >= pdfDoc.numPages) {
          return;
        }
        pageNum++;
        queueRenderPage(pageNum);
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-next').addEventListener('click', onNextPage);

    /**
     * Zoom In
     */
    function zoomIn() {
      if (!pageRendering) {
        // consoleLog('zooommmm in', scale)
        if (scale >= 2) {
          return;
        }
        scale = scale + .2;
        queueRenderPage(pageNum);
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-zoomin').addEventListener('click', zoomIn);

    /**
     * Zoom Out
     */
    function zoomOut() {
      if (!pageRendering) {
        // consoleLog('zooommmm out', scale)
        if (scale <= 0.6) {
          return;
        }
        scale = scale - .2;
        queueRenderPage(pageNum);
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-zoomout').addEventListener('click', zoomOut);

    /**
     * Zoom Reset
     */
    function zoomReset() {
      if (!pageRendering) {
        // consoleLog('zooommmm out', scale)
        scale = 1;
        queueRenderPage(pageNum);
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-zoomreset').addEventListener('click', zoomReset);


    // PRINT
    function printPDF(ev) {
      if (!pageRendering) {
        const file = ev.currentTarget.dataset.file
        printJS(file)
      }
    }
    document.querySelector('.pdf-viewer-toolbar .pdf-viewer-print').addEventListener('click', (e) => printPDF(e))

    /**
     * Asynchronously downloads PDF.
     */
    document.querySelector('.pdf-viewer').classList.add('loading')
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
      pdfDoc = pdfDoc_;
      document.querySelector('.pdf-viewer').classList.remove('loading')
      document.querySelector('.pdf-viewer .pdf-viewer-pagecount').textContent = pdfDoc.numPages;

      // Initial/first page rendering
      renderPage(pageNum);
    });

    if (document.querySelectorAll('[data-toggle="pdfviewer"]').length > 0) {
      document.querySelectorAll('[data-toggle="pdfviewer"]').forEach((button) => {
        button.addEventListener('click', (ev) => {
          const pdffile = ev.currentTarget.dataset.content
          pdfjsLib.getDocument(pdffile).promise.then(function(pdfDoc_) {
            pdfDoc = pdfDoc_;
            document.querySelector('.pdf-viewer').classList.remove('loading')
            document.querySelector('.pdf-viewer .pdf-viewer-pagecount').textContent = pdfDoc.numPages;
      
            // Initial/first page rendering
            renderPage(pageNum);
          });
          document.querySelector('.pdf-viewer-toolbar .pdf-viewer-download').href = pdffile
          document.querySelector('.pdf-viewer-toolbar .pdf-viewer-download').setAttribute('download','update-report.pdf')
          document.querySelector('.pdf-viewer-toolbar .pdf-viewer-print').dataset.file = pdffile
        })
      })
    }
  }
}

const initiateToolbarPortable = (ref = document) => {
  consoleLog('Initiating Toolbar Portable...', ref)
  if (ref.querySelectorAll('.toolbar-portable').length > 0) {
    $(ref.querySelectorAll('.toolbar-portable')).each(function(i,e) {
      $(e).on('click', function(event){
        var events = $._data(document, 'events') || {};
        events = events.click || [];
        for(var i = 0; i < events.length; i++) {
            if(events[i].selector) {
                if($(event.target).is(events[i].selector)) {
                    events[i].handler.call(event.target, event);
                }
                $(event.target).parents(events[i].selector).each(function(){
                    events[i].handler.call(this, event);
                });
            }
        }
        event.stopPropagation(); 
      });
    })
  }
}

const initiateWizardForm = (ref = document) => {
  consoleLog('initiating wizard form', ref)
  if (ref.querySelectorAll('.wizardForm').length > 0) {
    $(ref.querySelectorAll('.wizardForm')).each(function(i,e) {
      const mainTitleCtx = $(e).find('.wizardForm-maintitle')
      const titleArray = $(e).find('.wizardForm-title')
      let nextBtn, prevBtn
      mainTitleCtx.html(titleArray[0].innerHTML)
      console.log(titleArray)
      const wizardo = $(e).find('.wizard').steps({
        headerTag: "h4",
        bodyTag: "section",
        enableAllSteps: true,
        transitionEffectSpeed: 0,
        titleTemplate: `<span class="number">#index#</span><span class="title">#title#</span>`,
        onStepChanging: function(event, currentIndex, newIndex) {
          mainTitleCtx.html(titleArray[newIndex].innerHTML)
          // initiateSelect2(this)
          // initiateDateTimePicker(this)
          return true
        //   if (newIndex === 1) {
        //     $('.steps ul').addClass('step-2');
        //   } else {
        //     $('.steps ul').removeClass('step-2');
        //   }
        //   if (newIndex === 2) {
        //     $('.steps ul').addClass('step-3');
        //   } else {
        //     $('.steps ul').removeClass('step-3');
        //   }
  
        //   if (newIndex === 3) {
        //     $('.steps ul').addClass('step-4');
        //     $('.actions ul').addClass('step-last');
        //   } else {
        //     $('.steps ul').removeClass('step-4');
        //     $('.actions ul').removeClass('step-last');
        //   }
        //   return true;
        },
        onInit: function(ev) {
          // initiateSelect2(this)
          // initiateDateTimePicker(this)
        },
        labels: {
          finish: "",
          next: "<i class='mdi mdi-chevron-right'></i>",
          previous: "<i class='mdi mdi-chevron-left'></i>"
        }
      })
    })
    // Custom Steps Jquery Steps
    // $('.wizard > .steps li a').click(function() {
    //   $(this).parent().addClass('checked');
    //   $(this).parent().prevAll().addClass('checked');
    //   $(this).parent().nextAll().removeClass('checked');
    // });
    // // Custom Button Jquery Steps
    // $('.forward').click(function() {
    //   $("#wizard").steps('next');
    // })
    // $('.backward').click(function() {
    //   $("#wizard").steps('previous');
    // })
    // // Checkbox
    // $('.checkbox-circle label').click(function() {
    //   $('.checkbox-circle label').removeClass('active');
    //   $(this).addClass('active');
    // })
  }
}

const initiateMainScrolLDetector = () => {
  // MAIN CONTENT SCROLL DETECTION
  $('body > app > .main > .content .scroll-detector').on('scroll', function(e) {
    if (e.currentTarget.scrollTop > 60) {
      $('body').addClass('page-scrolled')
    } else {
      $('body').removeClass('page-scrolled')
    }
  })
}

const initiateCustomDialog = (ref = document) => {
  consoleLog('initiating custom dialog...', ref)
  if (ref.querySelectorAll('[data-toggle="dialog"]').length > 0) {
    $(ref.querySelectorAll('[data-toggle="dialog"]')).each(function(i,e) {
      $(this).on('click', function(ev) {
        emrGlobalStates.dialog.dialogLoading = true
        const dialogTitle = $(this).data('title')
        const dialogContent = $(this).data('content')
        const dialogType = $(this).data('type')
        const dialogSize = $(this).data('size')
        const dialogAction = $(this).data('action') ? $(this).data('action') : '/'

        const dialog = $(emrGlobalStates.dialog.dialogTemplate)
        const _this = dialog[0]
        const dialogForm = $(dialog).find('.modal-form')
        dialog.attr('id', newGuid())
        dialog.find('.modal-title').html(dialogTitle)
        if (dialogSize) {
          dialog.find('.modal-dialog').addClass(dialogSize)
        }
        if (dialogAction) {
          dialog.find('.modal-form').attr('action', dialogAction)
        }
        $('body').append(dialog)

        
        if (dialogType === 'image') {
          dialog.addClass('imageViewer')
          const img = new Image()
          img.src = dialogContent
          img.onload = function() {
            dialog.find('.modal-body').html(img)
            dialog.find('.modal-footer').hide()
            emrGlobalStates.dialog.dialogLoading = false
            dialog.modal('show')
          }
        } else if (dialogType === 'confirm') {
          emrGlobalStates.dialog.dialogLoading = false
          dialog.addClass('confirm')
          dialog.find('.modal-body').html(dialogContent)
          dialog.modal('show')
          dialog.find('.modal-footer').append($(`
            <button type='submit' class="btn btn-danger" data-toggle='dialog-submit'>
              <i class="mdi mdi-information-outline"></i>
              <span>Confirm</span>
            </button>
          `))
        } else if (dialogType === 'ajax' || 'ajax-form' || 'ajax-doc' || 'ajax-selection') {
          $.ajax({
            url: dialogContent,
            beforeSend: function() {
              dialog.find('.modal-body').html(emrGlobalStates.ui.preloaderStr)
            },
            success: function(result) {
              dialog.find('.modal-body').html(result)
              if (dialogType === 'ajax-form') {
                dialog.find('.modal-footer').append($(`
                <button type='button' class="btn btn-success" data-toggle='dialog-submit'>
                  <i class="mdi mdi-plus"></i>
                  <span>Save</span>
                </button>
              `))
              } else if (dialogType === 'ajax-doc') {
                dialog.find('.modal-footer').append($(`
                  <button type='button' class="btn btn-success" data-toggle='printer'>
                    <i class="mdi mdi-printer"></i>
                    <span>Print</span>
                  </button>
                `))
              } else if (dialogType === 'ajax-selection') {
                dialog.find('.modal-footer').append($(`
                  <button type='button' class="btn btn-info" data-toggle='selection'>
                    <i class="mdi mdi-arrow-right"></i>
                    <span>Continue</span>
                  </button>
                `))
              }
              dialog.modal('show')
              emrGlobalStates.dialog.dialogLoading = false
            },
            complete: function() {
              initiateDatatables(_this)
              initiateQuill(_this)
              initiateWizardForm(_this)
              initiateSelect2(_this)
              initiateDateTimePicker(_this)
              initiateCustomDialog(_this)
              initiateMultiFields(_this)
            }
          })
        }

        dialog.on('shown.bs.modal', function(ev) {
          initiateSketchpad(this)
          $(this).find('.modal-footer [data-toggle="dialog-submit"]').on('click', function(ev) {
            ev.preventDefault()
            dialogForm.trigger('submit')
          })
  
          // DIALOG FORM SUBMISSION
          dialogForm.on('submit', function(ev) {
            ev.preventDefault()
            if (dialogType !== 'confirm') {
              const data = dialogForm.serializeArray()
              consoleLog('SUBMITING FORM...', data)
              dialog.addClass('processing')
              
              // VALIDATION GOES HERE...
              const asyncValidate = (data) => new Promise((res, rej) => {
                let errors = []
                data.forEach(field => {
                  // do validation...
                  if (field.value === '') {
                    errors.push({field: field.name, message: 'Should not be empty.'})
                    throw errors
                  }
                })
                res()
              })

              asyncValidate (data)
              .then(() => {
                $.ajax({
                  url: dialogAction,
                  // method: 'post',
                  data: data,
                  success: (result) => {
                    // const temp = document.createElement('div')
                    // temp.innerHTML = result
                    // const trimmedResult = temp.querySelector('app').innerHTML
                    dialog.modal('hide')
                    // $('body > app').html(trimmedResult)
                  },
                  complete: () => {
                    // initiateUI()
                  }
                })
              })
              .catch(err => {
                dialog.removeClass('processing')
                console.error(err)
              })
            } else {
              window.location = dialogAction
            }
          })
        })

        dialog.on('hide.bs.modal', function(ev) {
          removeDatePickers(_this)
        })
        dialog.on('hidden.bs.modal', function(ev) {
          $(this).remove()
        })
      })
    })
  }
}

function outerHTML(node){
  // if IE, Chrome take the internal method otherwise build one
  return node.outerHTML || (
  function(n){
      var div = document.createElement('div'), h;
      div.appendChild( n.cloneNode(true) );
      h = div.innerHTML;
      div = null;
      return h;
  })(node);
}

const consoleLog = (...logs) => {
  if (emrGlobalStates.ui.debugMode) {
    logs.forEach(log => {
      console.log(log)
    })
  }
}

const initiateUI = () => {
  // MAIN SCROLL DETECTOR
  initiateMainScrolLDetector()

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

  // SELECT2
  initiateSelect2()

  // QUILL
  initiateQuill()

  // SKETCHPAD
  initiateSketchpad()

  // custom dialog
  initiateCustomDialog()

  // PDFJS
}

const newGuid = () => {
  return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }).toUpperCase();
}

// Document Ready
jQuery(function() {
  initScripts()
})