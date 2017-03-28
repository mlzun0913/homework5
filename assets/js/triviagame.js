var triviaQuestions = [{
	question: "Who palys Chewbacca?",
	answerList: ["Kenny Baker", "David Prowse", "Peter Mayhew", "Rick Baker"],
	answer: 2
},{
	question: "What is Count Dooku's Sith name?",
	answerList: ["Darth Tyranus", "Darth Rex", "Darth Sidious", "Darth Maul"],
	answer: 0
},{
	question: "What was Anakin Skywalker's mom's name?",
	answerList: ["Shmi", "Lakshmi", "Beru", "Smee"],
	answer: 0
},{
	question: "Who was the actor inside the C-3PO costume",
	answerList: ["Anthony Hopkins", "Keny Baker", "Jeff Daniels", "Anthony Daniels"],
	answer: 3
},{
	question: "Who was Obi-Wan Kenobi's master?",
	answerList: ["Darth Vader", "Yoda", "Kui-Gon-Ginn", "Han Solo"],
	answer: 2
},{
	question: "Who was Anakin Skywalker's wife?",
	answerList: ["Padame Amidala", "Princess Leia", "Rey", "Beru Lars"],
	answer: 0

}];
var search = ['darth+vader', 'bugs+life', 'toy+story+andy', 'brave+bear', 'wall-e+plant', 'inside+out+emotions', 'the+incredibles+nemesis', 'finding+nemo', 'lightning+mcqueen', 'up+russell', 'the+good+dinosaur', 'monsters+university', 'toy+story+woody','bing+bong','ratatouille'];
var currentQuestion; var correctAnswer; var incorrectAnswer; var unanswered; var seconds; var time; var answered; var userSelect;
var messages = {
	correct: "Yes, that's right!",
	incorrect: "No, that's not it.",
	endTime: "Out of time!",
	finished: "Alright! Let's see how well you did."
}

$('#startBtn').on('click', function(){
	$(this).hide();
	newGame();
});

$('#startOverBtn').on('click', function(){
	$(this).hide();
	newGame();
});

function newGame(){
	$('#finalMessage').empty();
	$('#correctAnswers').empty();
	$('#incorrectAnswers').empty();
	$('#unanswered').empty();
	currentQuestion = 0;
	correctAnswer = 0;
	incorrectAnswer = 0;
	unanswered = 0;
	newQuestion();
}

function newQuestion(){
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();
	answered = true;
	
	//sets up new questions & answerList
	$('#currentQuestion').html('Question #'+(currentQuestion+1)+'/'+triviaQuestions.length);
	$('.question').html('<h2>' + triviaQuestions[currentQuestion].question + '</h2>');
	for(var i = 0; i < 4; i++){
		var choices = $('<div>');
		choices.text(triviaQuestions[currentQuestion].answerList[i]);
		choices.attr({'data-index': i });
		choices.addClass('thisChoice');
		$('.answerList').append(choices);
	}
	countdown();
	//clicking an answer will pause the time and setup answerPage
	$('.thisChoice').on('click',function(){
		userSelect = $(this).data('index');
		clearInterval(time);
		answerPage();
	});
}

function countdown(){
	seconds = 15;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	answered = true;
	//sets timer to go down
	time = setInterval(showCountdown, 1000);
}

function showCountdown(){
	seconds--;
	$('#timeLeft').html('<h3>Time Remaining: ' + seconds + '</h3>');
	if(seconds < 1){
		clearInterval(time);
		answered = false;
		answerPage();
	}
}

function answerPage(){
	$('#currentQuestion').empty();
	$('.thisChoice').empty(); //Clears question page
	$('.question').empty();

	var rightAnswerText = triviaQuestions[currentQuestion].answerList[triviaQuestions[currentQuestion].answer];
	var rightAnswerIndex = triviaQuestions[currentQuestion].answer;
	//giphy api
	var giphyURL = "http://api.giphy.com/v1/gifs/search?q=star+wars" + search[currentQuestion] + "&limit=1&rating=g&api_key=dc6zaTOxFJmzC"
	$.ajax({url: giphyURL, method: 'GET'}).done(function(giphy){
		var currentGif = giphy.data;
		$.each(currentGif, function(index,value){
		var embedGif = value.images.original.url;
		newGif = $('<img>');
		newGif.attr('src', embedGif);
		newGif.addClass('gifImg');
		$('#gif').html(newGif);
		});
	});
	//checks to see correct, incorrect, or unanswered
	if((userSelect == rightAnswerIndex) && (answered == true)){
		correctAnswer++;
		$('#message').html(messages.correct);
	} else if((userSelect != rightAnswerIndex) && (answered == true)){
		incorrectAnswer++;
		$('#message').html(messages.incorrect);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
	} else{
		unanswered++;
		$('#message').html(messages.endTime);
		$('#correctedAnswer').html('The correct answer was: ' + rightAnswerText);
		answered = true;
	}
	
	if(currentQuestion == (triviaQuestions.length-1)){
		setTimeout(scoreboard, 5000)
	} else{
		currentQuestion++;
		setTimeout(newQuestion, 5000);
	}	
}

function scoreboard(){
	$('#timeLeft').empty();
	$('#message').empty();
	$('#correctedAnswer').empty();
	$('#gif').empty();

	$('#finalMessage').html(messages.finished);
	$('#correctAnswers').html("Correct Answers: " + correctAnswer);
	$('#incorrectAnswers').html("Incorrect Answers: " + incorrectAnswer);
	$('#unanswered').html("Unanswered: " + unanswered);
	$('#startOverBtn').addClass('reset');
	$('#startOverBtn').show();
	$('#startOverBtn').html('Start Over?');
}