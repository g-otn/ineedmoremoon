const $sideImg1 = $('#img-side1');
const $sideImg2 = $('#img-side2');

const $sideToggleButton = $('#side-toggle');
const $search = $('#search');
const $resetButton = $('#reset');

// *************************************************************************

let sides = [];
let currentSideIndex = -1;
let currentImgPanzoom = null;
let $currentImgSide = $sideImg1;

// *************************************************************************

// https://github.com/anvaka/panzoom/issues/69#issuecomment-535444960
const smoothResetPanAndZoom = () => {
  const xys = currentImgPanzoom.getTransform();
  // img is the reference to the panzoom object
  if (xys.scale > 1) {
    // calculate the point that should not move
    const fScale = 1 - xys.scale;
    const fixeX = xys.x / fScale;
    const fixeY = xys.y / fScale;
    console.info(fixeX, fixeY);
    currentImgPanzoom.smoothZoomAbs(fixeX, fixeY, 1);
  } else {
    // just go back to (0, 0) and scale 1
    currentImgPanzoom.moveBy(-xys.x, -xys.y, true);
    currentImgPanzoom.smoothZoomAbs(xys.x, xys.y, 1);
  }
  // currentImage.moveTo(0, 0); // to be sure to go back to (0,0)
  // currentImage.zoomAbs(0, 0, 1); // to be sure to go back to scale 1
};

const resetPanAndZoom = () => {
  currentImgPanzoom.moveTo(0, 0);
  currentImgPanzoom.zoomAbs(0, 0, 1);
};

const zoomOnName = (sideIndex, listIndex) => {
  sideIndex = Number(sideIndex);
  listIndex = Number(listIndex);

  console.log('zoom side', currentSideIndex, sideIndex);
  if (currentSideIndex !== sideIndex) {
    setSide(sideIndex);
  }

  resetPanAndZoom();

  setTimeout(() => {
    const { list, metadata } = sides[currentSideIndex];

    const item = list[listIndex];

    const { height, width, top, left } = $currentImgSide[0].getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Calculate move X
    const lineLength = metadata.lineLengths[item.lineIndex];
    const lineWidthRatio = lineLength / 277;
    const lineWidth = lineWidthRatio * width;
    const nameCenterCharOffset = item.lineCharOffset + item.name.length / 2;
    const xRatioFromLeft = nameCenterCharOffset / lineLength;
    const dXFromCenter = lineWidth * xRatioFromLeft - lineWidth / 2;

    // Calculate move Y
    const yRatioFromTop = item.lineIndex / metadata.lineCount;
    const dYFromCenter = height * yRatioFromTop - height / 2;

    // Padding on the image, reducing diamater of circle from image width
    // to match the 'circle of letters' better.
    const padding = 0.95;

    const xys = currentImgPanzoom.getTransform();

    currentImgPanzoom.setTransformOrigin({ x: 0.5, y: 0.5 });
    currentImgPanzoom.moveBy(
      -xys.x - dXFromCenter * padding,
      -xys.y - dYFromCenter * padding,
      true,
    );
    setTimeout(() => {
      currentImgPanzoom.smoothZoomAbs(centerX, centerY, 12);
      currentImgPanzoom.setTransformOrigin(null);
    }, 500);

    // Panzoom transforms are 'async' so we need to wait just a bit to get updated values.
  }, 100);
};

const setUIEnabled = (enable) => {
  $sideToggleButton.attr('disabled', !enable);
  $search.attr('disabled', !enable);
  $resetButton.attr('disabled', !enable);
};

// debug point
window.point = () => {
  // Get the element's position
  const rect = $('#images')[0].getBoundingClientRect();

  // Calculate the element's center position
  const elementCenterX = rect.left + rect.width / 2;
  const elementCenterY = rect.top + rect.height / 2;

  // Get the screen's center position
  const screenCenterX = window.innerWidth / 2;
  const screenCenterY = window.innerHeight / 2;

  // Calculate the left and top offset from the element's center position to the screen's center position
  const leftOffset = screenCenterX - rect.left;
  const topOffset = screenCenterY - rect.top;

  const pointDiv = document.createElement('div');
  pointDiv.style.position = 'absolute';
  pointDiv.style.top = `${topOffset}px`;
  pointDiv.style.left = `${leftOffset}px`;
  pointDiv.style.width = '10px';
  pointDiv.style.height = '10px';
  pointDiv.style.backgroundColor = 'red';
  pointDiv.style.borderRadius = '50%';
  pointDiv.style.transform = 'translate(-50%, -50%)';

  $('#images')[0].appendChild(pointDiv);
};

const setSide = (sideIndex) => {
  $currentImgSide.addClass('d-none');

  // Update element ref
  $currentImgSide = sideIndex === 0 ? $sideImg1 : $sideImg2;

  // Update panzoom ref
  if (currentImgPanzoom) {
    resetPanAndZoom(currentImgPanzoom);
    currentImgPanzoom.dispose();
  }
  currentImgPanzoom = panzoom($('#images')[0], {
    maxZoom: 25,
    minZoom: 1,
    zoomSpeed: 0.1,
    smoothScroll: false,
    // bounds: true, // breaks smoothResetPanAndZoom in desktop
  });
  // currentImage.on('panstart', () => setUIEnabled(false));
  // currentImage.on('zoomend', () => setUIEnabled(true));

  currentSideIndex = sideIndex;

  //debug
  window.img = currentImgPanzoom;
  window.imge = $currentImgSide[0];
  // currentImage.on('transform', (e) => console.log(e.getTransform()));
  currentImgPanzoom.on('panend', (e) => console.log(e.getTransform()));

  // Update UI
  $sideToggleButton.text(`Side ${currentSideIndex + 1}`);
  $currentImgSide.removeClass('d-none');
};

const createOptGroupFromList = (list, sideIndex, label) => {
  const optgroup = document.createElement('optgroup');
  optgroup.label = label;

  list.forEach((v, listIndex) => {
    const newOption = new Option(v.name, `${sideIndex}-${listIndex}`, false, false);
    optgroup.append(newOption);
  });

  return optgroup;
};

const createOptionsFromSides = (sides) => {
  $search.empty(); // Clear, recreate

  $search.append('<option></option>'); // Placeholder option

  sides.forEach((s, i) => {
    $search.append(createOptGroupFromList(s.list, i, `Side ${i + 1}`));
  });

  $search.trigger('change');
};

// *************************************************************************
// Event handlers

$sideToggleButton.click((e) => setSide(currentSideIndex === 1 ? 0 : 1));

$resetButton.click((e) => {
  $search.val(null).trigger('change');
  smoothResetPanAndZoom(currentImgPanzoom);
});

$search.on('select2:select', (e) => {
  const [sideIndex, listIndex] = $search.val().split('-');

  zoomOnName(sideIndex, listIndex);
});

// *************************************************************************
// Initialize

$search.select2({
  theme: 'bootstrap-5',
  placeholder: 'Loading...',
  disabled: true,
  width: 'auto',
});

$('#images')
  .imagesLoaded()
  .done(async () => {
    // Fetch metadata and name lists
    sides = await fetch('data/sides.json')
      .then((res) => res.json())
      .then((sides) => {
        const expandListItemAttrNames = (list) =>
          list.map(({ n, i, l, c }) => ({
            name: n,
            nameIndex: i,
            lineIndex: l,
            lineCharOffset: c,
          }));

        sides[0].list = expandListItemAttrNames(sides[0].list);
        sides[1].list = expandListItemAttrNames(sides[1].list);

        return sides;
      });

    console.log(sides);

    // Init name select
    $search.select2({
      theme: 'bootstrap-5',
      placeholder: 'Search for a name...',
      width: 'auto',
      allowClear: true,
      disabled: false,
      minimumInputLength: 1,
      maximumInputLength: 44,
    });
    createOptionsFromSides(sides);

    // Init rest of UI
    setUIEnabled(true);

    setSide(0);
  });

// *************************************************************************
