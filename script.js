//
//TODO: Множество Парето
//

var numOfFactors;       //Числов критериев
var numOfAlternatives;  //Число альтернатив
var numOfOptions = 4;   //Число настроек критериев (мин, макс, вес, б/м)

var data_matrix = [];               //Матрица данных
var factor_settings_matrix = [];    //Матрица настроек критериев

var factor_weight_array = [];           //Массив весов критериев
var factor_weight_sum = 0;              //Сумма весов критериев
var norm_factor_weight_array = [];      //Массив норированных весов критериев
var norm_data_matrix = [];              //Матрица нормированных данных
var global = {};                        //Массив глобальных критериев альтернатив
var max_global = 0;                     //Наибольший глобальный критерий
var max_global_index = 0;               //Индекс альтернативы с наибольшим глобальным критерием

function addPanel() {
    numOfAlternatives = document.getElementById("numOfAlternatives").value;
    numOfFactors = document.getElementById("numOfFactors").value;

    let data_table = document.createElement("table");
    let body = document.body;
    
    data_table.style.width = "100px";
    data_table.id = "data_table";

    //Генерация таблицы данных
    let tr_data_table = data_table.insertRow();
    for (let j = 0; j - 1 < numOfAlternatives; j++) {
        if (j === 0) {
            const td = tr_data_table.insertCell();
        } else {
            const td = tr_data_table.insertCell();
            td.innerHTML += `A${j}`;
            td.id = `col_head_${j}`;
            td.setAttribute("value", `A${j}`);
        }
    }
    
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

    //Генерация таблицы настройки критериев
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
    let body = document.body;
    let data_table = document.getElementById("data_table");
    let factor_table = document.getElementById("factor_table");

    //Добаывление данных из таблицы в матрицу данных
    for (let i = 1; i < data_table.rows.length; i++) {
        let temp_array = [];
        for (let j = 1; j < data_table.rows[i].cells.length; j++) {
            temp_array.push(parseFloat(document.getElementById("data_inp_" + i + "_" + j).value));
            //console.log("[" + i + "][" + j + "]")
        }
        data_matrix.push(temp_array);
    }

    //Добавление настроек критериев из таблицы в массив настроек критериев
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
    
    //Добавление весов в массив весов критериев 
    for (let i = 0; i < factor_settings_matrix.length; i++) {
        factor_weight_array.push(factor_settings_matrix[i][2]);
    }

    //Вычисление суммы весов критериев
    for (let i = 0; i < factor_weight_array.length; i++) {
        factor_weight_sum += factor_weight_array[i];
    }

    //Добавление нормированных весов в массив нормированных весов критериев
    for (let i = 0; i < factor_weight_array.length; i++) {
        norm_factor_weight_array.push(factor_weight_array[i]/factor_weight_sum);
    }
    
    //Нормированная матрица данных
    for (let i = 0; i < data_matrix.length; i++) {
        let temp_array = [];
        if (factor_settings_matrix[i][3] === 'less') {
            for (let j = 0; j < data_matrix[i].length; j++) {
                temp_array.push((factor_settings_matrix[i][1] - data_matrix[i][j]) / factor_settings_matrix[i][4]);
            }
            norm_data_matrix.push(temp_array);
        } else if (factor_settings_matrix[i][3] === 'more') {
            for (let j = 0; j < data_matrix[i].length; j++) {
                temp_array.push((data_matrix[i][j] - factor_settings_matrix[i][0]) / factor_settings_matrix[i][4]);
            }
            norm_data_matrix.push(temp_array);
        } 
    }
    
    //Вычисление глобальных критериев
    for (let j = 0; j < norm_data_matrix[0].length; j++) {
        let sum = 0;
        let v = document.getElementById(`col_head_${j + 1}`).getAttribute("value");
        
        var col = norm_data_matrix.map(
            function(value, index) { return value[j] }
        );

        for (let i = 0; i < norm_data_matrix.length; i++) {
            sum += norm_factor_weight_array[i] * col[i];
        }
        console.log(`A${j + 1}: ${sum}`);
        global[v] = sum;
    }

    //Ранжировка альтернатив
    var global_sorted = Object.keys(global).map(function(key) {
        return [key, global[key]];
    });
    
    global_sorted.sort(function(first, second) {
        return second[1] - first[1];
    });

    max_global_index = global_sorted[Object.keys(global_sorted)[0]][0];
    max_global = global_sorted[Object.keys(global_sorted)[0]][1];

    //Вывод ранжировки альтернатив
    body.innerHTML += "<p>"
    for (let i = 0; i < global_sorted.length; i++) {
        if (i === global_sorted.length - 1) {
            body.innerHTML += global_sorted[Object.keys(global_sorted)[i]][0];
        } else {
            body.innerHTML += global_sorted[Object.keys(global_sorted)[i]][0] + " > ";
        }
    }
    body.innerHTML += "</p>";

    body.innerHTML += `
        <p>Лучший вариант: <b>${max_global_index}</b> с глобальным критерием ${max_global}</p>
        <button id="clear" onclick='document.location.reload(true)'>Заново</button>
    `;
} 
