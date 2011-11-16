$(function() {
	sessionStorage.setItem('success', 'no');
});

$("#main_screen").live('pageinit', function() {

    if(!html5sql.database){
	
        html5sql.openDatabase("com.myapp.appdb", "App Data", 5*1024*1024);
		
		$.get('setup.sql',function(sqlStatements){
			html5sql.process(
				sqlStatements,
				function(){

				},
				function(error, statement){
					console.error("Error: " + error.message + " when processing " + statement);
				}
			);
		});
		
    }
    
	html5sql.logInfo = true;
	html5sql.logErrors = true;
	html5sql.putSelectResultsInArray = true;

});


$('#main_screen').live('pageshow', function(event, ui) {
	
		if (sessionStorage.getItem('success') == 'yes' ) {
			alert('Person added sucessfully');
			sessionStorage.setItem('success', 'no');
		}

});

$("#new_person").live('pageinit', function() {

	$("form").submit(function(event) {
	
		event.stopPropagation();
		event.preventDefault();

		var first_name = $('#first_name').val();
		var last_name = $('#last_name').val();
		var age = $('#age').val();
		var money = $('#money').val();


		html5sql.process(
			[
			   "INSERT INTO person (first_name, last_name, age, money) VALUES ('" + first_name + "','" + last_name + "','" + age + "','" + money + "')"
			],
			function(){
				
				// success flag using session storage
				// useful becuase index.html can display a nice message to use on success
				
				sessionStorage.setItem('success', 'yes');
				
				$.mobile.changePage("index.html");
				
			},
			function(error, statement){
				console.error("Error: " + error.message + " when processing " + statement);
			}        
		);

		return false;
		});
	
	
	
});


$("#saved_people").live('pageinit', function() {

	html5sql.putSelectResultsInArray = true;
	html5sql.process(
		[
		    "SELECT * FROM person"
		],
		function(transaction, results, rowArray) {
		
			var html = '';

			$.each(rowArray, function(index, value) { 
			
			  html += "<li><a href=\"index.html\"  class=\"ui-link-inherit\">" + value.first_name + " " + value.last_name + "</a></li>";
			  
			});
			
			html += '</ul>';
			
			$('#people_list').append(html);
			$('#people_list').listview('refresh');
			
		},
		function(error, statement){
			console.error("Error: " + error.message + " when processing " + statement);
		}        
	);

});
