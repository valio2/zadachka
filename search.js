var functions = (function () {
    var getAllWords = () => {
        var allWords;
        $.ajax({
            type: 'GET',
            url: 'words.json',
            data: "{}",
            dataType: "json",
            async: false,
            success: function (data) {
                allWords = data.words;
            },
        })
        return allWords;
    }

    var findMatches = (allWords) => {
        var expression = $('.form-control').val().trim();
        var matchedWords = allWords.map((word) => {
            if (word.indexOf(expression) >= 0) {
                return word;
            }
            return null;
        }).filter((word) => word !== null);
        return matchedWords;
    }

    var sortAsc = (arr) => {
        return arr.sort((a, b) => a < b);
    }

    var sortDesc = (arr) => {
        return arr.sort((a, b) => a > b);
    }
    var getMatchingWords = () => {
        var words = getAllWords()
        var wordsToPrint = findMatches(words);
        if ($('#reverse-order-checkbox').prop('checked')) {
            wordsToPrint = wordsToPrint.reverse();
        }
        if ($('#long-words-checkbox').prop('checked')) {
            wordsToPrint = wordsToPrint
                .filter((word) => word.length <= 6);
        }
        return wordsToPrint;
    }

    var displayPages = (len) => {
        console.log('I was here');
        $('.text-muted').html(len);
        var prevBtn = $('.page-item.previous');
        var nextBtn = $('.page-item.next');
        var temp = '';
        for (var i = 1; i <= Math.ceil(len / 20); i += 1) {
            temp += `<li class="page-item">
					<a class="page-link">${i}</a>
				</li>`
        }
        $('ul.pagination').html(temp);
        $('ul.pagination').prepend(prevBtn);
        $('ul.pagination').append(nextBtn);
        $('li.page-item:first').next().toggleClass('active');
    }

    var displayWords = (wordsArr, page) => {
        wordsArr = wordsArr
            .slice((page - 1) * 20, page * 20)
            .map((word) => {
                return `<li>${word}</li>`;
            }).join('');
        $('.words').html(wordsArr);
    }

    return {
        displayPages,
        displayWords,
        getMatchingWords
    }
})();

$('#reverse-order-checkbox').on('change', function () {
    var page = $('.active .page-link').html();
    if (page) {
        var wordsToPrint = functions.getMatchingWords();
        functions.displayWords(wordsToPrint, page);
    } else {
        var words = $('.words li');
        $('.words').html('');
        words = Object.values(words)
            .slice(0, words.length)
            .reverse()
            .forEach((word) => $('.words').append(word));
    }
});

$('#long-words-checkbox').on('change', function () {
    $('#search-button').click();

});


$('#search-button').on('click', function () {
    if ($('.form-control').val().trim().length > 0) {
        var wordsToPrint = functions.getMatchingWords();

        functions.displayPages(wordsToPrint.length);
        functions.displayWords(wordsToPrint, 1);
    }
});

$('nav').on('click', 'a.page-link', function () {
    event.stopPropagation();
    var wordsToPrint = functions.getMatchingWords();

    if (!isNaN($(this).html())) {
        $('.active').toggleClass('active');
        $(this).parent().toggleClass('active');
        var page = $(this).html();
        functions.displayWords(wordsToPrint, page);
    } else {
        if ($(this).parent().hasClass('previous')) {
            const prev = $('.active').prev();
            if (!isNaN(prev.children(':first').html())) {
                $('.active').toggleClass('active');
                prev.toggleClass('active');
                var page = prev.children(':first').html();
                functions.displayWords(wordsToPrint, page);
            }
        } else {
            const next = $('.active').next();
            if (!isNaN(next.children(':first').html())) {
                $('.active').toggleClass('active');
                next.toggleClass('active');
            }
        }
    }
});