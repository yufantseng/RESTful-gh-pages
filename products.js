// import axios from 'axios';
// 建立 Vue
import { createApp } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

createApp({
  // 建立資料
  data() {
    return {
      // 六角學院的 api URL
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      // 個人申請的 api path
      apiPath: 'yufan-55140',
      // 所有商品資料
      products: [],
      // 建立點選查看細節後的暫存資料物件
      tempProduct: {},
    }
  },
  methods: {
    checkAccount() {
      // 宣告 url 函數為 六角 api Url 並使用登入及驗證 api
      const url = `${this.apiUrl}/api/user/check`;
      axios.post(url)
        // 若使用者登入驗證成功則 trigger getData 功能渲染 api 資料進 products 所有商品資料中
        .then(() => {
          this.getData();
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息並跳回 login.html 登入頁面
        .catch((error) => {
          alert(error.response.data.message)
          window.location = 'login.html';
        })
    },
    getData() {
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品 api
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/products`;
      axios.get(url)
        // 若成功讀取遠端 api 商品資料則渲染 response 資料進 products 所有商品資料中
        .then((response) => {
          this.products = response.data.products;
        })
        // 若使用者登入驗證失敗則顯示 error 回傳錯誤訊息
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openProduct(item) {
      // 將所點選的商品資料暫存進 tempProduct 中並顯示為單一產品細節資料
      this.tempProduct = item;
    },
    deleteProduct(item) {
      // 宣告 url 函數為 六角 api Url 結合 個人申請的 api path 並使用管理產品中的刪除商品 api
      const url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
      axios.delete(`${url}/${item.id}`)
        // 若成功刪除所點選的商品資料則重新 trigger getData 功能渲染 api 資料進 products 所有商品資料中並清空 tempProduct 中並顯示為單一產品細節資料
        .then((response) => {
          this.getData();
          this.tempProduct = [];
        })
        // 若失敗刪除所點選的商品資料則顯示 error 回傳錯誤訊息
        .catch((error) => {
          console.log(error.data);
        })
    },
  },
  mounted() {
    // 取出 Token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    axios.defaults.headers.common.Authorization = token;
    // 存入 Token 後每當訪問頁面自動執行使用者驗證
    this.checkAccount()
  }
})
// 將 createApp 掛載於 '＃app' id 上
.mount('#app');