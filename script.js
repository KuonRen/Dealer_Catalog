// 初期設定
let currentCategory = "Super"; // 現在のカテゴリを保持
let sortBy = "name"; // 初期の並び替え基準（名前順）
let sortOrder = "asc"; // 初期の並び替え順（昇順）

// ページ読み込み時の処理
document.addEventListener("DOMContentLoaded", function () {
    fetch("cars.json")
        .then(response => response.json())
        .then(data => {
            window.carData = data;
            filterCars(currentCategory); // 初期カテゴリでデフォルト表示
        })
        .catch(error => console.error("JSONデータの読み込みに失敗しました:", error));
});

// カテゴリで車両をフィルタリング
function filterCars(category) {
    currentCategory = category; // 現在のカテゴリを更新
    const filteredCars = window.carData.filter(car => car.category === category);
    sortAndDisplayCars(filteredCars); // 並び替え設定に基づいて表示
}

// 並び替えと表示処理
function sortAndDisplayCars(cars) {
    let sortedCars;

    // 並び替え基準を適用
    if (sortBy === "name") {
        sortedCars = cars.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
        sortedCars = cars.sort((a, b) =>
            parseFloat(a.price.replace(/[^\d]/g, '')) - parseFloat(b.price.replace(/[^\d]/g, ''))
        );
    }

    // 昇順・降順を適用
    if (sortOrder === "desc") {
        sortedCars.reverse();
    }

    displayCars(sortedCars);
}

// 車両一覧を表示
function displayCars(cars) {
    const catalog = document.getElementById("catalog");
    catalog.innerHTML = ""; // カタログ内容をクリア

    cars.forEach(car => {
        const carElement = document.createElement("div");
        carElement.classList.add("car");
        carElement.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <h2>${car.name}</h2>
            <p>価格: ${car.price}</p>
        `;
        catalog.appendChild(carElement);
    });
}

// 検索機能
function executeSearch() {
    const searchBox = document.getElementById("searchBox");
    const keyword = searchBox.value.trim(); // 入力値を取得

    if (!window.carData || window.carData.length === 0) {
        console.error("車両データが初期化されていません。");
        return;
    }

    // 検索ボックスが空の場合はデフォルト表示に戻る
    if (keyword === "") {
        console.warn("検索ボックスが空です。デフォルト表示に戻します。");
        const filteredCars = window.carData.filter(car => car.category === currentCategory);
        sortAndDisplayCars(filteredCars); // デフォルトのカテゴリ表示
        return;
    }

    const filteredCars = window.carData.filter(car =>
        car.name.toLowerCase().includes(keyword.toLowerCase())
    );
    displayCars(filteredCars); // 検索結果を表示
}

// 並び替え基準の切り替え
function toggleSortBy() {
    // 並び替え基準を切り替える
    sortBy = sortBy === "name" ? "price" : "name";

    // 現在のカテゴリでフィルタリングして再表示
    const filteredCars = window.carData.filter(car => car.category === currentCategory);
    sortAndDisplayCars(filteredCars);

    // ボタンのラベルを更新
    document.getElementById("sortByButton").textContent =
        sortBy === "name" ? "名前順" : "価格順";
}

// 昇順・降順の切り替え
function toggleSortOrder() {
    // 並び替え順を切り替える
    sortOrder = sortOrder === "asc" ? "desc" : "asc";

    // 現在のカテゴリでフィルタリングして再表示
    const filteredCars = window.carData.filter(car => car.category === currentCategory);
    sortAndDisplayCars(filteredCars);

    // ボタンのラベルを更新
    document.getElementById("sortOrderButton").textContent =
        sortOrder === "asc" ? "昇順" : "降順";
}
