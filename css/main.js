const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY='player'

const playlist=$(".playlist")
const player = $(".player");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const app = {
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},

  currentIndex: 0,
  songs: [
    {
      id: 1,
      name: "Đừng Lo Nhé! Có Anh Đây",
      singer: "Thiên Tú",
      path: "./music/dunglonhe!coanhday.mp3",
      image: "./img/dunglonhe!coanhday.png",
    },
    {
      id: 2,
      name: "Em Là Kẻ Đáng Thương",
      singer: "Phát Huy T4",
      path: "./music/emlakedangthuong.mp3",
      image: "./img/emlakedangthuong.png",
    },
    {
      id: 3,

      name: "Hoa Lạc Lối",
      singer: "Khang Việt",
      path: "./music/hoalacloi.mp3",
      image: "./img/hoalacloi.png",
    },
    {
      id: 4,
      name: "Kìa Bóng Dáng Ai",
      singer: "Pháo, Sterry",
      path: "./music/kiabongai.mp3",
      image: "./img/kiabongdangai.png",
    },
    {
      id: 5,
      name: "Kiếp Má Hồng",
      singer: "Tú Na, Tiểu Nhi",
      path: "./music/kiepmahong.mp3",
      image: "./img/kiepmahong.png",
    },
    {
      id: 6,
      name: "Khuất Lối",
      singer: "H-Kray",
      path: "./music/khuatloi.mp3",
      image: "./img/khuatloi.png",
    },
    {
      id: 1,
      name: "Quả Phụ Tướng",
      singer: "Dunghoangpham",
      path: "./music/quaphutuong.mp3",
      image: "./img/hoaphutuong.png",
    },
    {
      id: 7,
      name: "Rồi Ta Sẽ Ngắm Pháo Hoa",
      singer: "O.lew",
      path: "./music/roitasengamphaohoa.mp3",
      image: "./img/roitasengamphaohoa.png",
    },
    {
      id: 8,
      name: "Sao Cũng Được",
      singer: "Thành Đạt",
      path: "./music/saocungduoc.mp3",
      image: "./img/saocungduoc.png",
    },
    {
      id: 9,
      name: "Trót Trao Duyên",
      singer: "NB3 Hoài Bảo, CT",
      path: "./music/trottraoduyen.mp3",
      image: "./img/trottraoduyen.png",
    },
  ],
  setConfig:function(key,value){
    this.config[key]=value
    localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
  },

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `      
       <div class="song ${index === this.currentIndex ? "active" : ""}" data-index=${index}>
        <div
          class="thumb"
          style="
            background-image: url('${song.image}')"
        ></div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`;
    });

    playlist.innerHTML = htmls.join("");
  },

  handleEvent: function () {
    //xử lý cd quay/dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, //10s
      iteration: Infinity, //quay vo han
    });
    cdThumbAnimate.pause();

    const cdWidth = cd.offsetWidth;
    //xử lý phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;
      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    //xử lý khi click play
    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //khi song được play
    audio.onplay = function () {
      cdThumbAnimate.play();
      app.isPlaying = true;
      player.classList.add("playing");
    };
    //khi song bị pause
    audio.onpause = function () {
      cdThumbAnimate.pause();
      app.isPlaying = false;
      player.classList.remove("playing");
    };
    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };
    //xử lý khi tua song
    progress.oninput = function (e) {
      audio.currentTime = (audio.duration / 100) * e.target.value;
    };
    //xử lý next bài
    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.nextSong();
      }
      audio.play();
      // app.render()
      app.handleActiveSong();
      app.scrollToActiveSong()
    };
    //xủ lý lùi bài
    preBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong();
      } else {
        app.prevSong();
      }
      audio.play();
      app.handleActiveSong()
      app.scrollToActiveSong()

    };
    //xử lý random song
    randomBtn.onclick = function () {
      app.isRandom = !app.isRandom;
      app.setConfig('isRandom',app.isRandom)
      randomBtn.classList.toggle("active", app.isRandom);
    };

    //xử lý khi repeat
    repeatBtn.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig('isRepeat',app.isRepeat)
      repeatBtn.classList.toggle("active", app.isRepeat);
    };
    //xử lý khi hết
    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        nextBtn.onclick();
      }
    };
    //lắng nghe hành vi click
    playlist.onclick=function(e){
      const songNote=e.target.closest('.song:not(.active)')
      if(songNote||e.target.closest('.option')){
        //xử lý khi click vào song
        if(songNote && !e.target.closest('.option')){
          app.currentIndex=Number(songNote.dataset.index)
          app.loadCurrentSong()
          app.handleActiveSong()
          audio.play()
          console.log(songNote)
        }
        //xủ lý click vào option
        if(e.target.closest('.option')){
          console.log(e.target.closest('.option'))
        }
      }
    }
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: () => {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig:function(){
    this.isRandom=this.config.isRandom
    this.isRepeat=this.config.isRepeat

    randomBtn.classList.toggle("active", app.isRandom);
    repeatBtn.classList.toggle("active", app.isRepeat);


  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  ended: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  handleActiveSong: function () {
    const songActive = $(".song.active");
    songActive.classList.remove("active");
    const songs = $$(".song");
    let arr = Array.from(songs);
    const activeSong = arr.find(function (activeValue, index) {
      return index == app.currentIndex;
    });
    activeSong.classList.add("active");
  },
  scrollToActiveSong:function(){
    setTimeout(function(){
      $('.song.active').scrollIntoView({
        behavior: "smooth", block: "end", inline: "nearest"
      })
    },300)
  },

  start: function () {
    //gán cấu hình từ config(local storage) vào ứng dụng
    this.loadConfig()
    //định nghĩa các thuộc tính cho obj
    this.defineProperties();
    //lắng nghe xử lý các sự kiện
    this.handleEvent();
    //tải thông tin bài hát đầu tiên khi UI vào ứng dụng
    this.loadCurrentSong();
    //Render playlist
    this.render();
  },
};

app.start();
