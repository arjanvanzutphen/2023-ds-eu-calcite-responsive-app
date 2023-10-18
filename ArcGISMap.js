// @arcgis/core
import WebMap from "https://js.arcgis.com/4.28/@arcgis/core//WebMap.js";
import WebScene from "https://js.arcgis.com/4.28/@arcgis/core//WebScene.js";
import MapView from "https://js.arcgis.com/4.28/@arcgis/core/views/MapView.js";
import SceneView from "https://js.arcgis.com/4.28/@arcgis/core/views/SceneView.js";
import Features from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Features.js";
import * as reactiveUtils from "https://js.arcgis.com/4.28/@arcgis/core/core/reactiveUtils.js";
import Expand from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Expand.js";
import LayerList from "https://js.arcgis.com/4.28/@arcgis/core/widgets/LayerList.js";
import Legend from "https://js.arcgis.com/4.28/@arcgis/core/widgets/Legend.js";
import ValuePicker from "https://js.arcgis.com/4.28/@arcgis/core/widgets/ValuePicker.js";

/**
 * Initialize map
 */
console.log("Starting map");
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
let map;
let view;

/* Loading a mapView (2d) */
if (Array.from(urlParams.keys()).includes("webmap_id")) {
  const itemId = urlParams.get("webmap_id");
  map = new WebMap({
    portalItem: {
      id: itemId,
    },
  });
  view = new MapView({
    container: "viewDiv",
  });
} else if (Array.from(urlParams.keys()).includes("webscene_id")) {
  /* Loading a sceneView (3d) */
  const itemId = urlParams.get("webscene_id");
  map = new WebScene({
    portalItem: {
      id: itemId,
    },
  });
  view = new SceneView({
    container: "viewDiv",
  });
} else {
  map = new WebMap({
    portalItem: {
      id: "f7d59aec8487406bb9996d42ec60e277",
    },
  });
  view = new MapView({
    container: "viewDiv",
  });
}

map
  .load()
  .then(() => {
    view.map = map;
    view.popupEnabled = false;
    document.title = view?.map?.portalItem?.title;
    document.querySelector("calcite-navigation-logo").heading =
      view?.map?.portalItem?.title;
    document.getElementById(
      "container-item-details-img"
    ).src = `https://www.arcgis.com/sharing/rest/content/items/${view?.map?.portalItem?.id}/info/${view?.map?.portalItem?.thumbnail}`;
    document.getElementById("container-item-details-description").innerText =
      view?.map?.portalItem?.snippet;

    /* LayerList */
    // const layerListWidget = new LayerList({
    //   view: view,
    // });
    // const expandLayerListWidget = new Expand({
    //   content: layerListWidget,
    // });
    // view.ui.add(expandLayerListWidget, "top-right");
    //view.ui.move("zoom", "bottom-right");
    view.ui.components = ["attribution"];
    const legendWidget = new Legend({
      view: view,
    });
    const expandLegendWidget = new Expand({
      content: legendWidget,
    });
    view.ui.add(expandLegendWidget, "top-right");
    renderDropdownLayers(view.map.layers);
    // Setting the title of the app
    document.querySelector("calcite-navigation-logo").heading =
      view.map.portalItem.title;
    /* Loading the bookmarks in a 2d map */
    if (Array.from(urlParams.keys()).includes("webmap_id")) {
      renderBookmarksDesktop(view.map.bookmarks, view);
      renderBookmarksMobile(view.map.bookmarks, view);
    }
    /* Loading the slides (3d-version of bookmarks) from the 3d scene */
    if (Array.from(urlParams.keys()).includes("webscene_id")) {
      renderSlidesDesktop(view.map.presentation.slides, view);
      renderSlidesMobile(view.map.presentation.slides, view);
    }

    // renderChipGroupLayers(view.map.layers);

    const featuresWidget = new Features({
      container: "container-features-widget",
      viewModel: {
        // Add a custom action to the widget that will open a
        // website when it's selected.
        actions: [
          {
            type: "button",
            title: "More information",
            id: "more-info",
            icon: "information-letter",
          },
        ],
        view: view,
      },
    });

    // Add the widget to the bottom-right corner of the view
    if (Array.from(urlParams.keys()).includes("webmap_id")) {
      const valuePickerTime = new ValuePicker({
        container: "container-value-picker-widget",
        component: {
          // autocasts ValuePickerSlider when type is "slider".
          type: "slider",
          min: 2013, // Start value
          max: 2021, // End value
          steps: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], // Thumb snapping locations
          // minorTicks: [
          //   2013.5, 2014.5, 2015.5, 2016.5, 2017.5, 2018.5, 2019.5, 2020.5,
          // ], // Short tick lines
          majorTicks: [2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021], // Long tick lines
          labels: [2013, 2021], // Long ticks with text
          // labelFormatFunction: (value) => `${value}%`, // Label definition
        },
        visibleElements: {
          nextButton: false,
          playButton: true,
          previousButton: false,
        },
        values: [2013], // "current value"
      });

      view.ui.add(valuePickerTime, "manual");

      // watch the values change on the value picker update the
      // view.timeExtent show to the land cover for the given year
      valuePickerTime.watch("values", (values) => {
        const startDate = new Date(Date.UTC(values[0], 11, 30, 0, 0, 0)); // One day before
        const endDate = new Date(Date.UTC(values[0] + 1, 0, 1, 0, 0, 0)); // One day later
        view.timeExtent = {
          start: startDate,
          end: endDate,
        };
      });
    }

    //
    //  EVENTS
    //
    // Open the Features widget with features fetched from
    // the view click event location.
    reactiveUtils.on(
      () => view,
      "click",
      (event) => {
        featuresWidget.open({
          location: event.mapPoint,
          fetchFeatures: true,
        });
      }
    );

    // Use reactiveUtils to watch the Features widget trigger-action
    // and open a website if the specific action is clicked.
    reactiveUtils.on(
      () => featuresWidget,
      "trigger-action",
      (event) => {
        // TODO: use a more appropriate link
        if (event.action.id === "more-info") {
          window.open("https://developers.arcgis.com/javascript");
        }
      }
    );

    // Use reactiveUtils to watch the Features widget features property

    reactiveUtils.watch(
      () => featuresWidget.features,
      (features) => {
        console.log("Features widget features: ", features);
        document.getElementById("calcite-tip-select-features").style.display =
          features.length === 0 ? "" : "none";
      }
    );

    /**
     * On change select dropdown layers / metric
     */
    const dropdownLayers = document.querySelector(
      "calcite-dropdown#dropdown-layers"
    );

    dropdownLayers.calciteDropdownSelect = (evt) => {
      debugger;

      console.log("dropdownLayers: ", evt);
    };
  })
  .catch((error) => {
    console.error("Unable to load the map. Error: ", error);
  });

const renderBookmarksDesktop = (bookmarks, mapView) => {
  const containerDesktop = document.getElementById(
    "calcite-menu-bookmarks-desktop"
  );
  const bookmarkComponentsDesktop = bookmarks.items.map((bookmark) => {
    const bookmarkMenuItem = document.createElement("calcite-menu-item");
    bookmarkMenuItem.iconStart = "bookmark";
    bookmarkMenuItem.textEnabled = true;
    bookmarkMenuItem.text = bookmark.name;

    bookmarkMenuItem.onclick = () => {
      mapView.goTo(bookmark.viewpoint.targetGeometry);
    };

    return bookmarkMenuItem;
  });
  containerDesktop.append(...bookmarkComponentsDesktop);
};

const renderBookmarksMobile = (bookmarks, mapView) => {
  const containerMobile = document.getElementById(
    "calcite-menu-bookmarks-mobile"
  );
  const bookmarkComponentsMobile = bookmarks.items.map((bookmark) => {
    const bookmarkMenuItem = document.createElement("calcite-menu-item");
    bookmarkMenuItem.iconStart = "bookmark";
    bookmarkMenuItem.textEnabled = true;
    bookmarkMenuItem.text = bookmark.name;

    bookmarkMenuItem.onclick = () => {
      mapView.goTo(bookmark.viewpoint.targetGeometry);
      const sheetComponent = document.querySelector("calcite-sheet");
      sheetComponent.open = false;
    };

    return bookmarkMenuItem;
  });
  containerMobile.append(...bookmarkComponentsMobile);
};

const renderSlidesDesktop = (slides, sceneView) => {
  const containerDesktop = document.getElementById(
    "calcite-menu-bookmarks-desktop"
  );
  const slidesComponentsDesktop = slides.items.map((slide) => {
    const slideMenuItem = document.createElement("calcite-menu-item");
    slideMenuItem.iconStart = "bookmark";
    slideMenuItem.textEnabled = true;
    slideMenuItem.text = slide.title.text;

    slideMenuItem.onclick = () => {
      // In 3d we use camera instead of targetGeometry in 2d
      sceneView.goTo(slide.viewpoint.camera);
    };

    return slideMenuItem;
  });
  containerDesktop.append(...slidesComponentsDesktop);
};

const renderSlidesMobile = (slides, sceneView) => {
  const containerMobile = document.getElementById(
    "calcite-menu-bookmarks-mobile"
  );
  const slidesComponentsMobile = slides.items.map((slide) => {
    const slideMenuItem = document.createElement("calcite-menu-item");
    slideMenuItem.iconStart = "bookmark";
    slideMenuItem.textEnabled = true;
    slideMenuItem.text = slide.title.text;

    slideMenuItem.onclick = () => {
      // In 3d we use camera instead of targetGeometry in 2d
      sceneView.goTo(slide.viewpoint.camera);
      const sheetComponent = document.querySelector("calcite-sheet");
      sheetComponent.open = false;
    };

    return slideMenuItem;
  });
  containerMobile.append(...slidesComponentsMobile);
};

const renderChipGroupLayers = (layers) => {
  const chipsLayers = layers.items.map((layer) => {
    const chip = document.createElement("calcite-chip");
    chip.id = layer.id;
    chip.value = layer.title;
    chip.classList = [layer.id];
    chip.innerText = layer.title;
    chip.selected = layer.visible;
    // Watch the state of layers' visibility
    reactiveUtils.watch(
      () => layer.visible,
      () => {
        chip.selected = layer.visible;
      }
    );
    //
    chip.onclick = (evt) => {
      const layer = layers.find((layer) => {
        return layer.id === evt.currentTarget.id;
      });
      layer.visible = !layer.visible;
    };
    return chip;
  });

  const chipGroupLayers = document.getElementById("chip-group-layers");
  chipGroupLayers.append(...chipsLayers);
};

const renderDropdownLayers = (layers) => {
  const dropDownItemLayers = layers.items.map((layer) => {
    const dropdownItem = document.createElement("calcite-dropdown-item");
    dropdownItem.id = layer.id;
    dropdownItem.value = layer.id;
    dropdownItem.innerText = layer.title;
    dropdownItem.classList = [layer.id];
    dropdownItem.selected = layer.visible;
    // Watch the state of layers' visibility
    reactiveUtils.watch(
      () => layer.visible,
      () => {
        dropdownItem.selected = layer.visible;
      }
    );
    //
    dropdownItem.onclick = (evt) => {
      layers.forEach((layer) => {
        layer.visible = layer.id === evt.currentTarget.id ? true : false;
      });
      // const layer = layers.find((layer) => {
      //   return layer.id === evt.currentTarget.id;
      // });
      // layer.visible = !layer.visible;
      document.querySelector("calcite-button#button-layers").innerHTML =
        layer.title;
    };
    return dropdownItem;
  });

  const dropdownElement = document.querySelector(
    "calcite-dropdown#dropdown-layers"
  );
  dropdownElement.append(...dropDownItemLayers);
};
