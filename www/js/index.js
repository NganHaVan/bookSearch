// Todo: adjust media query for phone
        // Print obj
        // localStorage
$('#alert').hide();
console.log(localStorage);
let msn='';
    $('#searchForm').submit((e)=>{
        let search=$('#searchText').val();
        if (!search) {
            msn='Search input must not be blank';
            $('#alert').text(msn);
            $('#alert').addClass("red").show().delay(1000).fadeOut();
        }
        else{
            getBook(search);
        }
        e.preventDefault();
    });

    // Functions
function getBook(text){
    let api='https://www.googleapis.com/books/v1/volumes?q='+text+'&key=AIzaSyC7C-avXogbqnNrKa43LbWFUsGgjD5c4ZU';
    $.ajax({
        url:api,
        success:(res)=>{
            // console.log(res.items);
            let output='';
            let items=res.items;
            $.each(items,(index,item)=>{
                // console.log(item.selfLink);
                output+=`
                    <div class="myGrid">
                            <div class="myGridItem">   
                            <img src='`+item.volumeInfo.imageLinks.thumbnail+`' alt='thumbnail' />
                            <h4>`+item.volumeInfo.title+`</h4>
                            <a onclick="getDetail('${item.selfLink}')" href="#detail" class="ui-btn ui-btn-b ui-btn-inline">Details</a>
                            
                        </div>
                    </div>
                `;
            });
            $('#bookOutput').html(output)
            $('#searchText').val('');
            
        },
        error:(err)=>alert(err)
    });
};
function getDetail(api){
    // console.log(api);
    $.ajax({
        url:api,
        dataType:'json',
        type:"GET",
        success:(res)=>{
            let result='';
            // console.log(res);
            result=`
                <div class="myDetail">
                    <div class="btnHolder myDetailItem">
                        <img src="${res.volumeInfo.imageLinks.small}" alt="image" />
                    </div>
                    <div class="myDetailItem justify">
                        <h4><b>Title:</b> ${res.volumeInfo.title}</h4>
                        <p><b>Author(s):</b> ${res.volumeInfo.authors.join(",")}</p>
                        <p><b>Genre:</b>${res.volumeInfo.categories}</p>
                        <p><b>Publisher: </b>${res.volumeInfo.publisher}</p>
                        <p><b>Published Date:</b>${res.volumeInfo.publishedDate}</p>
                        <p><b>Description: </b>${res.volumeInfo.description}</p>
                        <p><b>Total page: </b>${res.volumeInfo.pageCount}</p>
                        <p><b>Rating:</b>${res.volumeInfo.averageRating}/5</p>
                        <p><b>Mature: </b>${res.volumeInfo.maturityRating}</p>
                        <p><b>Price: </b>${$.map(res.saleInfo.retailPrice,(p)=>{return p}).join(" ")}</p>
                        <a class="ui-btn ui-btn-inline ui-icon-plus" href="#myLib" onclick="bookSelected('${api}')">Add</a>
                    </div>
                </div>
            `;
            $('#detailOutput').html(result);
        },
        error:(err)=> alert(err)
    });
    getLib();
};

let counter=0;

function bookSelected(api){
    alert("Book selected");
    localStorage.setItem(counter,api);
    counter++;
    getLib();
};
    
function getLib(){
    let libResult='';
    if (localStorage.length==0) {
        msn='Your library is empty';
        $("#info").text(msn);
        $("#info").addClass("white").show();
        $("#libResult").html('');
    }
    else{
        $("#info").hide();
    }
    $.each(localStorage,(index,value)=>{
        console.log(index+": "+value);
        $.ajax({
            url:value,
            dataType:'json',
            type:"GET",
            success:(res)=>{
                // console.log(value);
                // console.log(res);
                libResult+=`
                <div class="myGrid">
                    <div class="myGridItem">   
                    <img src='`+res.volumeInfo.imageLinks.smallThumbnail+`' alt='thumbnail' />
                    <h4>`+res.volumeInfo.title+`</h4>
                    <a onclick="getDetail('${res.selfLink}')" href="#detail" class="ui-btn ui-btn-b ui-btn-inline">Details</a>
                    <a onClick="deleteItem('${index}')" class="ui-btn ui-btn-a ui-btn-inline" href="#myLib">Delete</a>
                    </div>
                </div>
                `;
                console.log(libResult+'says hello');
                $('#libResult').html(libResult);
            },
            err:(err)=>{
                alert(err);
            }
        });
        // console.log(libResult+'says hello');
    });
        
        // console.log(libResult+'says hello');
};
function clearStorage(){
    localStorage.clear();
};
function deleteItem(index){
    localStorage.removeItem(index);
    // location.reload();
    getLib();
};
$("#clearStorage").click(()=>{
    clearStorage();
});



