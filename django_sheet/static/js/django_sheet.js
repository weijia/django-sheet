var serverJson = {"max_row": 20, "max_col": 5, data:[{"row":1, "col":1, "value": "good"}]}


function getEmptyElemInArray(n){
    var res = [];
    for(var index=0; index<n; ++index){
        res[index] = "";
    }
    return res;
}


function getMaxCol(dataArray){
    var maxRow = 0;
    var maxCol = 0;
    for(var index=0; index<dataArray.length; ++index){
        if(dataArray[index][")
    }
}


function loadJson(json){
    var tableData = [];
    var maxRow = json["max_row"];
    var maxCol = json["max_col"];
    for(var row=0; row<maxRow; ++row){
        tableData[row] = getEmptyElemInArray(maxCol);
    }
    var dataArray = json["data"];
    for(var index=0; index<dataArray.length; ++index){
        var data = dataArray[index];
        tableData[data["row"]][data["col"]] = data["value"];
    }
    var tableStr = "";
    for(var rowIndex=0; rowIndex<maxRow; ++rowIndex){
        tableStr +="<tr>";
        for(var colIndex=0; colIndex<maxCol; ++colIndex){
            tableStr += "<td>"+tableData[rowIndex][colIndex]+"</td>";
        }
        tableStr +="</tr>";
    }
    return tableStr;
}

