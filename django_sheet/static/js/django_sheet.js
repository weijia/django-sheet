var serverJson = {"max_row": 20, "max_col": 5, data:[{"row":1, "col":1, "value": "good"}]}


function getEmptyElemInArray(n){
    var res = [];
    for(var index=0; index<n; ++index){
        res[index] = "";
    }
    return res;
}


function getMaxCol(dataArray){
    //var maxRow = 0;
    var maxCol = 0;
    for(var index=0; index<dataArray.length; ++index){
        if(dataArray[index]["cell_column"]>maxCol) maxCol=dataArray[index]["cell_column"];
    }
    return maxCol;
}
function getMaxRow(dataArray){
    var maxRow = 0;
    //var maxCol = 0;
    for(var index=0; index<dataArray.length; ++index){
        if(dataArray[index]["cell_row"]>maxRow) maxRow=dataArray[index]["cell_row"];
    }
    return maxRow;
}

function generateTableArray(json){
    var tableData = [];

    var dataArray = json["objects"];

    var maxRow = getMaxRow(dataArray)+1;//json["max_row"];
    var maxCol = getMaxCol(dataArray)+1;//json["max_col"];


    for(var row=0; row<maxRow; ++row){
        tableData[row] = getEmptyElemInArray(maxCol);
    }

    for(var index=0; index<dataArray.length; ++index){
        var data = dataArray[index];
        var row = data["cell_row"];
        var col = data["cell_column"];
        var value_obj = data["cell_value"];
        tableData[row][col] = value_obj["value"];
    }
    return tableData;
}


function loadJson(json){
    var dataArray = json["objects"];
    var tableData = generateTableArray(json);
    var maxRow = getMaxRow(dataArray)+1;//json["max_row"];
    var maxCol = getMaxCol(dataArray)+1;//json["max_col"];
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

