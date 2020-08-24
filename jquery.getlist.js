getMyListData();
$('#DeltaPageStatusBar').css('display', 'none');

function getMyListData()
{
    var urls = window.location.pathname;  
    var myPageName = urls.substring(urls.lastIndexOf('/') + 1).split(".",1)[0];
    var method = "GetListItems";
    var webURL =  $().SPServices.SPGetCurrentSite() ;
    var list = "mylinks";
    var fieldsToRead = "<ViewFields>"+"<FieldRef Name='Category' />" +"</ViewFields>";
    var query = "<Query><Where><Contains><FieldRef Name='Page_x0020_Name' /><Value Type='Text'>" + myPageName + "</Value></Contains></Where></Query>";
    var result=[];
    var num=[];
    var cat=[];
    $().SPServices
    ({
        operation: method,
        async: false, 
        webURL: webURL,
        listName: list,
        CAMLViewFields: "<ViewFields Properties='True' />",
        CAMLQuery: query,
        completefunc: function (xData, Status)
        {
            $(xData.responseXML).SPFilterNode("z:row").each(function() 
            {
                var title = $(this).attr("ows_Title");
                var pgname = $(this).attr("ows_Page_x0020_Name");
                var category = $(this).attr("ows_Category");
                var tmp = $(this).attr("ows_URL").split(",",2);
                var url=tmp[0];
                var description=tmp[1];

                if(!num[category]) num[category]=0;
                if(!result[category]) result[category]=new Array();
                if(!cat[category]) cat[category]=category;
                
                result[category][num[category]]={'title':title, 'url':url, 'description':description};
                
                num[category]++;            
             });
            
            for(x in cat){

            	var str="<div class='Category' name="+x+"><h3>"+x+"</h3><ul>";

            	for(y in result[x]){

            		str+="<li>"+result[x][y].title+":  <a href='"+result[x][y].url+"'>" + result[x][y].description + "</a></li>";
            	}
            	str+="</ul></div>";
            	$("#result_div").append(str);
            }        
        }
    });
};
