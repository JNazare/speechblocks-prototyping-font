var vowel_regex = /((?!([^<>]*>))+[aeiouAEIOU])/ig;
var consonant_regex = /((?!([^<>]*>))+[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ])/ig;

var colorText = function(html){
	return html.replace(vowel_regex, '<span class="vowel">$1</span>').replace(consonant_regex, '<span class="consonant">$1</span>')
}

$('.sb-text').each(function () {
    $(this).html(
    	colorText($(this).text())
    );
});

var saveSelection, restoreSelection;

saveSelection = function(containerEl) {
    var range = window.getSelection().getRangeAt(0);
    var preSelectionRange = range.cloneRange();
    preSelectionRange.selectNodeContents(containerEl);
    preSelectionRange.setEnd(range.startContainer, range.startOffset);
    var start = preSelectionRange.toString().length;

    return {
        start: start,
        end: start + range.toString().length
    };
};

restoreSelection = function(containerEl, savedSel) {
    var charIndex = 0, range = document.createRange();
    range.setStart(containerEl, 0);
    range.collapse(true);
    var nodeStack = [containerEl], node, foundStart = false, stop = false;

    while (!stop && (node = nodeStack.pop())) {
        if (node.nodeType == 3) {
            var nextCharIndex = charIndex + node.length;
            if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                range.setStart(node, savedSel.start - charIndex);
                foundStart = true;
            }
            if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                range.setEnd(node, savedSel.end - charIndex);
                stop = true;
            }
            charIndex = nextCharIndex;
        } else {
            var i = node.childNodes.length;
            while (i--) {
                nodeStack.push(node.childNodes[i]);
            }
        }
    }

    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
}

document.getElementById("sb-editor").addEventListener("input", function() {
	var savedSel = saveSelection(this);
	var text = $(this).text();
	var colored = colorText(text);
	$(this).html(colored);
	restoreSelection(this, savedSel);
}, false);
