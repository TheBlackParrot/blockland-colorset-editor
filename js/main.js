// https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
function saveTextAsFile()
{
	var textToWrite = document.getElementById("textInput").value.replace(/\n/g, "\r\n"); // hashtag windows
	var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
	var fileNameToSaveAs = "colorSet.txt";

	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	if (window.URL != null)
	{
		// Chrome allows the link to be clicked
		// without actually adding it to the DOM.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
	}
	else
	{
		// Firefox requires the link to be added to the DOM
		// before it can be clicked.
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();
}

function destroyClickedElement(event)
{
	document.body.removeChild(event.target);
}

function loadFileAsText(callback)
{
	var fileToLoad = document.getElementById("fileToLoad").files[0];

	var fileReader = new FileReader();
	fileReader.onload = function(fileLoadedEvent) 
	{
		var textFromFileLoaded = fileLoadedEvent.target.result;
		document.getElementById("textInput").value = textFromFileLoaded;
	};
	fileReader.readAsText(fileToLoad, "UTF-8");

	if(typeof(callback) == "function") {
		callback();
	}
}



var previousCell = -1;
var activeLine = -1;

function setActiveCell() {
	var textarea = document.getElementById("textInput");

	var lines = textarea.value.split('\n');

	for(var i = 0; i < lines.length; i++) {
		if(lines[i].length == 0) {
			lines.splice(i, 1);
			i--;
		} else {
			if(lines[i].indexOf("DIV:") != -1) {
				lines.splice(i, 1);
				i--;
			}
		}
	}

	// god bless
	var currentLineNum = textarea.value.substr(0, textarea.selectionStart).split("\n").length;
	activeLine = (currentLineNum-1);
	var currentLines = textarea.value.split("\n");
	var currentLine = currentLines[currentLineNum-1];
	var cell = lines.indexOf(currentLine);
	console.log(cell);

	var color = currentLine.split(" ");

	if(cell != previousCell) {
		$(".color[index=" + previousCell + "]").removeClass("active_color");
	}

	$(".color[index=" + cell + "]").addClass("active_color");

	previousCell = cell;

	if(cell == -1) {
		$("#colorModR").slider("option", "disabled", true);
		$("#colorModG").slider("option", "disabled", true);
		$("#colorModB").slider("option", "disabled", true);
		$("#colorModA").slider("option", "disabled", true);
	} else {
		$("#colorModR").slider("option", "disabled", false);
		$("#colorModR").slider("option", "value", color[0]);
		$("#colorModG").slider("option", "disabled", false);
		$("#colorModG").slider("option", "value", color[1]);
		$("#colorModB").slider("option", "disabled", false);
		$("#colorModB").slider("option", "value", color[2]);
		$("#colorModA").slider("option", "disabled", false);
		$("#colorModA").slider("option", "value", color[3]);

		var toDisable = "ABGR";
		for(var i = 0; i < 4-color.length; i++) {
			$("#colorMod" + toDisable[i]).slider("option", "disabled", true);
		}
	}
}

$('#textInput').bind('input propertychange', function() {
	$(".colors").empty();

	var column = $('<div class="column"></div>');

	var lines = this.value.split('\n');
	var index = 0;

	for(var i = 0; i < lines.length; i++) {
		if(lines[i].length) {
			if(lines[i].indexOf("DIV:") == -1) {
				var colorInput = lines[i].split(" ");
				
				color = [0, 0, 0, 255];
				for(var j = 0; j < colorInput.length; j++) {
					var val = parseFloat(colorInput[j])
					if(!isNaN(val)) {
						color[j] = val;
					}
				}

				color[3] = parseFloat(color[3]) / 255;
				color = color.toString();

				column.append($('<div index="' + index + '" class="color" style="background: linear-gradient(rgba(' + color + '), rgba(' + color + ')), url(\'images/trans.png\') no-repeat center;"></div>'));
				index++;
			} else {
				$(".colors").append(column);
				column = $('<div class="column"></div>');;
			}
		}
	}

	if(column) {
		$(".colors").append(column);
	}

	$(".colorcount").html(index + ' <span style="font-size: 8pt;">/ 64</span>');
});

$("#fileWorkaround").on("click", function(){
	$("#fileToLoad").click();
});

$("#fileToLoad").on("change", function(){
	loadFileAsText();
	setTimeout(function(){
		$('#textInput').trigger('input');
	}, 100);
});

function updateTextInput(slider, value) {
	var textarea = document.getElementById("textInput");

	var lines = textarea.value.split('\n');

	var color = lines[activeLine].split(" ");
	
	switch(slider) {
		case "R":
			color[0] = value;
			break;

		case "G":
			color[1] = value;
			break;

		case "B":
			color[2] = value;
			break;

		case "A":
			color[3] = value;
			break;
	}

	moddedColor = color.join(" ");
	lines[activeLine] = moddedColor;

	textarea.value = lines.join("\n");

	$('#textInput').trigger('input');
}

$("#colorModR").slider({
	max: 255,
	min: 0,
	disabled: true
});

$("#colorModR").on("slide slidechange", function(event, ui){
	var value = $(this).slider("value");
	if(isNaN(value)) {
		$(this).parent().find(".slider_value").text("-");
		return;
	}
	
	var which = $(this).parent().find("span:first-child").text();

	$(this).parent().find(".slider_value").text(value);
	updateTextInput(which, value);
});

$("#colorModG").slider({
	max: 255,
	min: 0,
	disabled: true
});

$("#colorModG").on("slide slidechange", function(event, ui){
	var value = $(this).slider("value");
	if(isNaN(value)) {
		$(this).parent().find(".slider_value").text("-");
		return;
	}

	var which = $(this).parent().find("span:first-child").text();

	$(this).parent().find(".slider_value").text(value);
	updateTextInput(which, value);
});

$("#colorModB").slider({
	max: 255,
	min: 0,
	disabled: true
});

$("#colorModB").on("slide slidechange", function(event, ui){
	var value = $(this).slider("value");
	if(isNaN(value)) {
		$(this).parent().find(".slider_value").text("-");
		return;
	}

	var which = $(this).parent().find("span:first-child").text();

	$(this).parent().find(".slider_value").text(value);
	updateTextInput(which, value);
});

$("#colorModA").slider({
	max: 255,
	min: 0,
	disabled: true
});

$("#colorModA").on("slide slidechange", function(event, ui){
	var value = $(this).slider("value");
	if(isNaN(value)) {
		$(this).parent().find(".slider_value").text("-");
		return;
	}

	var which = $(this).parent().find("span:first-child").text();

	$(this).parent().find(".slider_value").text(value);
	updateTextInput(which, value);
});

console.log("JS loaded");