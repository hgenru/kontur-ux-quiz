

function AppViewModel() {
    this.currentPage = ko.observable(0);

    this.goGo = function(page) {
        var self = this;
        return function() {
            self.currentPage(page);
        };
    };

    this.nextPage = function() {
        var currentPage = this.currentPage();
        this.currentPage(++currentPage);
    };

    this.level3Next = function() {
        var questions = [
            'Вы уверены в своем решении?',
            'Вы уверены в своей жизненной позиции?',
            'Вы уверены, что оно того стоит?',
            'Вы уверены в своей ориентации?',
            'Да ладно вам, вы серьёзно?',
            'Ну ладно'
        ];
        for (var i = 0; i < questions.length; i++) {
            answer = confirm(questions[i]);
            if (!answer) {
                alert('И ради этого был проделан такой путь!? Заново!');
                location.reload();
                break;
            }
        }
        this.nextPage();
    }

    this.level4 = {
        field1: ko.observable().extend({required: {message: 'это поле нам нужно'}}).extend({minLength: 2, maxLength: 10}),
        field2: ko.observable().extend({required: {message: 'и это тоже'}}).extend({minLength: 2, maxLength: 10}),
        field3: ko.observable().extend({required: {message: 'и даже это'}}),
        field4: ko.observable().extend({required: {message: 'ну ты понял'}}).extend({min: 1, max: 100}),
        field5: ko.observable().extend({required: {message: 'без этого поля жизнь не мила'}}).extend({email: true}),
        field6: ko.observable().extend({required: {message: 'мог бы уже привыкнуть'}}).extend({validation :{
            validator: function (val) {
                return /(?=^[^\s]{6,128}$)((?=.*?\d)(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[^\w\d\s])(?=.*?[a-z])|(?=.*?[^\w\d\s])(?=.*?[A-Z])(?=.*?[a-z])|(?=.*?\d)(?=.*?[A-Z])(?=.*?[^\w\d\s]))^.*/.test('' + val + '');
            },
            message: 'Слишком простой пароль. Нам лучше знать! Догадайтесь какой пароль нам нужен!'
        }}),
        field7: ko.observable().extend({required: {message: 'пиши давай'}}).extend({minLength: 160})
    }

    this.level4Group = ko.validation.group(this.level4);

    this.level4Reset = function() {
        var self = this;
        Object.keys(self.level4).forEach(function(name) {
            if (ko.isWritableObservable(self.level4[name])) {
                self.level4[name](undefined);
            }
        });
        this.level4Group.showAllMessages(false);
    }

    this.level4FirstTry = true;

    this.level4Next = function() {
        var allFields = this.level4;
        var errors = this.level4Group();
        if (errors.length) {
            this.level4Group.showAllMessages(true);
        } else {
            if (this.level4FirstTry) {
                alert('При отправке данных на сервер произошла ошибка. Пожалуйста, попробуйте ещё раз!');
                this.level4Reset();
                this.level4FirstTry = false;
            } else {
                this.nextPage();
            }
        }
    };
}

window.m_site = new AppViewModel();

ko.validation.init({
    registerExtenders: true,
    messagesOnModified: true,
    insertMessages: true,
    parseInputAttributes: true,
    messageTemplate: null
}, true);

ko.applyBindings(m_site);
