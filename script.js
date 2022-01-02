// 作成したモデルのURL
const imageModelURL = 'https://teachablemachine.withgoogle.com/models/UjBaOu0_u/';

// メインの関数（ここでは定義しているだけでボタンクリックされたら実行）
  let file = document.getElementById('file');
  let canvas = document.getElementById('canvas');
  let canvasWidth = 320;
  let canvasHeight = 240;
  let uploadImgSrc;
  let text =  document.querySelector("#text");

// Canvasの準備
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  let ctx = canvas.getContext('2d');

  let classifier = ml5.imageClassifier(imageModelURL + 'model.json', () => {
      // ロード完了
      console.log('Model Loaded!');
    });

  function loadLocalImage(e) {
    // ファイル情報を取得
    let fileData = e.target.files[0];

    // 画像ファイル以外は処理を止める
    if (!fileData.type.match('image.*')) {
      alert('画像を選択してください');
      return;
    }

    // FileReaderオブジェクトを使ってファイル読み込み
    let reader = new FileReader();
    // ファイル読み込みに成功したときの処理
    reader.onload = function () {
      // Canvas上に表示する
      uploadImgSrc = reader.result;
      canvasDraw();
    }
    // ファイル読み込みを実行
    reader.readAsDataURL(fileData);
  }

  // ファイルが指定された時にloadLocalImage()を実行
  file.addEventListener('change', loadLocalImage, false);

  // Canvas上に画像を表示する
  function canvasDraw() {
    // canvas内の要素をクリアする
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Canvas上に画像を表示
    let img = new Image();
    img.src = uploadImgSrc;
    img.onload = function () {
     if (this.width / this.height > canvasWidth / canvasHeight) {
        // 幅に合わせて画像サイズ設定
        var imgWidth = canvasWidth;
        var imgHeight = Math.floor(this.height * (canvasWidth / this.width));
      } else {
        // 高さに合わせて画像サイズ設定
        imgHeight = canvasHeight;
        imgWidth = Math.floor(this.width * (canvasHeight / this.height));
      }

      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    }
    classifyCanvas();
  }

  function classifyCanvas() {
    classifier.classify(canvas, gotResult);
  }

  //バイク博士が結果をしゃべるための処理（吹き出し内の指定）
  function gotResult(error, results) {
    
    if (error) {
      console.error(error);
    }
    
    console.log(results);
    

    //%数値によって自信の有無を変える
    let msgM = " ";
    let msgNum = parseFloat(results[0].confidence * 100).toFixed(2)
 
    //一番高い割合のメーカーの割合によって言い方を変える
    if (msgNum < 60) {
      msgM = "\n" + "ちょっと自信ないんじゃが・・・" + msgNum + "%くらいかのぉ。あってるかのぉ・・・"
    } else if (msgNum > 80) {
      msgM = "\n" + "これは自信あるんじゃ！" + msgNum + "%じゃ！そうに決まっておる！"
    } else {
      msgM = msgNum + "%くらいじゃ。間違えていたらすまんのぉ～。"
    }
    //自信が一番高い割合のメーカーを表示
    let resultText = "ふむふむ。このバイクのメーカーは「" +
        results[0].label + "」だと思うんじゃよ。" + "\n" + msgM;

    text.textContent = resultText;
  }