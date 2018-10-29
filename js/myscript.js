$(document).ready(function () {
    songurlarray = [];

    var $ = window.jQuery;

    $(window.document)
        .on('click','#playmusic',playmusic)
        .on('click','.select_song',select_song)
        .on('click','#reset',reloaddata)
        .on('click', '#pausemusic', pausemusic);
      
      

    $('#update').on('click', updatepls);
    // $('#pausemusic').on('click',fu_niro);

    function pausemusic () {
        audio.pause();
        $("#playmusic").show();
        $("#pausemusic").hide();

    }
    function playmusic(){
        audio.play();
        $("#playmusic").hide();
        $("#pausemusic").show();
    }
    function select_song(){
        var songsrc = event.target.getAttribute('src');
         songcounter = event.target.getAttribute('data-songcounter');
        var playthisong=songurlarray[songcounter];
        console.log(songcounter);
        audio.pause();
        $(audio).attr("src", playthisong);
        audio.play();
    }
        
    
    $("#edit").click(function (e) {
        e.preventDefault();
        var imgregex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(imgregex);
        var urlimg = $("#editplsurl").val();
        var nameinput = $("#editplsname").val();
        if (urlimg.match(regex) && nameinput!=""){
            $("#editpls").hide();
            $("#editsongs").show()
            $("#edit").hide();
            $("#update").show();
            $("#editplsurl").css("border", "none");

        }else{
            e.preventDefault();
            $("#editplsurl").css("border", "solid");
            $("#editplsurl").css("border-color", "red");
        }      
     });
    
     $("#plsurl").change(function () {
        var value = $("#plsurl").val();
        $("#modalimg").attr("src", value);
    });
    
    $('#save').on('click', _on_click_save_playlist);

    $("#addnewpls").click(function () {
        $("#addpls").show()
        $("#next").show()
        $("#form2").hide();
        $("#save").hide();

    });
    
// -----------------Delete Playlist--------------------------
    $(".deletepls").click(function () {
        id = $(".deletepls").attr("id");
        console.log(id);
        $.ajax({
            url: `http://localhost:8080/apiproject/api/playlist.php?type=playlist&id=${id}`,
            type: 'DELETE',
            success: function (result) {
                // console.log("hey");
                $('#removemodal').appendTo("body").modal('hide');
                reloaddata();
            }
        });
    });

    

   
// ------FIRST CHECK THE INPUTS ADD PLS MODAL---------
    $("#next").click(function (e) {
        e.preventDefault();
        var imgregex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/g;
        var regex = new RegExp(imgregex);
        var urlimg = $("#plsurl").val();
        var nameinput = $("#plsname").val();
        if (urlimg.match(regex) && nameinput!="") {
            $("#addpls").hide();
            $("#form2").show();
            $("#next").hide();
            $("#save").show();
            $("#plsurl").css("border", "none");
        } else {
            $("#plsurl").css("border", "solid");
            $("#plsurl").css("border-color", "red");
        }


    });
    // ---------ADD MORE SONG ROW IN MODAL--------
    $(".more_song").click(function () {
        var songinput = `
        <div class="one_song">
        <label for="plsname">Song Name:</label>
        <input class="single_song_name" type="text"  placeholder="name" name="plsname">
          <label for="plsurl">Song URL:</label>
          <input type="text" class="single_song_url" placeholder="URL" name="songurl">
        </div>
        `;
        $(songinput).appendTo("#addnewsongs");
    })

    // ------------------MAIN AJAX CALL---------------
    $.ajax({
        url: "http://localhost:8080/apiproject/api/playlist.php?type=playlist",
        success: function (result) {
            // loadallplaylists(result);
            // console.log(result);
            loaddata(result);
        }
    });

////-------------------------------------------/* <END OF DOCUMENT READY> *------------------------------------------------/
});

// --------------------SAVE NEW PLAYLIST FUNCTION------------------
function _on_click_save_playlist() {
    var playlist_image = $('#plsurl').val(),
        playlist_name = $('#plsname').val(),
        all_songs = $('.one_song'),
        songs_array = [];


    all_songs.each(create_songs_object);


    function create_songs_object() {
        var $this = $(this),
            name = $this.find('.single_song_name').val(),
            url = $this.find('.single_song_url').val(),
            song_object = {
                name: name,
                url: url
            };

        songs_array.push(song_object);
    }

    var playlist_object = {
        name: playlist_name,
        image: playlist_image,
        songs: songs_array
    }

    var options = {
        url: 'http://localhost:8080/apiproject/api/playlist.php?type=playlist',
        type: 'POST',
        data: playlist_object,
        dataType: 'json'
    };

    $.ajax(options).always(after_save_success);

    function after_save_success(data) {
        // console.log(data.data.id);
        $('#addplaylist').appendTo("body").modal('hide');
        reloaddata();
        resetvalues()
    }

    return false;
   

    
}
//------------------ DELETE PLAYLIST----------------------------
function removepls(id) {
    $('#removemodal').appendTo("body").modal('show');
    $(`.deletepls`).attr("id" , id);

}

// -------------------MAKE PLAYER FUNC------------
function playpls(songs, img , id) {
    console.log(songs);


    player = "";
    player += `
        <div id="player">
        <img class="mainimgs imginplayer" src="${img}">
        <div id="playerbtns">
        <button id="pausemusic" class="glyphicon glyphicon-pause"></button>
        <button id="playmusic"class="glyphicon glyphicon-play"></button>
        <div id="audioplr">
        <audio controls id="audioplayer" onended="playnextsong()" onplay="spinmage()" onpause="stopspinimage()"></audio>
        </div>
        </div>
        <div id="songslist">
        <ul>
        </ul>
        </div>
        <div id="edit_delete_player">
        <button id="editbtnplayer" class="glyphicon glyphicon-pencil" onclick="editpls(${id})"></button>
        <button id="deletebtnplayer"class="glyphicon glyphicon-remove"onclick="removepls(${id})"></button>
        
        </div>
       
        </div>
        `
    $("#mainplayer").html(player);
    audio = $(`#audioplayer`)[0];
    songurlarray = [];
    songcounter=0;
    for (let i = 0; i < songs.length; i++) {
        console.log("this is hi +" + i);
        console.log(songcounter);
        songname = songs[i].name;
        songurl = songs[i].url;
        songurlarray.push(songs[i].url);
        $("#songslist").append(`<li><a href="#" class="select_song" data-songcounter="${songcounter}"  src="${songurl}">${songname}</a></li>`);
        songcounter++;
    }
    console.log(songurlarray);

    songcounter=0;
    $(audio).attr("src", songurlarray[songcounter]);
    audio.play();
    $("#playmusic").hide();
    $("#pausemusic").show();
}


function spinmage(){ 
    $(".imginplayer").attr("id","spinimage");
}

function stopspinimage(){ 
    $(".imginplayer").attr("id","");
}
function playnextsong(){ 
    songcounter++;
    if (songcounter < songurlarray.length) {
        $(audio).attr("src", songurlarray[songcounter]);
        audio.play();
        $("#playmusic").hide();
        $("#pausemusic").show();
} else {
        songcounter = 0;
        $(audio).attr("src", songurlarray[songcounter]);
        audio.play();
        $("#playmusic").hide();
        $("#pausemusic").show();
}


    console.log(songurlarray);
    console.log(songcounter);
    $(audio).attr("src", songurlarray[songcounter]);
    audio.play();
   
    
    


}



// ----------------------EDIT PLAY LIST FUNCTION----------
function editpls(id) {
    $('#editplaylist').appendTo("body").modal('show');
    $("#editpls").show();
    $("#edit").show();
     $(".more_song").hide();
    $("#update").hide();
    $("#editsongs").hide()
    $("#edit").attr("id_to_edit",id)

// ------------ first ajax call
        $.ajax({
            url: `http://localhost:8080/apiproject/api/playlist.php?type=playlist&id=${id}`,
            success: function (result) {
                console.log(result);
                var name = result.data.name;
                var image = result.data.image;
            $("#editplsurl").val(image);
            $("#editplsname").val(name);
            }
        });
// ----------seocend ajax call
$.ajax({
    url: `http://localhost:8080/apiproject/api/playlist.php?type=songs&id=${id}`,
    success: function (songs) {
         songhtml="";
        songs = songs.data.songs;
        for (let i = 0; i < songs.length; i++) {
            songname = songs[i].name;
            songurl = songs[i].url;
             songhtml =`
             <div class="edit_one_song">
            <label for="plsname">Song Name:</label>
            <input value="${songname}"class="single_song_name_edit" type="text"  placeholder="name" name="plsname">
            <label for="plsurl">Song URL:</label>
            <input value="${songurl}" type="text" class="single_song_url_edit" placeholder="URL" name="songurl">
            </div>  
             `;
            $("#editsongs").append(songhtml);
        }
    }});
}


// -------------------SONGS AJAX CALL-----------------------
function getsongslist(id) {

    var playlist_element = $('#playlist_' + id),
        img_src = playlist_element.find('img').attr('src');
    console.log(img_src);

    $.ajax({
        url: `http://localhost:8080/apiproject/api/playlist.php?type=songs&id=${id}`,
        success: function (songs) {
            songs = songs.data.songs;
console.log(songs);
            playpls(songs, img_src , id);
        }
    });

}

// -----------<RELOAD DATA FUNCTION>----------------
function reloaddata(){

    $.ajax({
        url: "http://localhost:8080/apiproject/api/playlist.php?type=playlist",
        success: function (result) {
            loaddata(result);
        }
    });
}

 //    -----------------MAIN PAGE DATA ----------------
 function loaddata(result) {

    console.log(result);

    var main = "";
    for (let i = 0; i < result.data.length; i++) {
        data = result.data[i];
        img = data.image;
        console.log(img);
        plsname = data.name;
        id = data.id;
        main += `
        <div id="playlist_${id}" class="${plsname} plsclass col-lg-3 col-md-4 col-sm-6">
        <p class="roundtext" >${plsname}</p>
        <img class= "mainimgs" src="${img}"alt="${id}">
        <div class="plsbtns">
        <div class="edit_delete_btns">
        <button class="glyphicon glyphicon-pencil editplsbtn" onclick="editpls(${id})"></button>
        <button class="glyphicon glyphicon-remove" onclick="removepls(${id})"></button>
        </div>
        <button class="glyphicon glyphicon-play playplsbtn" image="${img}" onclick="getsongslist(${id})"></button>
        
        </div>
        </div>`;
        $("#mainpls").html(main);


    }

    for (var i = 0; i < $('.roundtext').length; i++) {
        const circleType = new CircleType($('.roundtext')[i]);
        circleType.radius(90);
    }
}


function search(){ 
    var searchvalue = $("#searchinput").val();
    console.log(searchvalue);
    var playlisttoshow = [$(`.mainplaylistsshow`).find(`.${searchvalue}`)];
    console.log(playlisttoshow);



    if (playlisttoshow.length >= 1) {
            for (let index = 0; index < playlisttoshow.length; index++) {
                    const showimg = playlisttoshow[index];
                    $(showimg).siblings().hide();
                    $(showimg).show();
            }
    } else {
            $(playlisttoshow).siblings().hide();
            $(playlisttoshow).show();
    }

    
}    

function updatepls(){
   image =  $("#editplsurl").val();
   name =  $("#editplsname").val();
   id = $("#edit").attr("id_to_edit");

   plsdata = {
        name: name,
        image: image,
};



$.ajax({
    type: 'POST',
    url: `http://localhost:8080/apiproject/api/playlist.php?type=playlist&id=${id}`,
    data: plsdata,
    success: function (response) {}
});
   

   var all_songs = $('.edit_one_song'),
        songs_array = [];


    all_songs.each(create_songs_object);


    function create_songs_object() {
        var $this = $(this),
            name = $this.find('.single_song_name_edit').val(),
            url = $this.find('.single_song_url_edit').val(),
            song_object = {
                name: name,
                url: url
            };

        songs_array.push(song_object);
    }
    // console.log('all_songs');
    // console.log(songs_array);


    var plsdatasongs =  {
        songs: songs_array
    }
    console.log(plsdatasongs);
    var options = {
        url: 'http://localhost:8080/apiproject/api/playlist.php?type=songs&id=' + id,
        type: 'POST',
        data: plsdatasongs,
        dataType: 'json'
    };

    $.ajax(options).always(update_success);

    function update_success(x) {
console.log(x);

return false;
    }

}
function resetvalues(){

$('#plsname').val("");
$('#plsurl').val("");
$('.single_song_name').val("");
$('.single_song_url').val("");
$('#modalimg').attr("src" , "http://shec-labs.com/wp-content/themes/creativemag/images/default.png");


}