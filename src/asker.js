/* asker will add a multiple choice question to the container it is called on.
 * When the user submits their answer, the result is sent to the server.
 * Users can then see the current results, which are continuously updated. 
 * 
 */

(function( $ ) {
    $.fn.asker = function(options) {
        
        var submit = null;
        var container = null;
        var resultscnt = null;
        var submitmsg = null;
        var timer = null;
        
        // This is the easiest way to have default options.
        options = $.extend({
            // These are the defaults.
            id: "", //must be unique
            question: "What is the answer?",
            answers: ["a","b","c","d"],
            extra: [], //additional information to provide for each answer
            server: "http://server",
            charter: null, //function that draws chart given data
        }, options );
        
        var updateCnt = function(ret) { //totals return value 
            var total = 0;
            for(var i = 0; i < options.answers.length; i++) {
                if(ret[i]) total += ret[i];
            }
            resultscnt.text(total+" Answers");
        };
        
        //poll server for number of responses
        var getResultsCnt = function() {
            $.get(options.server, {id: options.id})
                .done(function(ret) {
                  updateCnt(ret);
                  timer = setTimeout(getResultsCnt, 1000); //poll
                })
                .fail(function() {
                    resultscnt.text("X Answers");
                });
        };
        
        var getAndShowResults = function() {
            clearTimeout(timer);
            $.get(options.server, {id: options.id})
            .done(function(ret) {
               container.empty();
               var c = $('<canvas>').appendTo(container).addClass('asker-canvas');
               var labels = [];
               var data = [];
               for(var i = 0; i < options.answers.length; i++) {
                   labels.push(options.answers[i]);
                   var cnt = ret[i] ? ret[i] : 0;
                   data.push(cnt);
               }
    
               options.charter(c,labels, data);
            })
            .fail(function() {
                submitmsg.text("Server Error.");
            });
        };
        
        //submit answer and lock it in
        var submitAnswer = function() {
            var ans = $('input[name=answer]:checked', container).val();
            $.get(options.server, {id: options.id, ans: ans})
                .done(function(ret) {
                    updateCnt(ret);
                    submitmsg.empty();
                    var viewbutton = $('<input type="button" value="View Results">')
                        .appendTo(submitmsg)
                        .addClass('asker-viewbutton')
                        .click(getAndShowResults);
                    submit.prop('disabled', true);
                })
                .fail(function() {
                    submitmsg.text("Server Error.");
                });
        };
        
        //create graph
        
        //create question/answer
        container = $('<div>').appendTo(this).addClass('asker-container');
        container.css('position','relative');
        var q = $('<div>').addClass('asker-question').html(options.question);
        q.appendTo(container);
        var answers = $('<form>').appendTo(container).addClass('asker-answers');
        
        var enableSubmit = function() {
            submit.prop('disabled', false);
        };
        
        for(var i = 0; i < options.answers.length; i++) {
            var ansbox = $('<div>').appendTo(answers).addClass('asker-answer');
            var a = $('<input type="radio" name="answer" value="'+ i + '">').appendTo(ansbox).addClass('asker-radio');
            a.click(enableSubmit);
            $('<span>').appendTo(ansbox).html(options.answers[i]).addClass('asker-answer-text');
            if(options.extra[i]) {
                $('<div>').appendTo(ansbox).addClass('asker-extra').html(options.extra[i]);
            }
        }
        
        //setup submit button
        submit = $('<input type="button" value="Submit" disabled>').appendTo(container).addClass('asker-submit');
        submit.click(submitAnswer);
        
        //setup response counter
        resultscnt = $('<div>').appendTo(container).addClass('asker-resultscnt').text('0 Answers');
        getResultsCnt(resultscnt);
        resultscnt.click(function(e) {
            if (e.shiftKey || e.metaKey) {        //shift click should show results
                getAndShowResults();
            }
        });
        
        //view results link (empty until answer is submitted)
        submitmsg = $('<div>').appendTo(container).addClass('asker-msg');
        
        return this;
 
    };
 
}( jQuery ));
