$(document).ready(function () {
    vowels = "аеёиоуыэюя"
    continue_task = $("#continue_task")
    console.log(continue_task)
    if (continue_task.val() != undefined) {
        if (confirm("Хотите продолжить прошлое тестирование?")) {
            myjson = {}
            myjson.task = continue_task.attr('data-task')
            myjson.task_pos = continue_task.attr('data-task-pos')
            test_id = continue_task.attr('data-test-id')
            subtheme_id = continue_task.attr('data-subtheme-id')
            type_task = Number(continue_task.attr('data-type-task'))
            myjson.type_task = type_task
            if (type_task == 1) {
                myjson.answers = continue_task.attr('data-answers').split('|')
            }
            create_task(myjson)
        } else {
            open_tests()
        }
    } else {
        open_tests()
    }

    // get the real id of user
    fetch('/api/get-user-id')
        .then((response) => {
            return response.json();
        })
        .then((myjson) => {
            user_id = myjson.user_id;
        });

    function open_test(this_) {
        test_id = $(this_).attr('data-test-id')
        fetch('/api/get-test/' + test_id)
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                subthemes = myjson.test.subthemes
                parent = $('#parent')
                parent.empty()
                parent.append(`<input onclick="open_tests()" class="form-control btn btn-success btn_next back_button" type="submit" value="← Назад"><h1 class="h1_title">Подтемы тестов</h1><div class="tests_themes"></div>`)
                parent_div = $('.tests_themes')
                for (var i = 0; i < subthemes.length; i++) {
                    parent_div.append(`<h1 class="test_theme_and_subtheme" data-test-id="${myjson.test.id}" data-subtheme-id="${subthemes[i].id}" data-subtheme-description="${subthemes[i].description}" data-subtheme-title="${subthemes[i].title}" onclick="show_description(this)">${i + 1}. ${subthemes[i].title}</h1>`)
                }
            });
    }

    function show_description(this_) {
        parent = $('#parent')
        parent.empty()
        test_id = $(this_).attr('data-test-id')
        subtheme_id = $(this_).attr('data-subtheme-id')
        subtheme_description = $(this_).attr('data-subtheme-description')
        subtheme_title = $(this_).attr('data-subtheme-title')
        parent.append(`
            <input data-test-id="${test_id}" data-subtheme-id="${subtheme_id}" onclick="open_test(this)" class="form-control btn btn-success btn_next back_button" type="submit" value="← Назад">
            <h1 class="h1_title">${subtheme_title}</h1><h1 class="h1_title h1_description">Описание</h1>
            <div class="tests_themes description">
                <h3>${subtheme_description}</h3>
            </div>
            <br />
            <div class="tests_themes">
                <input data-test-id="${test_id}" data-subtheme-id="${subtheme_id}" onclick="start_testing(this)" class="form-control btn btn-success btn_next back_button" type="submit" value="Начать тестирование">
            </div>
        `)
    }

    function start_testing(this_) {
        test_id = $(this_).attr('data-test-id')
        subtheme_id = $(this_).attr('data-subtheme-id')
        fetch('/api/start-test/' + user_id + '/' + test_id + '/' + subtheme_id, {method: 'POST'})
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                task_description = myjson.description
                create_task(myjson)
            });
    }

    function check_right_answer(this_) {
        answer = $(this_).attr('data-symbol')

        fetch(`/api/next-task/${user_id}/${task_pos}/${answer}`, {method: 'POST'})
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                    if (myjson.status == 'right') {
                        create_task(myjson)
                    } else {
                        parent = $('#parent')
                        try {
                            $(".can_choose_task").removeAttr('onclick')
                            $(".can_choose_task").removeClass('can_choose_task')
                            document.getElementById('d' + answer).classList.add('wrong_answer')
                        } catch {

                        }
                        try {
                            $('.choose_answer').removeClass('choose_hover')
                            $('.choose_answer').removeAttr('onclick')
                            document.getElementById(answer).classList.add('back_wrong_answer')
                        } catch {

                        }
                        trup = myjson
                        parent.append(`<h2 class="task_description"><span class="wrong_answer">Неверно!</span> Правильный ответ: ${myjson.first}<span class="right_answer">${myjson.right_letter}</span>${myjson.second}</h2><div class="text-center"><input onclick="create_task(trup)" class="form-control btn btn-success btn_next" type="submit" value="Далее"></div>`)
                    }
                }
            );

    }


    function create_task(myjson) {
        parent = $('#parent')
        parent.empty()
        if (Object.keys(myjson).includes('success')) {
            parent.append(`
                <h2 class="task_description">Вы успешно завершили тест! Ваша эффективность равна: ${myjson.success}/${myjson.resolved} или же ${Math.round(myjson.success / myjson.resolved * 100)}%!</h2>
                <div class="text-center">
                    <input data-test-id="${test_id}" data-subtheme-id="${subtheme_id}" onclick="start_testing(this)" class="form-control btn btn-success btn_next task_again" type="submit" value="Заново ↺">
                    <br />
                    <input data-test-id="${test_id}" onclick="open_tests()" class="form-control btn btn-success btn_next" type="submit" value="Вернуться к темам">
                    <br />
                    <input data-test-id="${test_id}" onclick="open_test(this)" class="form-control btn btn-success btn_next" type="submit" value="Вернуться к подтемам">
                </div>
            `)
        } else {
            task_pos = Number(myjson.task_pos)
            task = myjson.task
            console.log(myjson)
            var flag = false
            if (myjson.type_task == 0) {
                parent.append(`<h3 class="task_description">Выберите нужную букву и нажмите на неё для выбора ответа.</h3><div class="task_div"></div>`)
                parent_div = $('.task_div')
                for (var i = 0; i < task.length; i++) {
                    if (task[i] === '(') {
                        flag = true
                    }
                    if (task[i] === ')') {
                        flag = false
                    }
                    if (vowels.includes(task[i]) && flag === false) {
                        parent_div.append(`<h2 class="task can_choose_task" id="d${i}" data-symbol='${i}' onclick="check_right_answer(this)">${task[i]}</h2>`)
                    } else {
                        parent_div.append(`<h2 class="task">${task[i]}</h2>`)
                    }
                }
            } else {
                parent.append(`<h3 class="task_description">Выберите ответ из списка и нажмите на него.</h3><h2 class="text-center">${task}</h2><div class="task_div"></div>`)
                parent_div = $('.task_div')
                answers = myjson.answers
                for (var i = 0; i < answers.length; i++) {
                    parent_div.append(`<span class="input-group-text new_post_tag_text choose_answer choose_hover" data-symbol="${answers[i]}" onclick="check_right_answer(this)" id="${answers[i]}">${answers[i]}</span>`)
                }
            }


        }

    }

    function open_tests() {
        fetch('/api/get-test/0')
            .then((response) => {
                return response.json();
            })
            .then((myjson) => {
                parent = $('#parent')
                parent.empty()
                parent.append(`<h1 class="h1_title">Темы тестов</h1><div class="tests_themes"></div>`)
                parent_div = $('.tests_themes')
                for (var i = 0; i < myjson.tests.length; i++) {
                    parent_div.append(`<h1 class="test_theme_and_subtheme" data-test-id="${myjson.tests[i].id}" onclick="open_test(this)">${i + 1}. ${myjson.tests[i].title}</h1>`)
                }
            });
    }

    window.open_test = open_test
    window.start_testing = start_testing
    window.check_right_answer = check_right_answer
    window.create_task = create_task
    window.open_tests = open_tests
    window.show_description = show_description
})

