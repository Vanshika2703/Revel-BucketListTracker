// document.querySelectorAll(".card").forEach(card => card);

document.querySelector("#listPage").onclick = (event) => {
    if(revel.page == revel.pages.EXPANDED_LIST && !event.switchingToExpanded && !document.querySelector("#expandedList").contains(event.target)){
        event.switchingToMain = true;
        revel.page = revel.pages.MAIN;
        // revel.fbListPageController.updateList();
        revel.showMainPageContents();
    }
};

revel.showMainPageContents = function() {
    switch(revel.page) {
        case revel.pages.MAIN:
            document.querySelector("#listContainer").classList.remove("hidden");
            document.querySelector("#expandedList").classList.add("hidden");
            break;
        case revel.pages.EXPANDED_LIST:
            revel.imageBuffer = [""];
            revel.resetExpandedList();
            document.querySelector("#listContainer").classList.add("hidden");
            document.querySelector("#expandedList").classList.remove("hidden");
            break;
    }
};

revel.resetExpandedList = function() {
    document.querySelector("#expandedList").replaceChild(_createEmptyExpandedList(), document.querySelector("#expandedList .card-body"));
    document.querySelector("#addItem").addEventListener("click",(event)=>{
        console.log("clicked add item");
        document.querySelector("#itemsBox").appendChild(_createInputItem());
        console.log("new list item entry place added");
    });
    document.querySelector("#deleteButton").addEventListener("click",(event)=>{
        console.log("delete button clicked");
        const blId = revel.storage.getbucketListId();
        if(blId == 0){
            alert("this list can't be deleted")
            blId = 1;
        }else{
            revel.fbBucketListManager.delete(blId);
        }
        revel.page = revel.pages.MAIN;
        revel.showMainPageContents();
    });
    document.querySelector("#back").addEventListener("click",(event)=>{
        const blId = revel.storage.getbucketListId();
        const title = document.querySelector("#inputTitle").value;
        const items = [];
        document.querySelectorAll("#itemsBox div.row.checkbox .input").forEach(item => {
            items.push({Description: item.value, id: item.id});				
        });
        // document.querySelectorAll("#checkedItemsBox div.row.checkbox .input").forEach(item => {
        //     items.push({Description: item.value, id: item.id});				
        // });
        console.log('items :>> ', items);
        if(blId==0){
            console.log('blId :>> ', blId);
            if(title!=""){
            console.log(`title: ${title}, item: ${items}`)
            revel.fbBucketListManager.addList(title,items);
            revel.page = revel.pages.MAIN;
            revel.showMainPageContents();
            }
            else if(items.length!=0 && title=="" && items[0]!="") {
                console.log('items.length :>> ', items.length);
                console.log('items :>> ', items);
                alert("please fill in the title before you save")
            }
            else {
                revel.page = revel.pages.MAIN;
                revel.showMainPageContents();
            }
        }
        else {
            console.log("existing");
            revel.fbBucketListManager.update(blId,title,items);
            revel.page = revel.pages.MAIN;
            revel.showMainPageContents();
        }
    });

    function _createEmptyExpandedList() {
        return htmlToElement(`<div class="card-body">
            <button id="back" type="button" class="btn btn-dark">
            <i class="material-icons justify-content-left">done</i>
            </button>
            <button type="button" class="close" aria-label="Close" data-toggle="modal" data-target="#confirmDeleteModal">
            <i class="material-icons justify-content-right">delete</i>
            </button>
            <input class="input card-title" id="inputTitle" placeholder="ENTER TITLE">
            <div id="itemsBox" class="checkbox col list-items">
            </div>
            <button id="addItem" type="button" class="btn">
                <i class="material-icons">add</i>
            </button>
            <hr>
            <div id="checkedItemsBox" class="checkbox col list-items">
            </div>
        </div>
        `)
    }
	
	function _createInputItem(){
		return htmlToElement(`<div class="row checkbox"> 
			<label> 
				<input type="checkbox" class="item">
				<span class="checkbox-decorator"><span class="check"></span></span> 
				<input class="input" placeholder="ENTER BUCKET LIST ITEM"> 
			</label> 
		</div>`);
	}
}

function openAttachment() {
    document.getElementById('attachment').click();
  }
  
function fileSelected(input){
    // alert(input.files[0]);
    revel.imageBuffer = input.files[0];
}

function pictureTaken(file){
    // alert(input.files[0]);
    revel.imageBuffer = file;
}

function doalert(checkboxElem) {
    if (checkboxElem.checked) {
        if(document.querySelector("#expandedList").contains(checkboxElem)){
            console.log("In expanded List");
            $("#addContentModal").modal()
            document.querySelector("#uncheck").onclick = (event)=>{
                checkboxElem.checked = false;
            }
            document.querySelector("#saveInfo").onclick = (event)=>{
                checkboxElem.disabled = true;
                if(!revel.inputBuffer[getIDFromCheckbox(checkboxElem).id]) revel.inputBuffer[getIDFromCheckbox(checkboxElem).id] = {};
                revel.inputBuffer[getIDFromCheckbox(checkboxElem).id][revel.FB_KEY_ISCHECKED] = true;
                revel.inputBuffer[getIDFromCheckbox(checkboxElem).id][revel.FB_KEY_JOURNAL] = document.querySelector("#journalInput").value;
                revel.inputBuffer[getIDFromCheckbox(checkboxElem).id][revel.FB_KEY_PICTURE] = {
                    name: Math.random().toString(36).substr(2, 9) + "." + revel.imageBuffer.name,
                    file: revel.imageBuffer};
                // $.get(document.querySelector("#attachment").value, function(data) {
                //     alert(data);
                // });

                console.log("inputBuffer: ", revel.inputBuffer);
            }
        }else{
            checkboxElem.disabled = true;
        }  
    }
}

function getIDFromCheckbox(checkboxElem){
    return checkboxElem.nextElementSibling.nextElementSibling;
}

revel.showMainPageContents();