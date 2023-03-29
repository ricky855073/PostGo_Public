# Post GO!

還記得 Pokemon GO 遊玩的感動嗎?

PostGo一個只屬於學校內部的學生留言版，加入google map定位的功能，讓想打道館(玩留言板)的學生能夠匿名發文討論。

利用定位功能，只有在留言板附近範圍的學生才能進入到留言板發文，也可以利用後端設立隨機留言板，舉辦尋寶遊戲或是梗圖大賽等，促進學生交流。

我們期待之後可以讓台大人都可以放心且暢所欲言的使用我們的服務。

## 1. Table of Contents

- [Quick Start](#1-quick-start)
- [Environment](#2-environment)
- [Development](#3-development)
- [Service](#4-service)
- [Deploy Site](#5-deploy-site)
- [Demo Site](#6-demo-site)
- [Reflection](#7-reflection)
- [Collaborator](#collaborator)

---

## 2. Environment

- Frontend: React (Javascript Based)
- Backend: Flask (Python Based), DNN Model
- Database: PostgreSQL
- Security: SSH Tunnel

## 3. Development

---

### 3.0 Clone This Project

> Make sure you have the access of this repository.

```bash
git clone
```

### 3.1 Prerequisite

- Node.js installed with yarn installed
- Python installed (It's better to create a new virtual environment)

### 3.2 Frontend

> Install dependecies from package.json

```bash
> cd ./frontend
> yarn
```

### 3.3 Backend

> Install dependecies from requirement.txt

```bash
> cd ./backend
> pip install -r requirement.txt
```

### 3.4 Start the Service

> Open 2 terminal sessions to run frontend and backend service.

```bash
> cd ./frontend && yarn start
> cd ./backend && python app.py
```

## 4. Service
1. 創立帳號與JWT使用
    
    此項目包含 JSON Web Token (JWT)憑證，我們添加了Token Expired機制，本次專案設定為10分鐘憑證就會過期，因此超過10分鐘需要重新登入取得新的憑證

2. 修改密碼

    到達Bulletin頁面後，可以修改自己的密碼，當修改完成後，下一次需要使用新密碼登入。

3. 修改頭像與暱稱

    使用者可以在登入後修改自己的頭像與暱稱，當修改過後，使用者可以即時看到修改過後的暱稱與圖案

4. 定位現在位置和計算定位與留言板距離

    我們使用Google Map API做到即時定位，使用者需要在規定的範圍內進入到留言板才可以存取留言板的詳細留言。與第三點結合，使用者可以即時看到在地圖上自己頭像也有一起更改。然而因為天氣等相關因素，會導致GPS定位不是很快。

5. 貼圖審查機制

    使用DNN模型偵測NSFW相關的圖片，過濾不良少年惡意污染純淨校園留言板QQ


## 5. Deploy Site
> 若以下兩個都連不上，請致電0976115018
1. http://meow2.csie.ntu.edu.tw:3000/
2. http://www.postgo.me 

## 6. Demo Site
1. 專案介紹影片 https://youtu.be/-9n-dJnOz4A
2. 完整功能Demo https://youtu.be/_Bx_1EaylKk

## 7. Reflection
* 劉憲銘

    在PostGO專案中，我主要負責後端伺服器、資料庫與資安部分。這是一個很有意思的專案，第一次用Python寫後端就獻給了網服，各種資安的東西也是跟著大腿組員學習成長。我在這次專案中學到最多的大概就是RESTful API還有CORS問題的解決以及如何跟合作者協同開發，這些花費了我和另一個大腿組員許多時間和精力。我覺得最困難的部分是在沒有清楚的需求時，如何自己設計系統架構，以及來回跟組員討論微調架構。然而這是一個很好的學習機會，我們最終也成功地在短時間完成了這個專案。謝謝大腿組員陪我一起瘋狂，讓我們花了很多時間Debug有所突破，實名感謝！

* 郭宇庭

    在這次的專案中，我只要是負責前端
    由於這次的題目很有延伸性，所以其實有很多東西都先定義起來
    導致code真的蠻雜亂的，如果之後要繼續這個side project會是大工程
    我在這次學到最多的其實不是前端，
    讀React package的document其實滿得心應手的，
    但是因為後端視使用flask的關係，
    就算我不是主要負責後端，
    我在溝通上或是調整api都得要跟後端組員溝通
    很怕自己改錯東西，但也因此多學會了一個後端的工具
    這次也學到了JWT的概念，我們的JWT是在最後兩個小時決定一定要實做出來
    結果這個竟然是我們唯一前後端一次過的API
    當下真的很感動，在這次專案中也學會用DBeaver連進sshtunnel
    使用postgresql我一開始還滿抗拒的，但最後用起來其實也不會太難
    感謝組員真的很頂，雖然是遠端合作但其實溝通相當頻繁
    雖然在修這堂課之前就有自己做出一個React Native的App
    但前後端的分工讓我學習到了很多，
    至少我會注意自己程式碼的可讀性，
    不會一直console.log一些奇怪的字串 ><

* 林容丞

    在研究 GoogleAPI 的時候，突然間有一種感慨就是：有許多之前完全不知道在寫什麼的東西突然間都變成看到懂了，（當然還是有很大一部分是看不懂的啦，代表還有很多要努力的空間）才深刻感受到這學期學習到了多少。


---

## Collaborator

- R09323056 劉憲銘: 後端 API 開發，前後端API細微調整，Database 設計維護，VM Server 維護。
- B09901159 郭宇庭: 前端網頁開發，flask NSFW censor model，前後端 API 溝通。
- B09901134 林容程: 前端 Google API 串接
