/// import * as Autodesk from "@types/forge-viewer";
import { getById } from "./objects.js";

async function getAccessToken(callback) {
  try {
    const resp = await fetch("/api/auth/token");
    if (!resp.ok) {
      throw new Error(await resp.text());
    }
    const { access_token, expires_in } = await resp.json();
    callback(access_token, expires_in);
  } catch (err) {
    alert("Could not obtain access token. See the console for more details.");
    console.error(err);
  }
}

export function initViewer(container) {
  return new Promise(function (resolve, reject) {
    Autodesk.Viewing.Initializer({ getAccessToken }, function () {
      const config = {
        extensions: ["Autodesk.DocumentBrowser"],
      };
      const viewer = new Autodesk.Viewing.GuiViewer3D(container, config);
      viewer.start();
      viewer.setTheme("light-theme");
      resolve(viewer);
    });
  });
}

export function loadModel(viewer, urn) {
  return new Promise(function (resolve, reject) {
    function onDocumentLoadSuccess(doc) {
      resolve(viewer.loadDocumentNode(doc, doc.getRoot().getDefaultGeometry()));
    }
    function onDocumentLoadFailure(code, message, errors) {
      reject({ code, message, errors });
    }

    // fonction pour récupérer les propriétés de l'objet sélectionné
    function itemSelected() {
      viewer.addEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        function (event) {
          var selection = viewer.getSelection();
          console.log("Nombre d'items sélectionnés : " + selection.length);
          if (selection.length > 0) {
            viewer.getProperties(selection[0], function (props) {
              var Thename = document.getElementById("TheName");
              var Thetype = document.getElementById("TheType");
              var Thecategory = document.getElementById("TheCat");
              var Thedescription = document.getElementById("TheDescription");

              Thename.innerText = props.name;
              Thetype.innerText = props.properties[1].displayValue;
              let object = getById(props.dbId);
              if (object) {
                Thedescription.innerText = object.description;
                Thecategory.innerText = object.category;
              } else {
                Thedescription.innerText = "No description";
                Thecategory.innerText = "No category";
              }
              console.log(props);
            });
          } else {
            var Thename = document.getElementById("TheName");
            var Thetype = document.getElementById("TheType");
            var Thedescription = document.getElementById("TheDescription");
            var Thecategory = document.getElementById("TheCat");
            Thename.innerText = "No name";
            Thetype.innerText = "No type";
            Thecategory.innerText = "No category";
            Thedescription.innerText = "No description";
          }
        }
      );
    }

    viewer.setLightPreset(0);
    Autodesk.Viewing.Document.load(
      "urn:" + urn,
      onDocumentLoadSuccess,
      onDocumentLoadFailure
    );
    itemSelected();
  });
}
