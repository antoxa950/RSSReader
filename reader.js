function getRSS() {
    $(document).ready(function () {
        var channelsList = document.getElementById("channelsList");
        var selectedChannel = "";
        for (var i = 0; i < channelsList.length; i++) {
            if (channelsList[i].selected) {
                selectedChannel = channelsList[i].value;
                break;
            }
        }
        $('#channelMessages').rssfeed(selectedChannel, {
            content: false,
            linkcontent: true,
            limit: 10,
            sort: 'date',
            sortasc: false
        }, function (e, authorsCount) {
            var messages = $('li.rssRow', document.getElementById("channelMessages"));
            document.getElementById("channelInfo").innerHTML = "Authors: " + authorsCount + " Messages: " + messages.length;
            for (var i in messages) {
                messages[i].setAttribute("onclick", "showContent(this); return false;");
            }
        });
    });
}

function showContent(e) {
    var channelsList = document.getElementById("channelsList");
    var selectedChannel = "";
    for (var i = 0; i < channelsList.length; i++) {
        if (channelsList[i].selected) {
            selectedChannel = channelsList[i].value;
            break;
        }
    }
    $('#messageContent').rssfeed(selectedChannel, {
        header: true,
        content: true,
        limit: 100,
        snippet: false,
        linktarget: '_blank',
        checkTitle: $('[name=ref]', e)[0].text,
        checkDate: $('[name=date]', e)[0].innerHTML
    }, function (e) {
        var element = $('[name=content]', e)[0];
        var words = [];
        for (var i = 0; i < element.innerHTML.length; i++) {
            if (words[element.innerHTML[i].toLowerCase()]) {
                words[element.innerHTML[i].toLowerCase()] += 1;
            } else {
                words[element.innerHTML[i].toLowerCase()] = 1;
            }
        }
        function isValid(symbol) {
            var re = /[!-@\[-`\{-~\s—…]/;
            return !re.test(symbol);
        }

        var diagramValues = [];
        var len = element.innerHTML.length;
        for (var i in words) {
            if (isValid(i)) {
                diagramValues.push({indexLabel: i, y: (words[i] * 100 / len).toFixed(1), label: i});
            }

        }
        document.chart.options.data[0].dataPoints = diagramValues;
        document.chart.render();
    });
}

function addRSSFeed() {
    function addOption(oListbox, text, value, isDefaultSelected, isSelected) {
        var oOption = document.createElement("option");
        oOption.appendChild(document.createTextNode(text));
        oOption.setAttribute("value", value);

        if (isDefaultSelected) oOption.defaultSelected = true;
        else if (isSelected) oOption.selected = true;

        oListbox.appendChild(oOption);
    }

    var new_address = document.getElementById("addressInput");
    var select = document.getElementById("channelsList");
    addOption(select, new_address.value, new_address.value);
    new_address.value = "";
    var addressAdd = document.getElementById("addressAdd");
    addressAdd.disabled = true;
}

function checkAddressInput() {
    var new_address = document.getElementById("addressInput");
    var addressAdd = document.getElementById("addressAdd");
    if (new_address.value === "" && !addressAdd.disabled) {
        addressAdd.disabled = true;
    } else {
        addressAdd.disabled = false;
    }
}

function removeChannel(e){
    var channelsList = document.getElementById("channelsList");
    var selectedChannel = "";
    for (var i = 0; i < channelsList.length; i++) {
        if (channelsList[i].selected) {
            selectedChannel = channelsList[i];
            break;
        }
    }
    selectedChannel.remove();
    channelsList[0].selected = true;
    getRSS();
}