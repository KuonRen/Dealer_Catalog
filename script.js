// 初期設定
let currentCategory = "Super"; // 現在のカテゴリを保持
let sortBy = "name"; // 初期の並び替え基準（名前順）
let sortOrder = "asc"; // 初期の並び替え順（昇順）

// ページ読み込み時の処理
document.addEventListener("DOMContentLoaded", function () {
    fetch("cars.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("JSONデータの読み込みに失敗しました");
            }
            return response.json();
        })
        .then(data => {
            window.carData = data; // JSONデータを保存
            filterCars(currentCategory); // 初期カテゴリでデフォルト表示
        })
        .catch(error => console.error("エラー:", error));
});

// カテゴリで車両をフィルタリング
function filterCars(category) {
    currentCategory = category; // 現在のカテゴリを更新
    const filteredCars = window.carData[category]; // 指定されたカテゴリ内の配列を取得
    sortAndDisplayCars(filteredCars); // 並び替え設定に基づいて表示
}

// 並び替えと表示処理
function sortAndDisplayCars(cars) {
    let sortedCars = [...cars]; // 元の配列を変更しないようにコピー

    // 並び替え基準を適用
    if (sortBy === "name") {
        sortedCars = sortedCars.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "price") {
        sortedCars = sortedCars.sort((a, b) =>
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
    const keyword = searchBox.value.trim();

    if (!window.carData) {
        console.error("車両データが初期化されていません。");
        return;
    }

    if (keyword === "") {
        filterCars(currentCategory);
        return;
    }

    const filteredCars = Object.values(window.carData)
        .flat()
        .filter(car => car.name.toLowerCase().includes(keyword.toLowerCase()));
    displayCars(filteredCars);
}

// 並び替え基準の切り替え
function toggleSortBy() {
    sortBy = sortBy === "name" ? "price" : "name";

    const filteredCars = window.carData[currentCategory];
    sortAndDisplayCars(filteredCars);

    document.getElementById("sortByButton").textContent =
        sortBy === "name" ? "名前順" : "価格順";
}

// 昇順・降順の切り替え
function toggleSortOrder() {
    sortOrder = sortOrder === "asc" ? "desc" : "asc";

    const filteredCars = window.carData[currentCategory];
    sortAndDisplayCars(filteredCars);

    document.getElementById("sortOrderButton").textContent =
        sortOrder === "asc" ? "昇順" : "降順";
}
