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
	var currentLines = textarea.value.split("\n");
	var currentLine = currentLines[currentLineNum-1];
	var cell = lines.indexOf(currentLine);

	if(cell != previousCell) {
		$(".color[index=" + previousCell + "]").css("border", "1px solid rgba(255, 255, 255, 0.33)");
		$(".color[index=" + previousCell + "]").css("box-shadow", "none");
	}

	$(".color[index=" + cell + "]").css("border", "1px solid #fff");
	$(".color[index=" + cell + "]").css("box-shadow", "inset 0px 0px 16px #fff");

	previousCell = cell;
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

console.log("JS loaded");