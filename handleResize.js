function handleResize() {
  const width = window.innerWidth;
  const containerFeaturesWidget = document.getElementById(
    "container-features-widget"
  );
  const containerDropdownMetrics = document.getElementById(
    "label-dropdown-layers"
  );
  // const container2D3DChipGroup = document.querySelector(
  //   "calcite-chip-group#chip-group-2d-3d"
  // );
  // const chip2D = document.querySelector("calcite-chip#chip-2d");
  // const chip3D = document.querySelector("calcite-chip#chip-3d");

  /* Move the features widget div from shell panel to bottom panel v.v. */
  if (width < 768 && containerFeaturesWidget) {
    const calcitePanelBottom = document.getElementById("panel-bottom");
    calcitePanelBottom.appendChild(containerFeaturesWidget);
    /*  2D / 3D */
    // const container2D3D = document.getElementById("container-2d-3d-mobile");
    // container2D3D.appendChild(container2D3DChipGroup);
    // container2D3DChipGroup.scale = "s";
    // chip2D.scale = "s";
    // chip3D.scale = "s";
    /* Metrics */
    const containerMetrics = document.getElementById(
      "container-metrics-mobile"
    );
    containerMetrics.appendChild(containerDropdownMetrics);
  } else {
    /* Desktop */
    const calcitePanelLeft = document.getElementById("block-features-widget");
    calcitePanelLeft.appendChild(containerFeaturesWidget);
    /*  2D / 3D */
    // const container2D3D = document.getElementById("container-2d-3d-desktop");
    // container2D3D.appendChild(container2D3DChipGroup);
    // container2D3DChipGroup.scale = "m";
    // chip2D.scale = "m";
    // chip3D.scale = "m";

    /* Metrics*/
    const containerMetrics = document.getElementById(
      "container-metrics-desktop"
    );
    containerMetrics.appendChild(containerDropdownMetrics);
  }
  //
  // Toggle the navigation action in mobile view
  //
  const calciteNavigationComponent =
    document.querySelector("calcite-navigation");
  calciteNavigationComponent.navigationAction = width < 768;

  //
  // Reposition the value picker
  //
  const valuePickerElement = document.getElementById(
    "container-value-picker-widget"
  );

  //
  // Reposition the chip group on resize
  //
  //const chipGroupElement = document.getElementById("chip-group-layers");
  const mapElement = document.getElementById("viewDiv");
  //console.log(mapElement.clientWidth);
  valuePickerElement.style.right = `${
    mapElement.clientWidth / 2 - valuePickerElement.clientWidth / 2
  }px`;

  // chipGroupElement.style.right = `${
  //   mapElement.clientWidth / 2 - chipGroupElement.clientWidth / 2
  // }px`;
}
addEventListener("DOMContentLoaded", (event) => {
  setTimeout(() => {
    handleResize();
  }, 2000);
});
window.addEventListener("resize", handleResize);

/* Open the Calcite Sheet with the navigation action */
const navigation = document.querySelector(
  "calcite-navigation#primary-navigation"
);
const sheet = document.querySelector("calcite-sheet");
navigation?.addEventListener("calciteNavigationActionSelect", function () {
  sheet.open = true;
});

/* Closing the sheet in the panel button */
sheet?.addEventListener("calciteSheetClose", function () {
  sheet.open = false;
});
