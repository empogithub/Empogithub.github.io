var correct;
var current = 0;
var selected;
var chooseCount = 10;
var custom = [];

function randomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

$('input[type="checkbox"]').on('keyup', function(e) {
    $("#submit").focus();
    $("#submit").click();
});

$('input[type="checkbox"]').on('change', function() {
    $('input[type="checkbox"]').not(this).prop('checked', false);
});

$('#submit').click(function(e) {
    var elements = $('input[type="checkbox"]');
    $('input[type="checkbox"]').prop('style', 'outline: 2px solid red;');
    $(`#checkbox${correct}`).prop('style', 'outline: 2px solid green;');
});

$('#random').click(function(e) {
	if (custom.length == 0) {
		current = randomInt(signs.length);
		prepareSelect($('input[type="checkbox"]').length);
	} else {
		current = custom[randomInt(custom.length)]-1;
		prepareSelect($('input[type="checkbox"]').length);
	}
});

$('#previous').click(function(e) {
	if (custom.length == 0) {
		if (current-1 >= 0) { current -= 1; }
		prepareSelect($('input[type="checkbox"]').length);
	} else {
		if (current-1 >= custom[0]-1) { current = custom[custom.indexOf(current+1)-1]-1; }
		prepareSelect($('input[type="checkbox"]').length);
	}
});

$('#next').click(function(e) {
	if (custom.length == 0) {
		if (current+1 < signs.length) { current += 1; }
		prepareSelect($('input[type="checkbox"]').length);
	} else {
		if (current+1 < custom[custom.length-1]) { current = custom[custom.indexOf(current+1)+1]-1; }
		prepareSelect($('input[type="checkbox"]').length);
	}
});

function prepareSelect(size) {
    if (window.location.href.includes("#")) {
        var loc = `${window.location.href.split("#")[0]}#id=${current+1}`;
    } else {
        var loc = `${window.location.href}#id=${current+1}`
    }

    location.replace(loc);
    selected = signs[current];
    correct = randomInt(size)+1;

    $('#current')[0].innerHTML = current+1;
    $('#text')[0].innerHTML = selected.name;
    $('#type')[0].innerHTML = selected.type;
    $('#description')[0].innerHTML = selected.description;

    $('img').prop('src', '');
    $('input[type="checkbox"]').prop('style', '');
    $('input[type="checkbox"]').prop('checked', false);

    for (var i = 1; i < size+1; i++) {
        var sign = signs[randomInt(signs.length)];

        if (correct == i) {
            $(`label[for='checkbox${correct}']`)[0].children[0].src = selected.image;
        } else if ((sign.name != selected.name) && (selected.type == sign.type)) {
            $(`label[for='checkbox${i}']`)[0].children[0].src = sign.image;
        } else {
            i -= 1;
        }
    }
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function generateAmount(size) {
	$("input[type='checkbox']").remove();
	$("label").remove();

	for (var i = 0; i < size; i++) {
		var after = $(`label[for='checkbox${i}']`)[0];
		if (i == 0) { after = $('#description')[0]; }

		var input = document.createElement('input');
		input.id = `checkbox${i+1}`;
		input.type = 'checkbox';
		insertAfter(after, input);

		after = $(`#checkbox${i+1}`)[0];

		var img = document.createElement('img');
		img.width = '48';
		img.height = '48';

		var label = document.createElement('label');
		label.htmlFor = `checkbox${i+1}`;
		label.appendChild(img);
		insertAfter(after, label);
	}

	$('input[type="checkbox"]').on('change', function() {
		$('input[type="checkbox"]').not(this).prop('checked', false);
	});
}

$('#selected').keypress(function (e) {
    if (e.which != 13) { return; }
	$('#select')[0].click();
});

$('#select').click(function(e) {
    try {
		var value = JSON.parse($('#selected')[0].value);
		if (!Array.isArray(value)) { return alert("Invalid format."); }
	} catch(e) {return alert(e); }

	custom = value.filter(e => !isNaN(e))
	$('#selected')[0].value = JSON.stringify(custom).replaceAll(",", ", ");
	$('#random')[0].click();
});

$('#amount').keypress(function (e) {
    if (e.which != 13) { return; }
	$('#amount-button')[0].click();
});

$('#amount-button').click(function(e) {
    try {
		var value = JSON.parse($('#amount')[0].value);
		if (isNaN(value)) { return alert("Invalid format."); }
	} catch(e) {return alert(e); }

	chooseCount = value;
	generateAmount(chooseCount);
	prepareSelect($('input[type="checkbox"]').length);
});

$('#selected')[0].value = "[1, 44, 45, 49, 50, 53, 54, 78, 79]";
$('#amount')[0].value = chooseCount;

generateAmount(chooseCount);
const queryString = "?"+window.location.href.split("#").pop();
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id');

if ((id != null) && !isNaN(id) && (Number(id)-1 > 0) && (Number(id) <= signs.length)) {
    current = Number(id-1);
    prepareSelect($('input[type="checkbox"]').length);
} else {
    $('#previous').click();
}

//preload all images
(async () => {
    var img = document.createElement('img');
    var counter = 0;

    img.onload = function() {
        counter += 1;
        if (counter >= signs.length) {
            img.remove();
        } else {
            img.src = signs[counter].image;
        }
    }

    img.src = signs[counter].image;
})();