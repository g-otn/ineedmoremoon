$(window).on('load', async () => {

  // *************************************************************************
  // Declare variables and constants

  const $sideImg = $('#side-img')
  const $sideDropdownButton = $('#side-dropdown-button')
  const $sideDropdown = $('#side-dropdown')
  const $searchBox = $('#search')
  const $resetButton = $('#reset')
  const $overlay = $('#overlay')

  const sides = []
  const sideImgPaths = ['assets/image/side1.png', 'assets/image/side2.png']

  let currentSideIndex = -1

  let img, fuse

  // *************************************************************************
  // Function definitions

  // https://github.com/anvaka/panzoom/issues/69#issuecomment-535444960
  const smoothResetPanAndZoom = () => {
    const xys = img.getTransform()
    // img is the reference to the panzoom object
    if (xys.scale > 1) { // calculate the point that should not move
      const fScale = 1 - xys.scale
      const fixeX = xys.x / fScale
      const fixeY = xys.y / fScale
      img.smoothZoomAbs(fixeX, fixeY, 1)
    } else { // just go back to (0, 0) and scale 1
      img.moveBy(-xys.x, -xys.y, true)
      img.smoothZoomAbs(xys.x, xys.y, 1)
    }
    img.moveTo(0, 0) // to be sure to go back to (0,0)
    img.zoomAbs(0, 0, 1) // to be sure to go back to scale 1
  }

  const resetPanAndZoom = () => {
    img.moveTo(0, 0)
    img.zoomAbs(0, 0, 1)
  }

  const zoomOnName = listIndex => {
    toggleActions(false)
    
    const item = sides[currentSideIndex].list[listIndex]
    const m = sides[currentSideIndex].metadata
    console.log(item, m)
    const y = item.lineIndex / m.lineCount
    console.log(y)
    console.log(img)
    // resetPanAndZoom()
    img.smoothZoom(0, 400, 5)
  }

  const toggleActions = enable => {
    // enable ? $sideImg.removeClass('d-none') : $sideImg.addClass('d-none')
    enable ? $overlay.addClass('d-none') : $overlay.removeClass('d-none')
    $sideDropdownButton.attr('disabled', !enable)
    $searchBox.attr('disabled', !enable)
    $resetButton.attr('disabled', !enable)
  }

  const setSide = sideIndex => {
    if (!Number.isFinite(sideIndex) || sideIndex === currentSideIndex || !sideImgPaths[sideIndex]) return

    // Block actions
    $sideImg.addClass('d-none')
    toggleActions(false)

    if (img) {
      resetPanAndZoom(img)
      img.dispose()
    }

    currentSideIndex = sideIndex
    $sideDropdownButton.text(`Side ${currentSideIndex + 1}`)
    $sideImg.attr('src', sideImgPaths[currentSideIndex])

    // Update Select2 options
    updateOptions(sides[currentSideIndex].list)
  }

  const updateOptions = list => {
    // Clear, recreate 
    $searchBox.empty()

    $searchBox.append('<option></option>') // Placeholder option
    list.forEach((v, i) => {
      const newOption = new Option(v.name, i, false, false)
      $searchBox.append(newOption)
    })
    $searchBox.trigger('change')
  }

  // *************************************************************************
  // Event handlers

  $sideDropdown.find('a').click(e => {
    const index = Number($(e.target).data('side-img-index'));
    setSide(index);
  })

  $resetButton.click(e => smoothResetPanAndZoom(img))

  $sideImg.on('load', e => {
    img = panzoom($sideImg[0], {
      maxZoom: 20,
      minZoom: 0.75,
      zoomSpeed: 10,
      // bounds: true, // breaks smoothResetPanAndZoom
    })

    //debug
    window.img = img
    img.on('transform', (e) => console.log(e.getTransform()))

    // Unblock actions
    $sideImg.removeClass('d-none')
    toggleActions(true)
  })

  $searchBox.on('select2:select', e => {
    const listIndex = $searchBox.val()
    zoomOnName(listIndex)
  })

  // *************************************************************************
  // Initialize

  $searchBox.select2({
    theme: 'bootstrap-5',
    placeholder: 'Type a name',
    minimumInputLength: 2,
    maximumInputLength: 10,
    disabled: true
  })

  // Fetch metadata and name lists
  await Promise.all([
    fetch('data/side1.json'),
    fetch('data/side2.json'),
  ])
  .then(values => Promise.all(values.map(v => v.json())))
  .then(values => {
    values.forEach((v, i) => {
      const list = values[i].list
      const metadata = values[i].metadata
      // const options = {
      //   minMatchCharLength: 3,
      //   includeScore: true,
      //   keys: ['name']
      // }
      // const fuseIndex = Fuse.parseIndex(values[i].fuseIndex)

      sides[i] = { metadata, list, }
      // fuse: new Fuse(list, options, fuseIndex)
    })
  })

  setSide(0)

  // *************************************************************************

});