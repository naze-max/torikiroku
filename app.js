document.addEventListener("DOMContentLoaded", function() {
    // 保存ボタンがクリックされたときにデータを保存
    const birdForm = document.getElementById("birdForm");

    if (birdForm) {
        birdForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const birdName = document.getElementById("birdName").value;
            const province = document.getElementById("province").value;
            const city = document.getElementById("city").value;
            const location = document.getElementById("location").value;
            const date = document.getElementById("date").value;
            const birdPhoto = document.getElementById("birdPhoto").files[0];

            let photoUrl = "";
            if (birdPhoto) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    photoUrl = e.target.result;
                    saveData(birdName, province, city, location, date, photoUrl);
                };
                reader.readAsDataURL(birdPhoto);
            } else {
                saveData(birdName, province, city, location, date, "");
            }
        });
    }

    // データをローカルストレージに保存
    function saveData(name, province, city, location, date, photoUrl) {
        let birds = JSON.parse(localStorage.getItem("birds")) || [];
        birds.push({ name, province, city, location, date, photoUrl });
        localStorage.setItem("birds", JSON.stringify(birds));
        alert("データが保存されました！");
        document.getElementById("birdForm").reset();
    }

    // 保存されたデータを表示
    if (document.getElementById("birdList")) {
        const birdList = document.getElementById("birdList");
        const birds = JSON.parse(localStorage.getItem("birds")) || [];

        if (birds.length > 0) {
            birds.forEach((bird, index) => {
                const birdItem = document.createElement("div");
                birdItem.classList.add("data-item");

                const birdImage = bird.photoUrl ? `<img src="${bird.photoUrl}" alt="Bird Photo" class="thumbnail" />` : "";
                birdItem.innerHTML = `
                    <h3>${bird.name}</h3>
                    <p>都道府県: ${bird.province}</p>
                    <p>市区町村: ${bird.city}</p>
                    <p>ロケーション: ${bird.location}</p>
                    <p>日付: ${bird.date}</p>
                    ${birdImage}
                    <div class="buttons">
                        <button onclick="editBird(${index})">編集</button>
                        <button onclick="deleteBird(${index})">削除</button>
                    </div>
                `;

                birdList.appendChild(birdItem);
            });
        } else {
            birdList.innerHTML = "<p>保存されたデータはありません。</p>";
        }
    }

    // 編集ボタンが押されたときにデータをフォームに反映
    window.editBird = function(index) {
        const birds = JSON.parse(localStorage.getItem("birds"));
        const bird = birds[index];

        document.getElementById("birdName").value = bird.name;
        document.getElementById("province").value = bird.province;
        document.getElementById("city").value = bird.city;
        document.getElementById("location").value = bird.location;
        document.getElementById("date").value = bird.date;

        // 画像のサムネイルを表示
        const photoPreview = document.getElementById("photoPreview");
        if (bird.photoUrl) {
            photoPreview.src = bird.photoUrl;
        }

        // 編集するデータを削除して、新たに保存する
        birdForm.removeEventListener("submit", saveData);
        birdForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const updatedName = document.getElementById("birdName").value;
            const updatedProvince = document.getElementById("province").value;
            const updatedCity = document.getElementById("city").value;
            const updatedLocation = document.getElementById("location").value;
            const updatedDate = document.getElementById("date").value;
            const updatedPhoto = document.getElementById("birdPhoto").files[0];

            let updatedPhotoUrl = "";
            if (updatedPhoto) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    updatedPhotoUrl = e.target.result;
                    updateData(index, updatedName, updatedProvince, updatedCity, updatedLocation, updatedDate, updatedPhotoUrl);
                };
                reader.readAsDataURL(updatedPhoto);
            } else {
                updateData(index, updatedName, updatedProvince, updatedCity, updatedLocation, updatedDate, "");
            }
        });
    };

    // 保存されているデータを更新
    function updateData(index, name, province, city, location, date, photoUrl) {
        const birds = JSON.parse(localStorage.getItem("birds"));
        birds[index] = { name, province, city, location, date, photoUrl };
        localStorage.setItem("birds", JSON.stringify(birds));
        alert("データが更新されました！");
        window.location.href = "view.html";  // 編集後に一覧ページに戻る
    }

    // 削除機能
    window.deleteBird = function(index) {
        let birds = JSON.parse(localStorage.getItem("birds")) || [];
        birds.splice(index, 1);
        localStorage.setItem("birds", JSON.stringify(birds));

        // 削除後にページを更新
        location.reload();
    };
});
