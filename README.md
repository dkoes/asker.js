# asker.js
A simple jquery plugin for asking a question and recording the answer.

A cgi script must run on the server that interfaces with a database (see example/asker.cgi and example/asker.sql).

Usage:
```
	$('#question').asker({
	    id: "test",
	    question: "What do you think?",
		answers: ["Not much","Pi", "Foosball"],
		extra: ["Really. My mind is a total blank", "3.14159 Go Pi!", "A sport for champions"],
		server: "asker.cgi",
		charter: chartmaker})
	```
