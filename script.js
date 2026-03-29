
const API_KEY = "fp0HWcN1woWlg9Q7KmnD9d2Y";
const SECRET_KEY = "by2zph2g8JYGKFrhYsH7oCqRBZFgfkil";


async function getToken() {
    let res = await fetch(`https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${API_KEY}&client_secret=${SECRET_KEY}`);
    let data = await res.json();
    return data.access_token;
}


function toBase64(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]);
    });
}


async function startRecognition() {
    let file = document.getElementById("imageInput").files[0];
    if (!file) return alert("请选择图片");

    let resultDiv = document.getElementById("result");
    resultDiv.innerText = "识别中...";

    try {
        let token = await getToken();
        let base64 = await toBase64(file);

        let res = await fetch(`https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "image=" + encodeURIComponent(base64)
        });

        let data = await res.json();
        let words = data.words_result.map(item => item.words).join("\n");
        resultDiv.innerText = words;

    } catch (e) {
        resultDiv.innerText = "识别失败：" + e.toString();
    }
}
