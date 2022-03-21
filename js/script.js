$(document).ready(function () {
  $(".to_top").fadeOut(); // 가장 첫 화면에서 top btn 없음
  $(".page").not(".active").css("top", "100%"); // 가장 첫 화면에서 모든 페이지 아래로 이동

  const elm = $(".page");

  ///////////////////  마우스 휠 이벤트
  $(elm).each(function (index) {
    $(this).on("mousewheel DOMMouseScroll", function (e) {
      // console.log(e.originalEvent.wheelDelta); // -150, 150
      // console.log(event.wheelDelta); // -150, 150

      let delta = 0;

      if (event.wheelDelta) {
        delta = event.wheelDelta / 150; // 휠 내릴 때 delta = -1, 올릴 때 1
        if (window.opera) {
          // 오페라는 값 반대
          delta = -delta;
        }
      } else if (e.detail) {
        // 파이어폭스는 detail값으로 판별, 내릴때 7 올릴때 -7 -> 환경(버전)마다 숫자 다름
        delta = -e.detail / 7; // 휠 내릴 때 delta = -1, 올릴 때 1
      }

      let elmIndex = $(elm).eq(index); // 휠 이벤트가 발생한 페이지 위치

      if (delta < 0) {
        // 휠 내림
        console.log("내림");
        console.log($(elmIndex).next());
        if ($(elmIndex).index() != $(elm).length - 1) {
          // 다음 섹션이 존재할 경우
          $(elm).removeClass("active");
          $(elmIndex).next().addClass("active");

          let $cur_index = $(".page.active").index() - 1; // 이동 후 index
          $(".hd_menu li").removeClass("active");
          $(".hd_menu li").eq($cur_index).addClass("active");

          $(".page.active")
            .stop(false, true)
            .animate({ top: 0 }, 500, function () {
              $(".page.active").prevAll().css("top", "-100%");
            });
        }
      } else {
        // 휠 올림
        console.log("올림");

        if ($(elmIndex).index() != 0) {
          // 휠 올릴 때 이전 섹션이 존재할 경우
          $(elm).removeClass("active");
          $(elmIndex).prev().addClass("active");

          let $cur_index = $(".page.active").index(); // 이동 후 index
          $(".hd_menu li").removeClass("active");
          if ($cur_index == 0) {
          } else {
            $(".hd_menu li")
              .eq($cur_index - 1)
              .addClass("active");
          }

          $(".page.active")
            .stop(false, true)
            .animate({ top: 0 }, 500, function () {
              $(".page.active").nextAll().css("top", "100%");
            });
        }
      } // delta값이 음수(-1)면 휠 내림, 양수(1)면 올림 감지 후 위치 파악 및 class 부여

      ////// 첫페이지에서 헤더메뉴 보이지 않음
      if ($(".page").eq(0).hasClass("active")) {
        $("#header").fadeOut();
        $(".to_top").fadeOut();
      } else {
        $("#header").fadeIn();
        $(".to_top").fadeIn();
      }
    });
  });

  ////////////////////////////////
  // 키보드 이벤트를 통함 full page slider의 이동
  // ↑ : 38, pageUp : 33 / ↓ : 40, pageDown : 34
  // home : 36(맨 위로 이동), end : 35(맨 아래로 이동)

  let key_num = 0;
  $(document).on("keydown", function (evt) {
    key_num = evt.keyCode;

    let $target = $(".page.active").index(); // 현재 보고있는 화면의 index

    if (key_num == 40 || key_num == 34) {
      // try{
      if ($target == $(elm).length - 1) {
        // 이동 안함
      } else {
        $(elm).removeClass("active");
        $(elm)
          .eq($target + 1)
          .addClass("active");
        $(".hd_menu li").removeClass("active");
        $(".hd_menu li").eq($target).addClass("active");
      }

      if ($(".page").eq(0).hasClass("active")) {
        $("#header").fadeOut();
        $(".to_top").fadeOut();
      } else {
        $("#header").fadeIn();
        $(".to_top").fadeIn();
      }

      $(".page.active")
        .stop(false, true)
        .animate({ top: 0 }, 500, function () {
          $(".page.active").prevAll().css("top", "-100%");
        });
      // }catch(evt){

      // }
    } else if (key_num == 38 || key_num == 33) {
      try {
        if ($target == 0) {
          // 이동 안함
        } else {
          $(elm).removeClass("active");
          $(elm)
            .eq($target - 1)
            .addClass("active");
          $(".hd_menu li").removeClass("active");
          if ($target == 1) {
          } else {
            $(".hd_menu li")
              .eq($target - 2)
              .addClass("active");
          }

          $(".page.active")
            .stop(false, true)
            .animate({ top: 0 }, 500, function () {
              $(".page.active").nextAll().css("top", "100%");
            });
        }

        if ($(".page").eq(0).hasClass("active")) {
          $("#header").fadeOut();
          $(".to_top").fadeOut();
        } else {
          $("#header").fadeIn();
          $(".to_top").fadeIn();
        }
      } catch (evt) {}
    }
  });

  /////////////////////////////
  // 모바일 환경에서 터치 기반 (touchstart - touchend)
  // 다음 페이지 : pageY start>end, 이전 페이지 : pageY start<end
  // 살짝만 터치해도 페이지가 갑작스럽게 바뀌는걸 방지하기 위해 y값 최소 n 이상 조건 주기
  let $t_start, $t_end, $t_move;

  function prev(evt) {
    try {
      let $target = $(".page.active").index(); // 터치 직전에 active인 page의 index
      if ($target != 0) {
        // 첫페이지 아닐때만 동작
        $(elm).removeClass("active");
        $(elm)
          .eq($target - 1)
          .addClass("active");
        $(".hd_menu li").removeClass("active");
        if ($target == 1) {
        } else {
          $(".hd_menu li")
            .eq($target - 2)
            .addClass("active");
        }
        if ($(".page").eq(0).hasClass("active")) {
          $("#header").fadeOut();
          $(".to_top").fadeOut();
        } else {
          $("#header").fadeIn();
          $(".to_top").fadeIn();
        }

        $(".page.active")
          .stop(false, true)
          .animate({ top: 0 }, 500, function () {
            $(".page.active").nextAll().css("top", "100%");
          });
      }
    } catch (evt) {}
  }
  function next(evt) {
    try {
      let $target = $(".page.active").index();
      if ($target != $(elm).length - 1) {
        // 마지막 페이지 아닐때만 동작
        $(elm).removeClass("active");
        $(elm)
          .eq($target + 1)
          .addClass("active");
        $(".hd_menu li").removeClass("active");
        $(".hd_menu li").eq($target).addClass("active");
      }
      if ($(".page").eq(0).hasClass("active")) {
        $("#header").fadeOut();
        $(".to_top").fadeOut();
      } else {
        $("#header").fadeIn();
        $(".to_top").fadeIn();
      }

      $(".page.active")
        .stop(false, true)
        .animate({ top: 0 }, 500, function () {
          $(".page.active").prevAll().css("top", "-100%");
        });
    } catch (evt) {}
  }

  function touchmove(evt) {
    $t_move = $t_start - $t_end;

    // 양수 : 하단컨텐츠, 음수 : 상단컨텐츠
    if ($t_move > 100) {
      console.log("올림");
      next(evt);
    } else if ($t_move < -100) {
      console.log("내림");

      prev(evt);
    }
  }

  $(elm).on("touchstart", function (e) {
    console.log("터치 시작");
    $t_start = e.changedTouches[0].pageY;
    // 터치 시 Y값
  });
  $(elm).on("touchend", function (e) {
    console.log("터치 끝");
    $t_end = e.changedTouches[0].pageY;
    // 터치 해제 시 Y값
    touchmove(e); // 터치가 끝나면 Y값이 양수인지 음수인지 계산하여 이전/다음 컨텐츠로 이동
  });

  ///////////////////////////////////////

  // 첫 화면 화살표 클릭 시 2번째 페이지로 넘어감
  $(".arrow_part").click(function () {
    $(".page").removeClass("active");
    $(".page").eq(1).addClass("active");

    $(".to_top").fadeIn();
    $("#header").fadeIn();

    $(".page.active")
      .stop(false, true)
      .animate({ top: 0 }, 500, function () {
        $(".page.active").prevAll().css("top", "-100%");
        $(".page.active").nextAll().css("top", "100%");
      });

    $(".hd_menu li").eq(0).addClass("active");
  });

  // 상단 메뉴 클릭 시 페이지 이동 : class 부여로 페이지 이동
  $("#header .hd_menu li").click(function () {
    let $index = $(this).index() + 1; // 메인페이지 제외
    $("#header .hd_menu li").removeClass("active");
    $(this).addClass("active");

    $(elm).removeClass("active");
    $(elm).eq($index).addClass("active");

    $(".page.active")
      .stop(false, true)
      .animate({ top: 0 }, 500, function () {
        $(".page.active").prevAll().css("top", "-100%");
        $(".page.active").nextAll().css("top", "100%");
      });
    return false;
  });

  // top 버튼 클릭 시 맨 위로 이동
  $(".to_top").click(function () {
    $(elm).removeClass("active");
    $(elm).eq(0).addClass("active");
    $(".to_top").fadeOut();
    $("#header").fadeOut();

    $(".page.active")
      .stop(false, true)
      .animate({ top: 0 }, 500, function () {
        $(".page").not(".active").css("top", "100%");
      });

    $(".send_form").fadeOut();
    $(".thankyou_message").fadeOut();
  });

  ///////////////////// work section tab
  $(".work_tap li").click(function () {
    const btn_index = $(this).index();
    $(".work_tap li").removeClass("active");
    $(this).addClass("active");

    $("ul.work_cont").removeClass("active");
    $("ul.work_cont").eq(btn_index).addClass("active");
  });

  ///////////////////// work section content
  $("#work .work_cont").each(function (index) {
    let cont_num = $(this).find(".cont_child").length; // 각 work 탭에 들어간 컨텐츠의 갯수
    let wrap_width = cont_num * 100;
    console.log(wrap_width);
    $(this).css("width", `${wrap_width}%`);
    $(this)
      .find(".cont_child")
      .css("width", `${100 / cont_num}%`);
  });

  let $w_t_start, $w_t_end;

  $(".cont_child").on("touchstart", function (e) {
    console.log("터치 시작");
    $w_t_start = e.changedTouches[0].pageX;
  });

  $(".cont_child").on("touchend", function (e) {
    console.log("터치 끝");
    $w_t_end = e.changedTouches[0].pageX;
    // touchmove(e);

    const $w_t_move = $w_t_start - $w_t_end;
    const $w_cur_page = $(this).index();

    // 양수 : 다음컨텐츠, 음수 : 이전컨텐츠
    if ($w_t_move > 50) {
      if ($w_cur_page != $(".work_cont.active .cont_child").length - 1) {
        $(".work_cont.active")
          .stop()
          .animate({ "margin-left": `${($w_cur_page + 1) * -100}%` }, 300);
      } else {
        $(".work_cont.active")
          .stop()
          .animate(
            { "margin-left": `${$w_cur_page * -100 - 10}%` },
            100,
            function () {
              $(".work_cont.active").css({
                "margin-left": `${$w_cur_page * -100}%`,
              });
            }
          );
      }

      // 무한 루프 슬라이드
      // $(".work_cont.active").stop().animate({"margin-left" : "-100%"}, 500, function(){
      //   const first_cont = $(".work_cont.active").find(".cont_child").first();
      //   $(".work_cont.active").append(first_cont);
      //   $(".work_cont.active").css({"margin-left" : 0});
      // });
    } else if ($w_t_move < -50) {
      if ($w_cur_page != 0) {
        $(".work_cont.active")
          .stop()
          .animate({ "margin-left": `${($w_cur_page - 1) * -100}%` }, 300);
      } else {
        $(".work_cont.active")
          .stop()
          .animate({ "margin-left": "10%" }, 100, function () {
            $(".work_cont.active").css({ "margin-left": "0" });
          });
      }

      // 무한 루프 슬라이드
      // const last_cont = $(".work_cont.active").find(".cont_child").last();
      // $(".work_cont.active").prepend(last_cont);
      // $(".work_cont.active").css({"margin-left" : "-100%"});
      // $(".work_cont.active").stop().animate({"margin-left" : "0"}, 500);
    }
  });

  ///////////////////// contact section popup
  $(".send_mail").click(function () {
    $(".send_form").fadeIn();
  });

  $(".send_form .close").click(function () {
    $(".send_form").fadeOut();
  });
  $(".thankyou_message .msg_close").click(function () {
    $(".send_form").fadeOut();
    $(".thankyou_message").fadeOut();
  });

  $(".mail_address").click(function () {
    $(".mail_pop").fadeIn();
  });
  $(".github_address").click(function () {
    $(".github_pop").fadeIn();
  });

  $(".pop_content .pop_copy").click(function () {
    $(this).parent().find(".copy_txt").select(); //복사할 텍스트를 선택
    document.execCommand("copy"); //클립보드 복사 실행
    alert("복사되었습니다.");
  });
  $(".pop_content .pop_close").click(function () {
    $(this).parent().parent().fadeOut();
  });
});

//////////// skill section data
const insert_skill = document.querySelector("#skill .skill_wrap");
const skill_arr = [
  ["HTML5", "HTML5 문법의 이해, 적절하게 활용하여 마크업", "icons8-html-5.svg"],
  ["CSS", "디자인 시안을 바탕으로 UI 스타일링에 활용", "icons8-css3.svg"],
  [
    "Javascript",
    "모던 자바스크립트의 이해, 이벤트에 따른 문서조작 가능",
    "icons8-javascript.svg",
  ],
  [
    "jQuery",
    "다양한 플러그인 사용 가능",
    "icons8-jquery-is-a-javascript-library-designed-to-simplify-html-96.png",
  ],
  [
    "React",
    "SPA 웹사이트 제작 경험 보유, styled-components의 사용과 반응형 웹 적용 가능",
    "icons8-react-native.svg",
  ],
  ["Typescript", "Interface를 이용한 type 정의", "icons8-typescript.svg"],
  ["Git", "Git을 활용한 코드 관리, CI/CD 경험 보유", "icons8-git.svg"],
];
let skill_data_wrap = "";

for (i = 0; i < skill_arr.length / 4; i++) {
  // i = 0, 1
  let skill_data = "";
  i = i * 4;

  for (j = i; j < i + 4; j++) {
    skill_data += `
      <li>
        <div class="img_part">
          <img src="./img/skill/${skill_arr[j][2]}" alt="${
      skill_arr[j][0] + "로고"
    }">
        </div>
        <div class="txt_part">
          <h4>${skill_arr[j][0]}</h4>
          <p>${skill_arr[j][1]}</p>
        </div>
      </li>
    `;
    if (j == skill_arr.length - 1) {
      break;
    }
  }

  skill_data_wrap += `
    <ul class="skill_info">
      ${skill_data}
    </ul>
`;
}

insert_skill.innerHTML = skill_data_wrap;

// plugin 사용
$(document).ready(function () {
  ///////////////////// slick plugin
  const slick_arr = [".aboutMe_wrap", ".skill_wrap"];

  for (v of slick_arr) {
    $(v).slick({
      infinite: true, // 무한반복
      dots: true, // navigator
      slidesToShow: 1, // 한번에 몇장의 이미지 보여줄 것인지
      slidesToScroll: 1, // 한번에 이동할 이미지의 개수
      autoplay: false, // 자동회전 여부
    });

    // 페이지 1개일 때 네이게이터 숨기기
    if ($(v).find(".slick-slide").length == 1) {
      $(v).find(".slick-dots").hide();
    }
  }
  ///////////////////// typed plugin
  var typed = new Typed(".typed", {
    strings: [
      "<span>Real success</span> is finding your lifework in the work that <span>you love.</span>",
    ],
    stringsElement: null, // 초기상태에 공간 비움
    typeSpeed: 40, // 타이핑 속도
    loop: false, // 반복 안함
    showCursor: true,
    cursorChar: "|", // 커서 형태를 지정
  });
});
