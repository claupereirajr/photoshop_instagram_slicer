//
// ================================================================================= //
//
// Generate and Export Slices - Adobe Photoshop Script
// Description: This script create slices in 1920x1920 or 1080x1080 or 1080x1920 size for web images in .jpg file
// Version: 2.21, 09/03/2023
// Author: Claudinei Pereira Jr
// Company: claudineijr.dev
//
// ================================================================================= //
//

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 1;
// debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;


function DisplayAlert(message, title, errorType){
  Window.alert(message, title, errorType);
};

// MAIN FUNCTION
function __main__(){
  // If don"t have any file open
  if (!app.documents.length) {
    DisplayAlert("None project open", "Error no document", true);
    return;
  }
  DialogSelectSizeFile();
};

// Config to Export for Web PNG
function getJPEGOptions() {
  var options = new ExportOptionsSaveForWeb();
  options.format = SaveDocumentType.PNG;
  options.PNG8 = false;
  options.transparency = true;
  options.interlaced = false;
  return options;
}

function DialogSelectSizeFile(){
  var dlg = new Window("dialog", "Instagram Carousel Slicer"),
    directory = app.activeDocument.path,
    documentDimension = {
			x: parseFloat(app.activeDocument.width, 10),
			y: parseFloat(app.activeDocument.height, 10)
		},
    docName = app.activeDocument.name;

    dlg.margins = 20;

    /*Directory Selection*/
    dlg.dirPanel = dlg.add('group');
    dlg.dirPanel.orientation = "row";
    dlg.dirPanel.spacing = 20;

    dlg.dirPanel.btnDirectory = dlg.dirPanel.add('button', [undefined, undefined, 100, 30], 'Select directory', {
      name: 'btn_dir'
    });

    dlg.dirPanel.lblDirectory = dlg.dirPanel.add('statictext', [undefined, undefined, 360, 20], directory.fsName, {
      name: 'lbl_dir'
    });

    dlg.dirPanel.btnDirectory.onClick = function () {
      directory = Folder.selectDialog("Select folder to save...");
      if (directory == null) {
        directory = app.activeDocument.path;
      }
      dlg.dirPanel.lblDirectory.text = decodeURI(directory.fsName);
    };

    /*Type Selection*/
    dlg.typePanel = dlg.add("group");
    dlg.typePanel.orientation = "row";
    dlg.typePanel.spacing = 20;

    dlg.typePanel.cbType1 = dlg.typePanel.add("radiobutton", [undefined, undefined, 120, 30], "1920x1920 px", {
      name: "cb_type_1"
    });
    dlg.typePanel.cbType2 = dlg.typePanel.add("radiobutton", [undefined, undefined, 120, 30], "1080x1080 px", {
      name: "cb_type_2"
    });

    dlg.typePanel.cbType3 = dlg.typePanel.add("radiobutton", [undefined, undefined, 120, 30], "Story 1080x1920 px", {
      name: "cb_type_3"
    });

    dlg.typePanel.cbType1.value = true;

    dlg.typePanel.cbType1.onClick = function () {
      if (dlg.typePanel.cbType1.value) {
        dlg.typePanel.cbType2.value = false;
        dlg.typePanel.cbType3.value = false;
      } else {
        dlg.typePanel.cbType1.value = true;
      }
    };

    dlg.typePanel.cbType2.onClick = function () {
      if (dlg.typePanel.cbType2.value) {
        dlg.typePanel.cbType1.value = false;
        dlg.typePanel.cbType3.value = false;
      } else {
        dlg.typePanel.cbType2.value = true;
      }
    };

    dlg.typePanel.cbType3.onClick = function () {
      if (dlg.typePanel.cbType3.value) {
        dlg.typePanel.cbType1.value = false;
        dlg.typePanel.cbType2.value = false;
      } else {
        dlg.typePanel.cbType3.value = true;
      }
    };

    /*Buttons*/
    dlg.btnPnl = dlg.add("group");
    dlg.btnPnl.orientation = "row";
    dlg.btnPnl.spacing = 20;

    dlg.btnPnl.btnApply = dlg.btnPnl.add("button", [undefined, undefined, 230, 30], "Export", {
      name: "btnApply"
    });

    dlg.btnPnl.btnCancel = dlg.btnPnl.add("button", [undefined, undefined, 230, 30], "Cancel", {
      name: "btnCancel"
    });

    dlg.btnPnl.btnApply.onClick = handleClick;

    dlg.btnPnl.btnCancel.onClick = function () {
      dlg.close();
    };

    function handleClick() {
      var selected = null;
      if (dlg.typePanel.cbType1.value) {
        selected = dlg.typePanel.cbType1;
      } else if (dlg.typePanel.cbType2.value) {
        selected = dlg.typePanel.cbType2;
      } else if (dlg.typePanel.cbType3.value) {
        selected = dlg.typePanel.cbType3;
      }
      else {
        
      }

      switch (selected.text) {
        case "1920x1920 px":
          sliceMaker(1920,1920,"1920x1920 px", directory);
          dlg.close();
          break;
        case "1080x1080 px":
          sliceMaker(1080,1080,"1080x1080 px",directory);
          dlg.close();
          break;
        case "Story 1080x1920 px":
          sliceMaker(1080,1920,"Story 1080x1920 px",directory);
          dlg.close();
          break;
        default:
          alert("Undefined Error.");
          break;
      }
    };

	  dlg.show();
}


// Slice Creator
function Slice(bounds) {
    var idMk = charIDToTypeID("Mk  ");
    var desc67 = new ActionDescriptor();
    var idnull = charIDToTypeID("null");
    var ref27 = new ActionReference();
    var idslice = stringIDToTypeID("slice");
    ref27.putClass(idslice);
    desc67.putReference(idnull, ref27);
    var idUsng = charIDToTypeID("Usng");
    var desc68 = new ActionDescriptor();
    var idType = charIDToTypeID("Type");
    var idsliceType = stringIDToTypeID("sliceType");
    var iduser = stringIDToTypeID("user");
    desc68.putEnumerated(idType, idsliceType, iduser);
    var idAt = charIDToTypeID("At  ");
    var desc69 = new ActionDescriptor();
    var idTop = charIDToTypeID("Top ");
    var idPxl = charIDToTypeID("#Pxl");
    desc69.putUnitDouble(idTop, idPxl, bounds[0]);
    var idRght = charIDToTypeID("Rght");
    desc69.putUnitDouble(idRght, idPxl, bounds[1]);
    var idBtom = charIDToTypeID("Btom");
    desc69.putUnitDouble(idBtom, idPxl, bounds[2]);
    var idLeft = charIDToTypeID("Left");
    desc69.putUnitDouble(idLeft, idPxl, bounds[3]);
    var idRctn = charIDToTypeID("Rctn");
    desc68.putObject(idAt, idRctn, desc69);
    desc67.putObject(idUsng, idslice, desc68);
    executeAction(idMk, desc67, DialogModes.NO);
}

// Main Recursive Slicer
function sliceMaker(baseWidth, baseHeight, typeImage, directory){

  // Default Variables
  app.preferences.rulerUnits = Units.PIXELS;
  var originalUnits = app.preferences.rulerUnits;

  // Document Variables
  var currentDoc = app.activeDocument;
  var docPath = currentDoc.path;
  var docName = currentDoc.name.match(/(.*)\.[^\.]+$/)[1];

  // Start variables
  var docWidth = currentDoc.width.value;
  var screens = docWidth/baseWidth;
  var historySavedState = currentDoc.activeHistoryState;
  var alllayers = currentDoc.artLayers;

  // Verify width it's multple of 1080px so 1080 x 4 (images) = 7680px
  // if (docWidth % screens != 0){
  //   DisplayAlert("Largura errada ou Altura errada", "Erro de Tamanho", false);
  //   return;
  // }

  var tmp = baseWidth;

  for (var i = 0; i < screens; i++) {
    var newLeft = tmp - baseWidth;

    var bounds = [
      parseInt(0, 10),  // Top
      parseInt(tmp, 10),  // Right
      parseInt(baseHeight, 10),  // Bottom
      parseInt(newLeft, 10)   // Left
    ];
    Slice(bounds);
    tmp += baseWidth;
  }

  // Save the state after slice
  var historySavedStateAfterSlice = currentDoc.activeHistoryState;
  
  // Export Options
  var webOptions = getJPEGOptions();

  // Create New PNG File
  var fileName = app.activeDocument.name.substring(0, app.activeDocument.name.lastIndexOf("."));
  var fullPath = directory + "/" + fileName + "_TELA_" + ".txt";
  var file = new File(fullPath);

  // Export Files
  currentDoc.exportDocument(file, ExportType.SAVEFORWEB, webOptions);
  DisplayAlert("Carousel exported in "+ directory,"Tudo certo !",false);
};

__main__();
