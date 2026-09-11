$(document).ready(function () {
    vowels = "аеёиоуыэюя"
    open_your_tests()

    function open_your_tests() {
        parent = $('#parent')
        parent.append(`<a href="/main"><input class="form-control btn btn-success btn_next back_button" type="submit" value="← На главную"></a>
            <div class="create-thing">
                <h1 class="h1_title">Создать тему</h1>
                <div class="tests_themes d-inline-block">
                    <h3 class="d-inline-block">Название: </h3>
                    <input id="input_theme_title" type="text" class="d-inline-block m-left">
                    <br />
                    <input onclick="create_theme()" class="form-control btn btn-success btn_next d-inline-block m-left" type="submit" value="Создать">
                </div>
                
            </div>
            <div class="create-thing">
                <h1 class="h1_title">Создать подтему</h1>
                <div class="tests_themes d-inline-block">
                    <h3 class="d-inline-block">Название: </h3>
                    <input id="input_subtheme_title" type="text" class="d-inline-block m-left">
                    <br />
                    <h3 class="d-inline-block">Описание: </h3>
                    <input id="input_subtheme_description" type="text" class="d-inline-block m-left">
                    <br />
                    <h3 class="d-inline-block">Тема: </h3>
                    <select class="js-select2 m-left" id="select_themes">
                    </select>
                    <br />
                    <input onclick="create_subtheme()" class="form-control btn btn-success btn_next d-inline-block m-left" type="submit" value="Создать">
                </div>
            </div>
            <div class="create-thing">
                <h1 class="h1_title">Создать задачу</h1>
                <div class="tests_themes d-inline-block">
                    <h3 class="d-inline-block">Тема: </h3>
                    <select class="js-select21 m-left" id="select_themes2">
                    </select>
                    <br />
                    <h3 class="d-inline-block">Подтема: </h3>
                    <select class="js-select22 m-left" id="select_subthemes">
                        <option selected disabled></option>
                    </select>
                    <br /a>
                    <h3 class="d-inline-block">Тип задачи: </h3>
                    <select class="js-select2-type-task m-left">
                        <option selected disabled></option>
                        <option value="0">Выбор буквы</option>
                        <option value="1">Выбор вариантов ответа</option>
                    </select>
                    <div id="create_new_task">
                        
                    </div>
                    <br />
                    <input onclick="make_task()" class="form-control btn btn-success btn_next d-inline-block m-left" type="submit" value="Создать">
                </div>
            </div>
`)
        fetch('/api/get-test/0')
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                select_themes = $('#select_themes')
                select_themes2 = $('#select_themes2')
                select_themes.append(`<option selected disabled></option>`)
                select_themes2.append(`<option selected disabled></option>`)
                for (var i = 0; i < myjson.tests.length; i++) {
                    select_themes.append(`<option data-test-id="${myjson.tests[i].id}">${myjson.tests[i].title}</option>`)
                    select_themes2.append(`<option data-test-id="${myjson.tests[i].id}">${myjson.tests[i].title}</option>`)
                }
            });
    }

    function set_type_task(type_task) {
        selected = $(type_task).val()
        create_new_task = $("#create_new_task")
        create_new_task.empty()
        if (selected == "0") {
            right = -1
            create_new_task.append(`
                <h3 class="d-inline-block">Слово: </h3>
                <input id="input_new_task" type="text" class="d-inline-block m-left" onkeyup="view_task()">
                <br />
                <h3 class="d-inline-block">Выберите букву(верную): </h3><div id="choose_right_letter"></div>
            `)
        } else {
            right = -2
            create_new_task.append(`
                <h3 class=\"d-inline-block\">Слово(пропуск обощначьте '...'): </h3>
                <input id="input_new_task" type="text" class="d-inline-block m-left">
                <br />
                <h3 class=\"d-inline-block\">Вариант ответа: </h3>
                <input id="input_new_answer" type="text" class="d-inline-block m-left">
                <input onclick="add_answer($('#input_new_answer').val());$('#input_new_answer').val('')" class="form-control btn btn-success btn_next d-inline-block m-left" type="submit" value="Добавить">
                <div id="answer-list">
                    
                </div>
            `)
            answerList = $("#answer-list")
            queue_answers = []
            answerList.on('click', ".delete-link-tag", function () {
                $("#" + $(this).attr('data-id-tag')).remove()
                text = $(this).attr('data-id-tag').split("tag")[1]
                queue_answers.splice(queue_answers.indexOf(text), 1)

            })
            answerList.on('click', ".new_post_tag_right", function () {
                if (queue_answers.length >= 2) {
                    $("#text_tag" + queue_answers[0]).removeClass('new_post_tag_text_right')
                    document.getElementById("text_tag" + queue_answers[0]).classList.add('new_post_tag_text')
                }
                $("#text_" + $(this).attr('data-id-tag')).removeClass('new_post_tag_text')
                document.getElementById("text_" + $(this).attr('data-id-tag')).classList.add('new_post_tag_text_right')
                text = $(this).attr('data-id-tag').split("tag")[1]
                queue_answers.splice(0, 0, queue_answers.splice(queue_answers.indexOf(text), 1)[0]);
            })
        }
    }

    function view_task() {
        new_task = document.getElementById('input_new_task').value;
        parent_div = $('#choose_right_letter')
        parent_div.empty()
        for (var i = 0; i < new_task.length; i++) {
            if (vowels.includes(new_task[i])) {
                parent_div.append(`<h2 id="letter${i}" class="task can_choose_task" data-symbol='${i}' onclick="set_right_answer(this)">${new_task[i]}</h2>`)
            } else {
                parent_div.append(`<h2 class="task">${new_task[i]}</h2>`)
            }
        }
    }

    function set_right_answer(this_) {
        right = Number($(this_).attr('data-symbol'))
        view_task()
        letter = document.getElementById('letter' + String(right))
        letter.classList.add('can_choose_task_hover')
    }


    function set_subthemes(this_) {
        test_id = String($(this_).attr('data-test-id'))
        select_subthemes = $('#select_subthemes')
        select_subthemes.empty()
        select_subthemes.append(`<option selected disabled></option>`)
        fetch('/api/get-subthemes/' + test_id)
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                for (var i = 0; i < myjson.subthemes.length; i++) {
                    select_subthemes.append(`<option data-subtheme-id="${myjson.subthemes[i].id}" >${myjson.subthemes[i].title}</option>`)
                }
            });
    }

    function create_theme() {
        title = $('#input_theme_title').val()
        $('#input_theme_title').val('')
        fetch('/api/create-theme/' + encodeURIComponent(title), {method: 'POST'})
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                if (myjson.status == 200) {
                    $("#select_themes").append(`<option data-test-id="${myjson.Id}" >${title}</option>`)
                    $("#select_themes2").append(`<option data-test-id="${myjson.Id}" >${title}</option>`)
                    show_this("Тема успешно создана!", 'success')
                } else {
                    show_this("Ошибка!", 'wrong')
                }
            });
    }

    function create_subtheme() {
        test_id = $('#select_themes').find('option:selected').attr('data-test-id')
        title = $('#input_subtheme_title').val()
        description = $('#input_subtheme_description').val()
        $('#input_subtheme_title').val('')
        $('#input_subtheme_description').val('')
        fetch(`/api/create-subtheme/${test_id}/${encodeURIComponent(title)}/${encodeURIComponent(description)}`, {method: 'POST'})
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                if (myjson.status == 200) {
                    if (test_id == $('#select_themes2').find('option:selected').attr('data-test-id')) {
                        $("#select_subthemes").append(`<option>${title}</option>`)
                    }
                    show_this('Подтема успешно создана!', 'success')
                } else {
                    show_this('Ошибка!', 'wrong')
                }
            });
    }

    function make_task() {
        test_id = $('#select_themes').find('option:selected').attr('data-test-id')
        task = $('#input_new_task').val()
        $('#input_new_task').val('')
        subtheme_id = $('#select_subthemes').find('option:selected').attr('data-subtheme-id')
        type_task = $('.js-select2-type-task').val()
        if (type_task == 0) {
            $("#choose_right_letter").empty()
        }
        else {
            $("#answer-list").empty()
        }
        if (right == -2) {
            answers = queue_answers.join('|')
            fetch(`/api/create-task/${subtheme_id}/${encodeURIComponent(task)}/${type_task}/${encodeURIComponent(answers)}`, {method: 'POST'})
                .then((response) => {
                    return response.json();
                })
                .then((myjson) => {
                    if (myjson.status == 200) {
                        show_this("Задача успешно создана!", 'success')
                    } else {
                        show_this("Ошибка!", 'wrong')
                    }
                });
        } else {
            if (right != -1) {
                fetch(`/api/create-task/${subtheme_id}/${encodeURIComponent(task)}/${type_task}/${right}`, {method: 'POST'})
                    .then((response) => {
                        return response.json();
                    })
                    .then((myjson) => {
                        if (myjson.status == 200) {
                            show_this("Задача успешно создана!", 'success')
                        } else {
                            show_this("Ошибка!", 'wrong')
                        }
                    });
            }
        }
        queue_answers = []
    }


    function add_answer(text) {
        if (!queue_answers.includes(text)) {
            answerList.append(`
            <div class="input-group mb-3 new_post_tag" id="tag` + text + `">
            <span class="input-group-text new_post_tag_text" id="text_tag${text}">` + text + `</span>
            <span class="delete-link-tag new_post_tag_delete"
                  title="Delete" data-id-tag="tag` + text + `">X</span>
            <span class="new_post_tag_right"
                  title="Right" data-id-tag="tag` + text + `">V</span>
            </div>
            `)
            queue_answers.push(text)
        }
    }


    $(".js-select2").select2({})
    $(".js-select21").select2({})
    $(".js-select22").select2({})
    $(".js-select2-type-task").select2({})
    $('.js-select2').data('select2').$container.addClass('custom-select')
    $('.js-select21').data('select2').$container.addClass('custom-select')
    $('.js-select22').data('select2').$container.addClass('custom-select')
    $('.js-select2-type-task').data('select2').$container.addClass('custom-select')
    $('.js-select2-type-task').on("select2:select", function (e) {

        set_type_task($(this).find('option:selected'))
    });

    $('.js-select21').on("select2:select", function (e) {

        set_subthemes($(this).find('option:selected'))
    });

    window.view_task = view_task
    window.set_right_answer = set_right_answer
    window.make_task = make_task
    window.set_subthemes = set_subthemes
    window.create_theme = create_theme
    window.create_subtheme = create_subtheme
    window.add_answer = add_answer
})

function show_this(text, theme) {
    nots = $('#notifications')
    if (theme == 'success') {
        var this_ = $(`<div class="not">
        <span class="input-group-text new_post_tag_text not_text"><span class="not_title">Уведомление</span><br />${text}</span></div><br/>`)
    } else {
        var this_ = $(`<div class="not">
        <span class="input-group-text new_post_tag_text not_text_wrong"><span class="not_title">Уведомление</span><br />${text}</span></div><br/>`)
    }
    nots.append(this_)
    this_.fadeIn()
    setTimeout(delete_not, 2000)

    function delete_not() {
        this_.fadeOut('slow', function () {
            $(this).remove()
        })
    }
}
