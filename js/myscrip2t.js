(function(window) {

	var $ = window.jQuery,
		$doc = $(window.document);

	function _on_dom_ready() {
		$doc
			.on('click', '#addnewpls', _on_click_hide_first_step_show_sec_step)
            .on('submit', '#addplsform', _on_submit_save_playlist)
        
            function _on_click_hide_first_step_show_sec_step(){
                $(".addnewsongs").hide();
            }
        
            function _on_submit_save_playlist (e) {
                e.preventDefault();
                alert("x");
                $("#addpls").hide();
                $(".addnewsongs").show();
                
                        
            }
        
        
            // ------------------MAIN AJAX CALL---------------
            $.ajax({
                    url: "http://localhost:8080/apiproject/api/playlist.php?type=playlist",
                    success: function (result) {
                            // loadallplaylists(result);
                            // console.log(result);
                            loaddata(result);
                    }
            });
        
        //    -----------------MAIN PAGE DATA ----------------
            function loaddata(result){
                console.log(result);
                
                var main= "";
                for (let i = 0; i < result.data.length; i++){
                    data = result.data[i];
                    img = data.image;
                    console.log(img);
                    plsname = data.name;
                    id = data.id;
                    main +=`
                    <div class= " plsclass col-lg-3 col-md-4 col-sm-6">
                    <p class="roundtext" >${plsname}</p>
                    <img class= "mainimgs" src="${img}"alt="${id}">
                    <div class="plsbtns">
                    <button class="glyphicon glyphicon-pencil" onclick="editpls()"></button>
                    <button class="glyphicon glyphicon-play" image="${img}" onclick="getsongslist(${id})"></button>
                    <button class="glyphicon glyphicon-remove" onclick="removepls(${id})"></button>
                    </div>
                    </div>
                   
                    
                    `;
                    $("#mainpls").html(main);
                    
                
                }  
                
                for (var i = 0; i < $('.roundtext').length; i++) {
                    const circleType = new CircleType($('.roundtext')[i]);
                    circleType.radius(130);
                }
            } 

    }
    
    
//------------------ DELETE PLAYLIST----------------------------
function removepls(id){
    alert("remove");
    $.ajax({
        url: `http://localhost:8080/apiproject/api/playlist.php?type=playlist&id=${id}`,
        type: 'DELETE',
        success: function (result) {
                // loadallplaylists(result);
                console.log("hey");
                // loaddata(result);

        }
});

    }

    // -------------------MAKE PLAYER FUNC------------
    function playpls(songs){
    console.log(songs);
   
       
        player="";
        player +=`
        <div id="player">
        <img class= "mainimgs" src="http://ksassets.timeincuk.net/wp/uploads/sites/55/2017/09/2012ArcticMonkeys02DC011211-920x584.jpg">
        <div id="playerbtns">
        <button class="glyphicon glyphicon-pencil"></button>
        <button class="glyphicon glyphicon-play"></button>
        <button class="glyphicon glyphicon-remove"></button>
        <div id="audioplr">
        <audio controls>
    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/ogg">
    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg">
    Your browser does not support the audio element.
    </audio>
        </div>
        </div>
        <div id="songslist">
        <ul>
        </ul>
        </div>
       
        </div>
        `
        // alert("play");
         $("#mainplayer").html(player);
         for (let i = 0; i < songs.length; i++){
            songname=songs[i].name;
            songurl=songs[i].url;
            

            $("#songslist").append(`<li id="${i}" data-url="${songurl}">${songname}</li>`)
        }
        }

        function editpls(){
            alert("edit");
        
            }

// -------------------SONGS AJAX CALL-----------------------
            function getsongslist(id) {

                $.ajax({
                    url: `http://localhost:8080/apiproject/api/playlist.php?type=songs&id=${id}`,
                    success: function (songs) {
                            // loadallplaylists(result);
                            // console.log(songs);
                            songs=songs.data.songs;
                          
                            playpls(songs);
                    }
            });
            }

	$(_on_dom_ready);
})(window);
