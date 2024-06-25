let year_chart = document.querySelectorAll(".year canvas"),
    supply_chart = document.querySelectorAll(".supply canvas"),
    capacity_chart = document.querySelectorAll(".capacity canvas"),
    operating_chart = document.querySelectorAll(".operating canvas");

let red_cricle = new Image(),
    blue_cricle = new Image();
red_cricle.src = "../images/common/red_chart_circle.png";
blue_cricle.src = "../images/common/blue_chart_circle.png";


// ==================== Plugins ====================
const beforeDrawFunction = {
    beforeDraw: function (chart, args, options) {
        const ctx = chart.ctx;
        const canvas = chart.canvas;
        const chartArea = chart.chartArea;

        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(chartArea.left, chartArea.bottom,
            chartArea.right - chartArea.left, chartArea.top - chartArea.bottom);
    },
};
// ==================== Plugins ====================




// ==================== CHART01 ====================
function dataset01(label, data, borderColor, pointBackgroundColor, gradient) {
    let pointRadius = 4,
        pointImage = "";
    if (window.innerWidth <= 1024) {
        pointRadius = 3;
        if (window.innerWidth <= 767) {
            pointRadius = 2;
            if (window.innerWidth <= 450) {
                pointRadius = 1;
            }
        }
    }
    if (gradient == gradient_red) {
        pointImage = red_cricle;
    } else if (gradient == gradient_blue) {
        pointImage = blue_cricle;
    }
    return {
        label: label,
        data: data,
        borderColor: borderColor,
        pointBackgroundColor: pointBackgroundColor,
        pointStyle: pointImage,
        borderWidth: 1.5,
        fill: true,
        backgroundColor: gradient,
        pointRadius: pointRadius,
    }
}
function scales01(max, min, stepSize, unit, stacked) {
    return {
        x: {
            stacked: stacked,
            offset: true,
            backgroundColor: "#fff",
            grid: {
                color: 'transparent',
            },
            ticks: {
                color: '#707070',
                font: font_size,
                padding: 10,
            },
        },
        y: {
            stacked: stacked,
            offset: false,
            max: max,
            min: min,
            backgroundColor: "#fff",
            grid: {
                color: '#e0e0e0',
            },
            ticks: {
                stepSize: stepSize,
                color: '#707070',
                font: font_size,
                callback: function (context) {
                    return context + (unit == "" ? "" : unit) + ' ' + ' ' + ' ';
                },
            },

        },
    }
}
// ==================== CHART01 ====================




// ==================== 공통 ====================
function font_size() {
    let size = 16;
    if (window.innerWidth <= 1024) {
        size = 14;
        if (window.innerWidth <= 767) {
            size = 12;
            if (window.innerWidth <= 450) {
                size = 10;
            }
        }
    }
    return {
        size: size,
        family: 'ScoreDream',
        weight: '400',
    }
};
function tooltip(tooltipType, unit_value) {
    return {
        enabled: false,
        backgroundColor: "#fff",
        borderColor: "#707070",
        borderWidth: "0.5",
        displayColors: false,
        bodyColor: "#000",
        bodyFont: {
            size: 12,
            weight: 400,
            family: "ScoreDream",
        },
        callbacks: {
            title: function () {
                return null;
            },
            label: function (context) {
                if (tooltipType == "01") {
                    let t = Number(context.formattedValue);
                    return `${context.label}/${context.dataset.label}/${t.toFixed(2) % 1 != 0 ? t.toFixed(2) : t.toFixed(0)}${unit_value}`;
                } else if (tooltipType == "02") {
                    let t = context.formattedValue.replace(/,/g, "") / context.chart.getDatasetMeta(0).total * 100;
                    return `${context.label}/${context.formattedValue}/${t.toFixed(1)}%`;
                }
            }
        },
        external: function (context) {
            let tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                document.body.appendChild(tooltipEl);
            }
            const tooltipModel = context.tooltip;
            if (tooltipModel.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltipModel.yAlign) {
                tooltipEl.classList.add(tooltipModel.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
                return bodyItem.lines;
            }

            if (tooltipModel.body) {
                const bodyLines = tooltipModel.body.map(getBody);
                if (tooltipType == "01") {
                    let borderColor = this.labelColors[0].borderColor,
                        hoverBackgroundColor = this.dataPoints[0].dataset.hoverBackgroundColor,
                        strongColor = borderColor == "rgba(0,0,0,0.1)" ? hoverBackgroundColor : borderColor;
                    bodyLines.forEach(function (el, index) {
                        let el_text = el[0].split("/");
                        tooltipEl.innerHTML = `
                            <div class="normal">
                                <div>${el_text[0]}</div> 
                                <div>${el_text[1]}</div>
                            </div>
                            <strong style="color:${strongColor}">${el_text[2]}</strong>
                        `;
                    });
                } else if (tooltipType == "02") {
                    let hoverBackgroundColor = this.dataPoints[0].dataset.hoverBackgroundColor; //
                    let bg_color = hoverBackgroundColor[this.dataPoints[0].dataset.data.indexOf(bodyLines[0][0].split("/")[1].replace(/,/g, ""))];
                    bodyLines.forEach(function (el, index) {
                        let el_text = el[0].split("/");
                        if (el_text[2] == "NaN%") {
                            tooltipEl.innerHTML = `
                                <div class="normal">
                                    <div><div class="box" style="background-color: ${bg_color}"></div>${el_text[0]}</div> 
                                    <div>${el_text[1]}</div>
                                </div>
                            `;
                        } else {
                            tooltipEl.innerHTML = `
                                <div class="normal">
                                    <div><div class="box" style="background-color: ${bg_color}"></div>${el_text[0]}</div> 
                                    <div>${el_text[1]} (${el_text[2]})</div>
                                </div>
                            `;
                        }
                    });
                }
            }

            const position = context.chart.canvas.getBoundingClientRect();
            tooltipEl.style.opacity = 1;
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipEl.getBoundingClientRect().width / 2 + 'px';
            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 10 + 'px';
        },
    }
}
// ==================== 공통 ====================




if (document.querySelectorAll(".tabs a")) {
    document.querySelectorAll(".tabs a").forEach((el, index) => {
        el.addEventListener("click", function (e) {
            e.preventDefault();
            if (el.classList.contains("active")) return false;
            document.querySelector(".tabs a.active").classList.remove("active");
            document.querySelector(".chart-area .chart.active").classList.remove("active");

            el.classList.add("active");
            document.querySelectorAll(".chart-area .chart")[index].classList.add("active");
        })
    });
}

if (year_chart[0]) {
    let data01_element = document.querySelectorAll(".table01 tbody tr"),
        data02_element = document.querySelectorAll(".table02 tbody tr"),
        data03_element = document.querySelectorAll(".table03 tbody tr"),
        data04_element = document.querySelectorAll(".table04 tbody tr");

    let data_area01 = {
        label: [],
        data01: [],
        data02: [],
    }
    let data_area02 = {
        label: [],
        dataLabel: [],
        data01: [],
        data02: [],
        data03: [],
    }
    let data_area03 = {
        label: [],
        data01: [],
        data02: []
    }
    let data_area04 = {
        label: [],
        data01: [],
        data02: []
    }
    data01_element.forEach((el, index) => {
        data_area01.label.push(el.querySelectorAll("td")[0].textContent.replace(/,/g, "").trim());
        data_area01.data01.push(el.querySelectorAll("td")[1].textContent.replace(/,/g, "").trim());
        data_area01.data02.push(el.querySelectorAll("td")[2].textContent.replace(/,/g, "").trim())
    });
    data02_element.forEach((el, index) => {
        data_area02.label.push(el.querySelectorAll("td")[0].textContent);
        data_area02.data01.push(el.querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
        data_area02.data02.push(el.querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
        data_area02.data03.push(el.querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);
    });
    data03_element.forEach((el, index) => {
        data_area03.label.push(el.querySelectorAll("td")[0].textContent.replace(/,/g, "").trim());
        data_area03.data01.push(el.querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
        data_area03.data02.push(el.querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    });
    data04_element.forEach((el, index) => {
        data_area04.label.push(el.querySelectorAll("td")[0].textContent.replace(/,/g, "").trim());
        data_area04.data01.push(el.querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
        data_area04.data02.push(el.querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    });


    gradient_red = year_chart[0].getContext("2d").createLinearGradient(0, 25, 0, 300);
    gradient_red.addColorStop(0, 'rgba(234, 73, 77, 0.5)');
    gradient_red.addColorStop(1, 'rgba(255, 255, 255, 0)');

    gradient_blue = year_chart[0].getContext("2d").createLinearGradient(0, 25, 0, 450);
    gradient_blue.addColorStop(0, 'rgba(57, 146, 208, 0.5)');
    gradient_blue.addColorStop(1, 'rgba(255, 255, 255, 0)');

    function options(tooltipType, unit_value, label, data, borderColor, pointBackgroundColor, stacked) {
        return {
            layout: {
                autoPadding: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip(tooltipType, unit_value),

            },
            scales: scales01(label, data, borderColor, pointBackgroundColor, stacked),
        }
    }

    const year_chart0 = new Chart(year_chart[0].getContext('2d'), {
        type: 'line',
        data: {
            labels: data_area01.label.reverse(),
            datasets: [
                dataset01('사업장수', data_area01.data01.reverse(), '#DD2025', '#DD2025', gradient_red),
                dataset01('사업자수', data_area01.data02.reverse(), '#0e6cae', '#0e6cae', gradient_blue),
            ],
        },
        options: options("01", "", 110, 50, 10, "", false),
        plugins: [beforeDrawFunction],
    });


    const year_chart1 = new Chart(year_chart[1].getContext('2d'), {
        type: 'bar',
        data: {
            labels: data_area02.label.reverse(),
            datasets: [{
                label: 'CHP',
                data: data_area02.data01.reverse(),
                backgroundColor: "#9BC0DB",
                hoverBackgroundColor: "#0E6CAE",
            },
            {
                label: '열전용보일러',
                data: data_area02.data02.reverse(),
                backgroundColor: "#B4D7EF",
                hoverBackgroundColor: "#4EA5E2",
            },
            {
                label: '기타',
                data: data_area02.data03.reverse(),
                backgroundColor: "#C1EDEF",
                hoverBackgroundColor: "#6FDBE1",
            },
            ]
        },
        options: options("01", "M", 15, 5, 5, "M", true),
        plugins: [beforeDrawFunction],
    });

    const year_chart2 = new Chart(year_chart[2].getContext('2d'), {
        type: 'line',
        data: {
            labels: data_area03.label.reverse(),
            datasets: [
                dataset01('생산량(Gcal)', data_area03.data01.reverse(), '#DD2025', '#DD2025', gradient_red),
                dataset01('판매량(Gcal)', data_area03.data02.reverse(), '#0e6cae', '#0e6cae', gradient_blue),
            ],
        },
        options: options("01", "M", 280, 40, 40, "M", false),
        plugins: [beforeDrawFunction],
    });

    const year_chart3 = new Chart(year_chart[3].getContext('2d'), {
        type: 'line',
        data: {
            labels: data_area04.label.reverse(),
            datasets: [
                dataset01('생산량(Gcal)', data_area04.data01.reverse(), '#DD2025', '#DD2025', gradient_red),
                dataset01('판매량(Gcal)', data_area04.data02.reverse(), '#0e6cae', '#0e6cae', gradient_blue),
            ],
        },
        options: options("01", "M", 60, 20, 10, "M", false),
        plugins: [beforeDrawFunction],
    });

}

if (supply_chart[0]) {

    let data01_element = document.querySelectorAll(".supply_table01 tbody tr"),
        data02_element = document.querySelectorAll(".supply_table03 tbody tr"),
        data03_element = document.querySelectorAll(".supply_table04 tbody tr"),
        data04_element = document.querySelectorAll(".supply_table05 tbody tr");

    let data_area = {
        label: [],
        data01: [],
        data02: [],
        data03: [],
        data04: [],
        data05: [],
        data06: [],
    }
    let data_area02 = {
        data01: [],
        data02: [],
        data03: [],
        data04: [],
    }
    data01_element.forEach((el, index) => {
        if (index == 3) return false; // 합계 제외
        data_area.label.push(el.querySelectorAll("td")[0].textContent.replace(/,/g, "").trim());
        data_area.data01.push(el.querySelectorAll("td")[1].textContent.replace(/,/g, "").trim());
        data_area.data02.push(el.querySelectorAll("td")[2].textContent.replace(/,/g, "").trim());
        data_area.data03.push(el.querySelectorAll("td")[3].textContent.replace(/,/g, "").trim());
        data_area.data04.push(el.querySelectorAll("td")[4].textContent.replace(/,/g, "").trim());
        data_area.data05.push(el.querySelectorAll("td")[5].textContent.replace(/,/g, "").trim());
        data_area.data06.push(el.querySelectorAll("td")[6].textContent.replace(/,/g, "").trim());
    });

    data_area02.data01.push(data02_element[data02_element.length - 1].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim());
    data_area02.data01.push(data02_element[data02_element.length - 1].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim());

    data_area02.data02.push(data03_element[data03_element.length - 1].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim());
    data_area02.data02.push(data03_element[data03_element.length - 1].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim());

    data_area02.data03.push(data04_element[data04_element.length - 1].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim());
    data_area02.data03.push(data04_element[data04_element.length - 1].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim());

    data_area02.data04.push(data04_element[data04_element.length - 1].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim());
    data_area02.data04.push(data04_element[data04_element.length - 1].querySelectorAll("td")[5].textContent.replace(/,/g, "").trim());

    function datalabels_font_size(context) {
        const width = context.chart.width
        const size = Math.round(width / 13)
    
        return {
            size: size <= 14 ? 14 : size,
            weight: 600,
        }
    };

    function options(tooltipType) {
        return {
            responsive: false,
            maintainAspectRatio: false,
            layout: function () {
                let layoutPadding = 20;
                if (window.innerWidth <= 1024) {
                    layoutPadding = 10;
                }
                return {
                    padding: layoutPadding
                }
            },
            events: ['mousemove', 'mouseout'],
            onHover: (event, chartElement, myChart) => {
                if (chartElement.length > 0) {
                    let index = chartElement[0].index;
                    myChart.data.datasets[0].backgroundColor = (ctx) => {
                        if (ctx.dataIndex === index) {
                            return ['#3389ef', '#74d1fa', '#c7eeff'];
                        }
                        return ['rgba(51,137,239,.3)', '#D6F2FE', '#EFFAFF'];
                    };
                } else {
                    myChart.data.datasets[0].backgroundColor = ['#3389ef', '#74d1fa', '#c7eeff'];
                }
                myChart.update();
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip(tooltipType),
                datalabels: {
                    formatter: function (value, context) {
                        let t = (value / context.chart.getDatasetMeta(0).total * 100).toFixed(1);
                        if (t % 1 == 0) t = Math.floor(t);
                        return (t <= 10 ? "" : t + "%");
                    },
                    color: '#fff',
                    font: datalabels_font_size,
                }
            },

        }
    };

    function data(data_value, labels) {
        let hoverOffset = 20;
        if (window.innerWidth <= 1024) {
            hoverOffset = 15;
            if (window.innerWidth <= 767) {
                hoverOffset = 10;
                if (window.innerWidth <= 450) {
                    hoverOffset = 5;
                }
            }
        }
        return {
            labels: labels,
            datasets: [{
                data: data_value,
                borderColor: 'transparent',
                fill: true,
                hoverBackgroundColor: ['#3389ef', '#74d1fa', '#c7eeff'],
                backgroundColor: ['#3389ef', '#74d1fa', '#c7eeff'],
                borderWidth: 1,
                borderColor: '#fff',
                hoverOffset: hoverOffset,
            }]
        }
    }

    const myChart01 = new Chart(supply_chart[0], {
        type: 'pie',
        data: data(data_area.data01, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });
    const myChart02 = new Chart(supply_chart[1], {
        type: 'pie',
        data: data(data_area.data02, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });
    const myChart03 = new Chart(supply_chart[2], {
        type: 'pie',
        data: data(data_area.data03, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });
    const myChart04 = new Chart(supply_chart[3], {
        type: 'pie',
        data: data(data_area.data04, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });
    const myChart05 = new Chart(supply_chart[4], {
        type: 'pie',
        data: data(data_area.data05, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });
    const myChart06 = new Chart(supply_chart[5], {
        type: 'pie',
        data: data(data_area.data06, data_area.label),
        options: options("02"),
        plugins: [ChartDataLabels]
    });

    let chartArr = [myChart01, myChart02, myChart03, myChart04, myChart05, myChart06]

    document.querySelectorAll(".canvas-wrap .box canvas").forEach(function (el, index) {
        el.addEventListener("mouseleave", function () {
            chartArr[index].data.datasets[0].backgroundColor = ['#3389ef', '#74d1fa', '#c7eeff'];
            chartArr[index].update();
        });
    });
    document.querySelector(".canvas-wrap").addEventListener("click", function () {
        setTimeout(() => {
            document.querySelectorAll(".canvas-wrap .box canvas").forEach(function (el, index) {
                chartArr[index].data.datasets[0].backgroundColor = ['#3389ef', '#74d1fa', '#c7eeff'];
                chartArr[index].update();
            });
        }, 100);
    });


    // horizontal Chart
    const myChart07 = new Chart(supply_chart[6], {
        type: 'bar',
        data: data(data_area02.data01, ["허가세대수", "공급세대수"]),
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    display: false,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip("02"),
            },
        },
    });
    const myChart08 = new Chart(supply_chart[7], {
        type: 'bar',
        data: data(data_area02.data02, ["허가업체수", "공급업체수"]),
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    display: false,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip("02"),
            },
        },

    });
    const myChart09 = new Chart(supply_chart[8], {
        type: 'bar',
        data: data(data_area02.data03, ["허가세대수", "공급세대수"]),
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    display: false,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip("02"),
            },
        },

    });
    const myChart10 = new Chart(supply_chart[9], {
        type: 'bar',
        data: data(data_area02.data04, ["허가업체수", "공급업체수"]),
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    display: false,
                }
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip("02"),
            },
        },

    });
}

if (capacity_chart[0]) {
    let data01_element = document.querySelectorAll(".capacity01_table tbody tr");

    let data_area01 = {
        data01: [],
        data02: [],
        data03: [],
    }

    data_area01.data01.push(data01_element[0].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data01.push(data01_element[3].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data01.push(data01_element[6].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000);

    data_area01.data02.push(data01_element[1].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data02.push(data01_element[4].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data02.push(data01_element[7].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000);

    data_area01.data03.push(data01_element[0].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data03.push(data01_element[3].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim() / 1000);
    data_area01.data03.push(data01_element[6].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim() / 1000);

    let data_area02 = {
        data01: [],
        data02: [],
        data03: [],
    }

    data_area02.data01.push(data01_element[0].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000);
    data_area02.data01.push(data01_element[3].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000);
    data_area02.data01.push(data01_element[6].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000);

    data_area02.data02.push(data01_element[0].querySelectorAll("td")[5].textContent.replace(/,/g, "").trim() / 1000);
    data_area02.data02.push(data01_element[3].querySelectorAll("td")[5].textContent.replace(/,/g, "").trim() / 1000);
    data_area02.data02.push(data01_element[6].querySelectorAll("td")[5].textContent.replace(/,/g, "").trim() / 1000);

    // chart.js 옵션(tooltip, scales01 포함)
    function options(tooltipType, unit_value, label, data, borderColor, pointBackgroundColor, stacked) {
        return {
            layout: {
                autoPadding: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip(tooltipType, unit_value),

            },
            scales: scales01(label, data, borderColor, pointBackgroundColor, stacked),
        }
    }
    const chart00 = new Chart(capacity_chart[0].getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["지역냉난방", "산업단지", "병행"],
            datasets: [{
                label: '허가-공급중',
                data: data_area01.data01,
                backgroundColor: "#9BC0DB",
                hoverBackgroundColor: "#0E6CAE",
            },
            {
                label: '허가-건설중',
                data: data_area01.data02,
                backgroundColor: "#B4D7EF",
                hoverBackgroundColor: "#4EA5E2",
            },
            {
                label: '설치용량',
                data: data_area01.data03,
                backgroundColor: "#C1EDEF",
                hoverBackgroundColor: "#6FDBE1",
            },
            ]
        },
        options: options("01", "K", 30, 0, 5, "K", false),
        plugins: [beforeDrawFunction],
    });
    const chart01 = new Chart(capacity_chart[1].getContext('2d'), {
        type: 'bar',
        data: {
            labels: ["지역냉난방", "산업단지", "병행"],
            datasets: [{
                label: '허가용량',
                data: data_area02.data01,
                backgroundColor: "#9BC0DB",
                hoverBackgroundColor: "#0E6CAE",
            },
            {
                label: '설치용량',
                data: data_area02.data02,
                backgroundColor: "#B4D7EF",
                hoverBackgroundColor: "#4EA5E2",
            },
            ]
        },
        options: options("01", "K", 10, 0, 2, "K", false),
        plugins: [beforeDrawFunction],
    });
}

if (operating_chart[0]) {
    let data01_element = document.querySelectorAll(".operating_table01 tbody tr");

    let data_area01 = {
        data01: [],
        data02: [],
        data03: [],
        data04: [],
    }


    data_area01.data01.push(data01_element[2].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data01.push(data01_element[2].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data01.push(data01_element[2].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim() / 1000000);

    data_area01.data02.push(data01_element[4].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data02.push(data01_element[4].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data02.push(data01_element[4].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);

    data_area01.data03.push(data01_element[6].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data03.push(data01_element[6].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data03.push(data01_element[6].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);

    data_area01.data04.push(data01_element[8].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data04.push(data01_element[8].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area01.data04.push(data01_element[8].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);


    let data_area02 = {
        data01: [],
        data02: [],
        data03: [],
        data04: [],
    }

    data_area02.data01.push(data01_element[10].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data01.push(data01_element[10].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data01.push(data01_element[10].querySelectorAll("td")[4].textContent.replace(/,/g, "").trim() / 1000000);

    data_area02.data02.push(data01_element[12].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data02.push(data01_element[12].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data02.push(data01_element[12].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);

    data_area02.data03.push(data01_element[14].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data03.push(data01_element[14].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data03.push(data01_element[14].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);

    data_area02.data04.push(data01_element[16].querySelectorAll("td")[1].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data04.push(data01_element[16].querySelectorAll("td")[2].textContent.replace(/,/g, "").trim() / 1000000);
    data_area02.data04.push(data01_element[16].querySelectorAll("td")[3].textContent.replace(/,/g, "").trim() / 1000000);


    function options(tooltipType, unit_value, label, data, borderColor, pointBackgroundColor, stacked) {
        return {
            layout: {
                autoPadding: false,
            },
            plugins: {
                legend: {
                    display: false,
                },
                tooltip: tooltip(tooltipType, unit_value),

            },
            scales: scales01(label, data, borderColor, pointBackgroundColor, stacked),
        }
    }

    const chart00 = new Chart(operating_chart[0].getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['지역냉난방', '산업단지', '병행'],
            datasets: [{
                label: '자체생산량',
                data: data_area01.data01,
                backgroundColor: "#9BC0DB",
                hoverBackgroundColor: "#0E6CAE",
            },
            {
                label: '외부수열량',
                data: data_area01.data02,
                backgroundColor: "#B4D7EF",
                hoverBackgroundColor: "#4EA5E2",
            },
            {
                label: '판매량',
                data: data_area01.data03,
                backgroundColor: "#C1EDEF",
                hoverBackgroundColor: "#6FDBE1",
            },
            {
                label: '자가소비 및 손실',
                data: data_area01.data04,
                backgroundColor: "#d7fcff",
                hoverBackgroundColor: "#a5f1f7",
            },
            ]
        },
        options: options("01", "M", 100, -20, 20, "M", false),
        plugins: [beforeDrawFunction],
    });

    const chart01 = new Chart(operating_chart[1].getContext('2d'), {
        type: 'bar',
        data: {
            labels: ['지역냉난방', '산업단지', '병행'],
            datasets: [{
                label: '자체생산량',
                data: data_area02.data01,
                backgroundColor: "#9BC0DB",
                hoverBackgroundColor: "#0E6CAE",
            },
            {
                label: '외부수열량',
                data: data_area02.data02,
                backgroundColor: "#B4D7EF",
                hoverBackgroundColor: "#4EA5E2",
            },
            {
                label: '판매량',
                data: data_area02.data03,
                backgroundColor: "#C1EDEF",
                hoverBackgroundColor: "#6FDBE1",
            },
            {
                label: '자가소비 및 손실',
                data: data_area02.data04,
                backgroundColor: "#d7fcff",
                hoverBackgroundColor: "#a5f1f7",
            },
            ]
        },
        options: options("01", "M", 40, 0, 10, "M", false),
        plugins: [beforeDrawFunction],
    });
}

