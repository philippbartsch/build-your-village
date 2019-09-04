if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', init, true);
else if (document.attachEvent)
      document.attachEvent("on"+evnt, init);

function init(){ 

    var tiles = document.getElementsByClassName('tiles');
    var grid = document.getElementById('grid_container');
    
    grid.addEventListener('mouseover', mouseOverGrid, true);
    grid.addEventListener('mouseout', mouseOutOfGrid, true);

    function mouseOverTile(ev) {
        ev = ev || window.event;
        document.body.style.cursor = 'move';
    }

    function mouseOutOfTile(ev) {
        ev = ev || window.event;
        document.body.style.cursor = 'default';
    }

    function  mouseOutOfGrid(ev) {
        ev = ev || window.event;
        smallTiles(tiles);
    }

    function mouseOverGrid(ev) {
        ev = ev || window.event;
        // smallTiles(tiles);
        hideTiles(tiles);
    }

    var zIndexInterim = 0;
    var interimsObj;
    var dragObj;
    var idCount = 100;

    function allowDrop(ev) {//alert('foo');
        ev.preventDefault();
        
        if (ev.target.id != 'repo') {
            ev.target.classList.remove('bg_img');
            ev.target.classList.add('bg_img_hl');
        }
    }

    function noDrop(ev) {
    	ev.preventDefault();

        if (ev.target.id != 'repo') {
            ev.target.classList.remove('bg_img_hl');
            ev.target.classList.add('bg_img');
    	}

    }

    function drag(ev) { 
        // console.log('drag');
        ev.dataTransfer.setData("text", ev.target.id);
        // document.body.style.cursor = 'move';

        interimsObj = ev.target.parentElement;
        dragObj = ev.target;

        if (ev.target.parentElement.id != 'repo')
            ev.target.parentElement.classList.add('bg_img');

        hideTiles(tiles);
    }

    function drop(ev) {
        try {
            ev.preventDefault();

            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));

            // if(ev.target.id == 'main') {
            //     ev.target.removeChild(document.getElementById(data));
            // }


            // if (ev.target.id != 'trash') {
            //     var element = window.getComputedStyle(document.getElementById(ev.target.id));
            //     document.getElementById(ev.target.children[0].id).style.zIndex = element.getPropertyValue('z-index');
            //     removeEvents(ev.target);
            // }
            
            addEvents(interimsObj);
            
            ev.target.classList.remove('bg_img_hl');

            if (interimsObj.classList[0] == 'repo_item' && interimsObj.children.length < 1) {
                idCount++;
                
                var newObj = document.createElement('img');
                newObj.src = dragObj.src;
                newObj.className = 'tiles';
                newObj.id = dragObj.id.substr(0, 4) + idCount;
                newObj.draggable = 'true';
                newObj.addEventListener('dragstart', drag, true);
                newObj.addEventListener('dragleave', noDrop, true);
                newObj.addEventListener('mouseover', mouseOverTile, true);
                newObj.addEventListener('mouseout', mouseOutOfTile, true);
                
                interimsObj.appendChild(newObj)
            }

            if (scButton.disabled == true) { 
                scButton.disabled = false;
                scButton.classList.remove('disabled_btn');
                // scButton.style.backgroundColor = '#222';
                // scButton.style.color = '#777';
                scButton.style.opacity = '1';
            }

        } catch(err) {
            console.warn(err);
        }

        smallTiles(tiles);
    }

    function removeEvents(obj) {
        obj.removeEventListener('drop', drop, true);
        obj.removeEventListener('dragover', allowDrop, true);
        obj.removeEventListener('dragleave', noDrop, true);
    }

    function addEvents(obj) {
        obj.addEventListener('drop', drop, true);
        obj.addEventListener('dragover', allowDrop, true);
        obj.addEventListener('dragleave', noDrop, true);
    }

    function smallTiles(t) {
        for (var i = 0; i < t.length; i++) {

            if (t[i].parentElement.classList[0] != 'repo_item' && t[i].id != 'trash') {
                
                t[i].style.width = '128px';
                t[i].style.height = '150px';
                t[i].style.right = '32px';
                t[i].style.bottom = '60px';
            }
        }
    }

    function hideTiles(t) {
            for (var i = 0; i < t.length; i++) { 

            if (t[i].parentElement.classList[0] != 'repo_item' && t[i].id != 'trash') {
                
                t[i].style.width = '64px';
                t[i].style.height = '75px';
                t[i].style.right = '0px';
                t[i].style.bottom = '0px';
            }
        }
    }

    function allowDropMain(ev) {
        ev.preventDefault();
    }

    function dropMain(ev) {
        ev.preventDefault();

        if (ev.target.id != 'grid_container' 
            && ev.target.classList[0] != 'grid_row' 
            && ev.target.id != 'sc_select_container2'
            && ev.target.id != 'grasp2'
            && ev.target.id != 'sc_button'
            && ev.target.id != 'fieldset'
            && ev.target.classList[0] != 'fs_annotation'
            && ev.target.classList[0] != 'label'
            && ev.target.classList[0] != 'input'
            && interimsObj.classList[0] != 'repo_item'
            ) {
            var data = ev.dataTransfer.getData("text");
            ev.target.appendChild(document.getElementById(data));

            if(ev.target.id == 'main') {
                 ev.target.removeChild(document.getElementById(data));
            }
        }
    }

    function noDropMain(ev) {
        ev.preventDefault();
    }

    var side = document.querySelector("#side");
    var main = document.querySelector("#main");

    main.addEventListener('dragover', allowDropMain, true);
    main.addEventListener('drop', dropMain, true);
    main.addEventListener('dragleave', noDropMain, true);

    var grasp2 = document.querySelector("#grasp2");
    var trash = document.querySelector("#trash");
    var repo_wrapper = document.querySelector("#repo_wrapper");

    var allGrasps = document.getElementsByClassName("grasp");
    
    var showRep = function(selectGrasp) {
        if (selectGrasp.repo.style.display == "block") {
            //Hide
            side.style.marginLeft = "-150px";
            main.style.marginLeft = "0px";
            for (var i = 0; i < allGrasps.length; i++) {
                allGrasps[i].style["background-color"] = "#2a2a2a";
                allGrasps[i].repo.style.display = "none";
            }
        } else {
            //Show
            for (var i = 0; i < allGrasps.length; i++) {
                if (allGridItems[i] != selectGrasp) {
                    allGrasps[i].repo.style.display = "none";
                    allGrasps[i].style["background-color"] = "#2a2a2a";
                }
            }
            selectGrasp.repo.style.display = "block";
            selectGrasp.style["background-color"] = "#4a4a4a";
            side.style.marginLeft = "0px";
            main.style.marginLeft = "150px";
        }		
    };

    function intToString(number) {
        if (number <= 9)
            return '0' + number;
        else
            return '' + number;
    }
    
    function initRepo(repo, directory_name, img_count) {
        for (var i = 0; i < img_count; i++) {

            var repoItem = document.createElement('div');
            repoItem.className = 'repo_item';
            
            var tile = document.createElement('img');
            tile.src = 'img/' + directory_name + '/tile_' + intToString(i + 1) + '.png';
            tile.id = 'drag' + directory_name + (i + 1);
            tile.className = 'tiles';
            
            tile.draggable = true;

            repo.appendChild(repoItem);
            repoItem.appendChild(tile);
        }
    }

    for (var i = 0; i < allGrasps.length; i++) {
        var grasp = allGrasps[i];
        grasp.repo = document.createElement("div"); 
        grasp.repo.className = "repo";
        grasp.repo.style.display = "none";
        repo_wrapper.appendChild(grasp.repo);
        grasp.addEventListener("click", function(ev) { showRep(ev.currentTarget); }, false);
        initRepo(grasp.repo, grasp.attributes["directory_name"].value, parseInt(grasp.attributes["tile_count"].value));
    }    

    var lefttrigger = false;

    var width = window.innerWidth;
		
    grasp2.addEventListener("click", function() {

        if (sc_select_container2.style.marginTop == '0px')
            sc_select_container2.style.marginTop = "-50px";
        else
            sc_select_container2.style.marginTop = "0px";
 
    }, false);


    var allGridItems = [];

    function initGrid(grid) { //alert('foo');

        // var rowCount = 0;
        
        for (var i = 0; i < 7; i++) {

        var gridRow = document.createElement('div');
        
            gridRow.className = 'grid_row';
            gridRow.classList.add('row' + i);

            grid.appendChild(gridRow);               

            
            var oddColTrigger = false;

            for (var j = 0; j < 15; j++) {
                var gridItem = document.createElement('div');

                gridItem.className = 'grid_item bg_img';

                if (oddColTrigger == false) {
                    gridItem.classList.add('col1');
                    gridItem.classList.add('z' + (2 * i + 1));
                    oddColTrigger = true;
                } else {
                    gridItem.classList.add('col2');
                    gridItem.classList.add('z' + (2 * i + 2));
                    oddColTrigger = false;
                }
                
                // gridItem.id = 'drop1';   

                gridItem.addEventListener('dragover', allowDrop, true);
                gridItem.addEventListener('drop', drop, true);
                gridItem.addEventListener('dragleave', noDrop, true);

                gridRow.appendChild(gridItem);
                allGridItems.push(gridItem);
            }
        }

        var gridWidth = 15 * 64 - 4;
        var gridHeight = 7 * 75 + 50;
        grid.style.width = gridWidth + 'px';
        grid.style.height = gridHeight + 'px';
    }

    initGrid(grid);

    var scCon = document.getElementById('sc_container');
    var scButton = document.getElementById('sc_button');
    scButton.classList.add('disabled_btn');
    scButton.disabled = true;

    scButton.addEventListener('click', function(){

        var note = document.getElementById('note');
        var cb_size_1 = document.getElementById('1x');
        var cb_white_bg = document.getElementById('white_bg');
        var cb_blue_bg = document.getElementById('blue_bg');
        var sc_width, sc_height, x_offset, y_offset, bg_color;
        
        if (cb_size_1.checked == false) {
            grid.style.transform = 'scale(1.5, 1.5)';
            sc_width = 1600;
            sc_height = 900;
            x_offset = -72;
            y_offset = -110;
        }

        if (cb_white_bg.checked == true)
            bg_color = '#ffffff';
        else if (cb_blue_bg.checked == true)
            bg_color = '#87c6d6';
        else
            bg_color = '#111'

        for (var i = 0; i < allGridItems.length; i++) { 
            allGridItems[i].classList.remove('bg_img');
        }

        // trash.style.display = 'none';
        note.style.display = 'none';
        grid.style.border = 'none';
        
        html2canvas(grid, {backgroundColor: bg_color, width: sc_width, height: sc_height, x: x_offset, y: y_offset, logging: false}).then(function(canvas) {
             scCon.style.display = 'block';
             scCon.appendChild(canvas);
        });
    
    }, false);

    document.getElementById('back_button').addEventListener('click', function(){
        
        scCon.style.display = 'none';
        scCon.removeChild(scCon.lastChild);
        grid.style.transform = 'scale(1, 1)';
        // trash.style.display = 'block';
        note.style.display = 'block';
        grid.style.border = '1px solid #222';

        for (var i = 0; i < allGridItems.length; i++) { 
            allGridItems[i].classList.add('bg_img');
        }

    }, false);
    
    for (var i = 0; i < tiles.length; i++) {
            tiles[i].addEventListener('mouseover', mouseOverTile, true);
            tiles[i].addEventListener('mouseout', mouseOutOfTile, true);
            tiles[i].addEventListener('dragstart', drag, true);
            tiles[i].addEventListener('dragleave', noDrop, true);
    }

};







