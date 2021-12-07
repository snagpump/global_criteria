//var settings = [];

var numOfFactors;
var numOfAlternatives;
var numOfOptions = 4;

var data_matrix = [];
let factor_settings_matrix = [];    //[[min, max, weight, direction, difference], [...]]

function addPanel() {
    numOfAlternatives = document.getElementById("numOfAlternatives").value;
    numOfFactors = document.getElementById("numOfFactors").value;

    let data_table = document.createElement("table");
    let body = document.body;
    
    data_table.style.width = "100px";

    data_table.id = "data_table";

    //Генерация заголовков первой строки
    let tr_data_table = data_table.insertRow();
    for (let j = 0; j - 1 < numOfAlternatives; j++) {
        if (j === 0) {
            const td = tr_data_table.insertCell();
        } else {
            const td = tr_data_table.insertCell();
            //td.innerHTML += `<td id="col_head_${j}" value="A${j}">А${j}</td>`; 
            td.innerHTML += `A${j}`;
            td.id = `col_head_${j}`;
            td.setAttribute("value", `A${j}`);
        }
    }
    
    //Генерация таблицы
    for (let i = 1; i - 1 < numOfFactors; i++) {
        const tr = data_table.insertRow();
        for (let j = 0; j - 1 < numOfAlternatives; j++) {
            if (i === numOfFactors && j === numOfAlternatives) {
                break;
            } else {
                if (j === 0) {
                    const td = tr.insertCell();
                    td.innerHTML += "К" + i;
                } else {
                    const td = tr.insertCell();
                    td.innerHTML += "<input type='text' id='data_inp_" + i + "_" + j + "'></input>";       
                }
            }
        }
    }
    body.appendChild(data_table);
    body.innerHTML += "<br>";

    ///Генерация таблицы настройки критериев
    const factor_table = document.createElement("table");
    factor_table.id = "factor_table";
    factor_table.style.border = "1px solid black";
    factor_table.innerHTML += `
        <tr border="1px solid black">
            <td class="first_td"></td>
            <td>Минимальный</td>
            <td>Максимальный</td>
            <td>Вес</td>
            <td>Больше-меньше</td>
        </tr>
    `;

    for (let i = 1; i - 1 < numOfFactors; i++) {
        const tr = factor_table.insertRow();
        for (let j = 0; j - 1 < numOfOptions; j++) {
            if (i === numOfFactors && j === numOfOptions) {
                break;
            } else {
                if (j === 0) {
                    const td = tr.insertCell();
                    td.innerHTML += "К" + i;
                } else if (j === 3) {
                    let td = tr.insertCell();
                    td.innerHTML += `
                        <select id="weight_sel_` + i + `">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    `;
                } else if (j === 4) {
                    let td = tr.insertCell();
                    td.innerHTML += `
                        <select id="more_less_sel_` + i + `">
                            <option value="less">Меньше -- лучше</option>
                            <option value="more">Больше -- лучше</option>
                        </select>
                    `;
                } else {
                    const td = tr.insertCell();
                    td.innerHTML += "<input type='text' id='inp_" + i + "_" + j + "'></input>";       
                }
            }
        }
        
    }
    body.appendChild(factor_table);

    body.innerHTML += `
        <br>
        <button id="btnCalculate" onclick="Calculation()">Расчёт</button>
        <br>
    `;
}

function Calculation() {

    //Подготовка
    let factor_weight_array = [];           //[settings_array[0][3], settings_array[1][3], ...]
    let factor_weight_sum = 0;              //[settings_array[0][3] + settings_array[1][3]...]
    let norm_factor_weight_array = [];      //[settings_array[0][3]/weight_sum, settings_array[1][3]/weight_sum, ...]
    let norm_data_matrix = [];
    let global = [];
    let max_global = 0;
    let max_global_index = 0;
    
    let body = document.body;
    let data_table = document.getElementById("data_table");
    let factor_table = document.getElementById("factor_table");

    //Добаывление данных в матрицу данных
    for (let i = 1; i < data_table.rows.length; i++) {
        let temp_array = [];
        for (let j = 1; j < data_table.rows[i].cells.length; j++) {
            temp_array.push(parseFloat(document.getElementById("data_inp_" + i + "_" + j).value));
            //console.log("[" + i + "][" + j + "]")
        }
        data_matrix.push(temp_array);
    }

    //Добавление настроек критериев в массив
    for (let i = 1; i < factor_table.rows.length; i++) {
        let temp_array = [];
        for (let j = 0; j < factor_table.rows[i].cells.length; j++) {
            switch (j) {
                case 1:
                case 2:
                    temp_array.push(parseInt(document.getElementById("inp_" + i + "_" + j).value, 10));
                    break;
                case 3:
                    temp_array.push(parseInt(document.getElementById("weight_sel_" + i).value, 10));
                    break;
                case 4:
                    temp_array.push(document.getElementById("more_less_sel_" + i).value);
                    break;     
            }
        }
        temp_array.push(temp_array[1] - temp_array[0]);
        factor_settings_matrix.push(temp_array);
    }
    //console.log(data_matrix);
    //console.log(factor_settings_matrix);
    
    for (let i = 0; i < factor_settings_matrix.length; i++) {
        factor_weight_array.push(factor_settings_matrix[i][2]);
    }
    //console.log(factor_weight_array)

    for (let i = 0; i < factor_weight_array.length; i++) {
        factor_weight_sum += factor_weight_array[i];
    }
    //console.log(factor_weight_sum);

    for (let i = 0; i < factor_weight_array.length; i++) {
        norm_factor_weight_array.push(factor_weight_array[i]/factor_weight_sum);
    }
    //console.log(norm_factor_weight_array);
    //
    
    //Нормированная матрица данных
    for (let i = 0; i < data_matrix.length; i++) {
        let temp_array = [];
        if (factor_settings_matrix[i][3] === 'less') {
            for (let j = 0; j < data_matrix[i].length; j++) {
                //console.log(`max - ${factor_settings_matrix[i][1]}; data - ${data_matrix[i][j]}; max-min ${factor_settings_matrix[i][4]}`);
                //console.log(parseFloat((factor_settings_matrix[i][1] - data_matrix[i][j]) / factor_settings_matrix[i][4]));
                temp_array.push((factor_settings_matrix[i][1] - data_matrix[i][j]) / factor_settings_matrix[i][4]);
            }
            norm_data_matrix.push(temp_array);
        } else if (factor_settings_matrix[i][3] === 'more') {
            for (let j = 0; j < data_matrix[i].length; j++) {
                //console.log(`data - ${data_matrix[i][j]}; min - ${factor_settings_matrix[i][0]}; max-min ${factor_settings_matrix[i][4]}`);
                //console.log(parseFloat((data_matrix[i][j] - factor_settings_matrix[i][0]) / factor_settings_matrix[i][4]));
                temp_array.push((data_matrix[i][j] - factor_settings_matrix[i][0]) / factor_settings_matrix[i][4]);
            }
            norm_data_matrix.push(temp_array);
        } 
    }
    console.log(norm_data_matrix);
    console.log(norm_factor_weight_array);

    //Вычисление глобальных критериев
    for (let j = 0; j < norm_data_matrix[0].length; j++) {
        let sum = 0;
        
        var col = norm_data_matrix.map(
            function(value, index) { return value[j] }
        );

        for (let i = 0; i < norm_data_matrix.length; i++) {
            console.log(`col:${j} row:${i}`);
            console.log(`${norm_factor_weight_array[i]} * ${col[i]}`);
            sum += norm_factor_weight_array[i] * col[i];
        }
        console.log(sum);
        global.push(sum);
    }
    console.log(global);

    max_global = Math.max(...global);
    console.log(max_global);
    max_global_index = global.indexOf(Math.max(...global)) + 1;
    console.log(max_global_index);

    body.innerHTML += `
        <br>
        <p>Лучший вариант: <b>${document.getElementById(`col_head_${max_global_index}`).getAttribute("value")}</b> с глобальным критерием ${max_global}</p>
        <br>
        <button id="clear" onclick='document.location.reload(true)'>Заново</button>
    `;
} 