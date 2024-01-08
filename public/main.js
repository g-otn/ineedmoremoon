const $sideImg1 = $('#img-side1');
const $sideImg2 = $('#img-side2');

// *************************************************************************

const $sideToggleButton = $('#side-toggle');
const $search = $('#search');
const $resetButton = $('#reset');

let sides = [];
let currentSideIndex = -1;
let currentImage = null;
let $currentImageElement = $sideImg1;

// *************************************************************************

// https://github.com/anvaka/panzoom/issues/69#issuecomment-535444960
const smoothResetPanAndZoom = () => {
  const xys = currentImage.getTransform();
  // img is the reference to the panzoom object
  if (xys.scale > 1) {
    // calculate the point that should not move
    const fScale = 1 - xys.scale;
    const fixeX = xys.x / fScale;
    const fixeY = xys.y / fScale;
    currentImage.smoothZoomAbs(fixeX, fixeY, 1);
  } else {
    // just go back to (0, 0) and scale 1
    currentImage.moveBy(-xys.x, -xys.y, true);
    currentImage.smoothZoomAbs(xys.x, xys.y, 1);
  }
  currentImage.moveTo(0, 0); // to be sure to go back to (0,0)
  currentImage.zoomAbs(0, 0, 1); // to be sure to go back to scale 1
};

const resetPanAndZoom = () => {
  currentImage.moveTo(0, 0);
  currentImage.zoomAbs(0, 0, 1);
};

const zoomOnName = (listIndex) => {
  const item = sides[currentSideIndex].list[listIndex];
  const m = sides[currentSideIndex].metadata;
  console.log(item, m);
  const y = item.lineIndex / m.lineCount;
  console.log(y);
  console.log(currentImage);
  // resetPanAndZoom()
  currentImage.smoothZoom(200, 400, 5);
};

const setUIEnabled = (enable) => {
  $sideToggleButton.attr('disabled', !enable);
  $search.attr('disabled', !enable);
  $resetButton.attr('disabled', !enable);
};

const setSide = (sideIndex) => {
  if (!Number.isFinite(sideIndex) || sideIndex === currentSideIndex) {
    return;
  }

  // Block actions
  $currentImageElement.addClass('d-none');
  setUIEnabled(false);

  // Update element ref
  if ($currentImageElement === $sideImg1) {
    $currentImageElement = $sideImg2;
  } else {
    $currentImageElement = $sideImg1;
  }

  $currentImageElement.removeClass('d-none');

  // Update panzoom ref
  if (currentImage) {
    resetPanAndZoom(currentImage);
    currentImage.dispose();
  }
  currentImage = panzoom($currentImageElement[0], {
    maxZoom: 20,
    minZoom: 0.75,
    zoomSpeed: 10,
    // bounds: true, // breaks smoothResetPanAndZoom
  });

  //debug
  window.img = currentImage;
  currentImage.on('transform', (e) => console.log(e.getTransform()));

  currentSideIndex = sideIndex;
  $sideToggleButton.text(`Side ${currentSideIndex + 1}`);

  setUIEnabled(true);
};

const createOptGroupFromList = (list, index, label) => {
  const optgroup = document.createElement('optgroup');
  optgroup.label = label;

  list.forEach((v, i) => {
    const newOption = new Option(v.name, i, false, false);
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

$resetButton.click((e) => smoothResetPanAndZoom(currentImage));

$search.on('select2:select', (e) => {
  const listIndex = $search.val();
  zoomOnName(listIndex);
});

// *************************************************************************
// Initialize

$search.select2({
  theme: 'bootstrap-5',
  placeholder: 'Loading...',
  disabled: true,
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
