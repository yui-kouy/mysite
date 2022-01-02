const app = new Vue({
    el: '#app',
    
    data: {
      latitude: '',
      longitude: '',
      maps: '',
      mapStatus: '...',
    },
    
    mounted() {
      // 5秒ごとに位置情報を取得・更新
      setInterval(() => {
        navigator.geolocation.getCurrentPosition((pos) => {
          // 位置情報取得：成功時
          
          let stlon = Math.abs(pos.coords.longitude); // 経度　初回
          let stlat = Math.abs(pos.coords.latitude);  // 緯度　初回
          
          let lon = Math.abs(pos.coords.longitude); // 経度
          let lat = Math.abs(pos.coords.latitude);  // 緯度
          // 東経・西経
          const ew = (pos.coords.longitude >= 0) ? '東経' : '西経';
          // 北緯・南緯
          const ns = (pos.coords.latitude >= 0) ? '北緯' : '南緯';
          // 表示を更新する
          this.longitude = `${ew} ${lon}°`;
          this.latitude = `${ns} ${lat}°`;
          // 地図リンクURLを更新する
          this.maps = `https://google.co.jp/maps?q=${pos.coords.latitude},${pos.coords.longitude}`;
          //リンクの表示を更新する
          this.mapStatus = 'Google Mapsで確認'
        }, (err) => {
          // 位置情報取得：失敗時
          console.error(err);
          // 地図情報のところに失敗メッセージを出す
          this.mapStatus = '利用不可';
          this.maps = '#';
        });
      }, 5000);
      
    },
   
  });