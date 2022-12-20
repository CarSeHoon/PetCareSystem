const express = require("express");
const webServer = express();

const path = require('path');
const fs = require('fs');


const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const { BASE_DIR } = require("../../Global");
console.log("BASE_DIR : ", BASE_DIR);

//request 정보를 받을 시, Body의 값을 받아올 수 있도록 해주는 express 설정
webServer.use(express.json());
webServer.use(express.urlencoded({ extended: false }));

/************* DB 연결 테스트 (시작) *************/
const MysqlConnection = require("../module/db/MysqlConnection");

//Express 세션 사용
webServer.use(session({
  secret: 'session-test',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 * 2 }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  },
}))


//비동기처리 : 오래걸리는 작업은 나중으로 미뤄놀고 백그라운드에서 처리 후, 결과를 응답해줌
// 비동기 처리 결과 받는 방범
// 1. Callback 사용
/* function callback함수 () {
  console.log('1초가 지났습니다.');
}
setTimeout(callback함수, 1000);
console.log('콘솔찍기') */
// 2. Promise 객체 활용
const queryResult = MysqlConnection.queryExcute("select * from user");
//queryExcute : DB접속 -> SQL 질의(querying) -> 질의 결과 받고 -> 결과 reuturn 과정 오래걸리는 로직
queryResult
  .then(function (result) {
    console.log("queryResult result : ", result.rows);
  })
  .catch(function (error) {
    console.log(error);
  });
console.log("queryResult :", queryResult);
/************* DB 연결 테스트 (종료) *************/

webServer.listen(8080, function () {
  console.log("8080Port Nodejs Express를 활용한 Web Server 구동");
});


webServer.get('/', function (request, response) {
  console.log('/ request session : ', request.session);
  if (request.session['user_id'] == undefined || request.session['user_id'] == null) {
    response.redirect('/login.html');
  } else {
    response.sendFile(`${BASE_DIR}/client/views/index.html`);
  }
});

webServer.get('/login.html', function (request, response) {
console.log('/login.html request session : ', request.session);
//response.send('text response');
//response.sendFile(BASE_DIR + '/client/views/index.html');
if (request.session['user_id'] == undefined || request.session['user_id'] == null) {
  response.sendFile(`${BASE_DIR}/client/views/login.html`);

} else {
  response.redirect('/');
}

});

webServer.post('/login.json', function (request, response) {
  console.log('/login.html request session : ', request.session);
  
  let queryParam = [
    request.body['user_id'],
    request.body['password']
  ];

  let queryResult = MysqlConnection.queryExcute(`
  SELECT
    COUNT(0) AS count
  FROM
    user
  WHERE
    user_id = ?
  AND
    pw = ?
   `, queryParam);

   queryResult.then(function (result) {
    console.log('/login.json result : ', result);
    if (result.rows[0].count > 0) {
      request.session['user_id'] = request.body['user_id'];
      try{
        request.session.save(function () {
          response.json({isSuccess: true, message: '로그인 성공'})
        })
      } catch(e) {
        response.json({isSuccess: false, message: '로그인 처리 에러'})
      }
    } else {
      response.json({isSuccess: false, message: '아이디와 비밀번호를 확인해주세요.'})
    }
   }).catch(function (error) {
    console.log('error : ', error);
   })
  });

  webServer.post('/logout.json', function (request, response) {
      // request.session['user_id'] = null;
      // try{
      //   request.session.save(function () {
      //     response.json({isSuccess: true, message: '로그인 성공'})
      //   })
      // } catch(e) {
      //   response.json({isSuccess: false, message: '로그인 처리 에러'})
      // }

      //Express session 제거(단, 제거가 완료된 후, 서버에 다시 접근하면 새로운 세션이 생김)
      try {
        request.session.destroy(function(err){
          if (err != undefined || err != null) {
            response.json({isSuccess: false, message: '로그아웃 처리 에러'});
          } else {
            response.json({isSuccess: true, message: '로그아웃 성공'});
          }
        });
      } catch (e) {
        response.json({isSuccess: false, message: '로그아웃 처리 에러'});
      }
    });

webServer.get("/client/build/bundle.js", function (request, response) {
  console.log("/client/build/bundle.js request");
  //response.sendFile(BASE_DIR + '/client/build/bundle.js');
  response.sendFile(`${BASE_DIR}/client/build/bundle.js`);
});


//회원가입 등록 URL
//petRequest 등록 URL
webServer.post("/userRequestInsert.json", function (request, response) {
  console.log("/userRequestInsert.json request body : ", request.body);

  let queryParam = [
    request.body["user_id"],
    request.body["pw"],
    request.body["name"],
    request.body["email"],
    request.body["nick_name"],
    request.body["ph"],
  ];

  const queryResult = MysqlConnection.queryExcute(
    `
    INSERT INTO user (
      user_id,
        pw,
        name,
        email,
        nick_name,
        auth,
        ph,
        join_datetime
    ) VALUES (
      ?
        , ?
        , ?
        , ?
        , ?
        , 'ROLL_USER'
        , ?
        , NOW()
    )
  `,
    queryParam
  );
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});


//petRequest 등록 URL
webServer.post("/careRequestInsert.json", function (request, response) {
  console.log("/careRequestInsert.json request body : ", request.body);

  let queryParam = [
    request.body["careRequestTitle"],
    request.body["careRequestContent"],
    request.body["date"],
    request.body["care_price"],
    request.body["petName"],
    request.body["petAge"],
    request.body["petAnimalType"],
    request.body["petAnimalKind"],
    request.body["petSex"],
    request.body["imgUrl"],
    
    // request.body["date"]
  ];

  //파일 업로드 - Base64 to File (시작)
  //현재 일자 구하기
  let today = new Date();   
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1;  // 월
  let date = today.getDate();  // 날짜
  let hours = today.getHours(); // 시
  let minutes = today.getMinutes();  // 분
  let seconds = today.getSeconds();  // 초
  let milliseconds = today.getMilliseconds(); // 밀리

  //업로드 파일 확장자 구하기
  let fileExtentionEndIndex = request.body["imgUrl"].indexOf(';base64,');
  console.log('fileExtentionEndIndex : ', fileExtentionEndIndex);
  let fileBase64 = request.body["imgUrl"].substring(fileExtentionEndIndex + 8);
  let fileExtention = request.body["imgUrl"].substring(0, fileExtentionEndIndex).replace('data:image/', '');
  console.log('fileExtention : ', fileExtention);
  console.log('fileBase64 : ', fileBase64);
  //업로드 폴더 경로 생성
  let fileUploadDirPath = `client/resources/upload/${year}${month}`;
  //업로드 파일 생성 경로           fileUploadFullPath-> db저장
  let fileUploadFullPath = `${fileUploadDirPath}/${date}_${hours}_${minutes}_${seconds}_${milliseconds}.${fileExtention}`
  //폴더 생성
  fs.mkdir(fileUploadDirPath, function(err){
    if(err && err.code != 'EXIST') {
      console.log("already exist");
    }
    const buffer = Buffer.from(fileBase64, "base64");
    fs.writeFileSync(fileUploadFullPath, buffer);
  })
  //파일 업로드 - Base64 to File (종료)
  

  const queryResult = MysqlConnection.queryExcute(
    `
  INSERT INTO care_request_bbs (
    care_request_number
    , care_request_title
      , care_request_content
      , date
      , care_price
      , pet_name
      , pet_age
      , pet_animal_type
      , pet_animal_kind
      , pet_sex
      , care_request_insert_datetime
      , care_request_insert_user_id
      , matching_status
      , img_url
      
      
  ) VALUES (
    (SELECT IFNULL(MAX(A.care_request_number), 0) + 1 FROM care_request_bbs A)
      , ?
      , ?
      , ?
      , ?
      , ?
      , ?
      , ?
      , ?
      , ?
      , NOW()
      , '${request.session['user_id']}'
      , 0
      , '${fileUploadFullPath}'

  )
  `,
    queryParam
  );
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});



//매칭 url
webServer.post("/matchingRequest.json", function (request, response) {
  console.log("/matchingRequest.json request body : ", request.body);
  console.log("asas", request.session['user_id']);


  let queryParam = [
    request.body["match_request_content"],
    request.body["care_request_number"]
  ];

  const queryResult = MysqlConnection.queryExcute(
    `
    UPDATE
      care_request_bbs
    SET
          matching_datetime = now()
        , matching_status = 1
        , care_provide_user_id = '${request.session['user_id']}'
        , match_request_content = ?
    WHERE
      care_request_number = ?
  `, queryParam);
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});

webServer.post("/matchingRequest2.json", function (request, response) {

  const queryResult = MysqlConnection.queryExcute(
    `
    SELECT
      COUNT(0) AS count
    FROM
      care_request_bbs
      WHERE
      care_provide_user_id = '${request.session['user_id']}'
  `);
  queryResult
    .then(function (result) {
      if(result.rows[0].count > 1) {
        response.json({isSuccess: true})
      } else {
        response.json({isSuccess: false})
      }
    })
    .catch(function (error) {
      response.json(error);
    });
});


webServer.post("/matchingCancel.json", function (request, response) {

  let queryParam = [
    request.body["care_request_number"]
  ];

  const queryResult = MysqlConnection.queryExcute(
    `
    UPDATE
      care_request_bbs
    SET
          matching_datetime = NULL
        , matching_status = 0
        , care_provide_user_id = NULL
    WHERE
      care_request_number = ?
  `, queryParam);
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});





//MyList 게시글 목록 조회
webServer.get("/myRequestSelectList.json", function (request, response) {
  const queryResult = MysqlConnection.queryExcute(`
    SELECT
      care_request_number
      , care_request_title
      , care_request_insert_datetime
      , care_request_insert_user_id
      ,img_url
    FROM
      care_request_bbs
    WHERE
    care_request_insert_user_id = '${request.session['user_id']}'
    AND
    matching_status = 0
    ORDER BY
      care_request_insert_datetime DESC
    
  `);

  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});


//MatchingList 게시글 목록 조회
webServer.get("/MatchingList.json", function (request, response) {
  const queryResult = MysqlConnection.queryExcute(`
    SELECT
      care_request_number
      , care_request_title
      , care_request_insert_datetime
      , care_request_insert_user_id
      ,img_url
    FROM
      care_request_bbs
    WHERE
    care_request_insert_user_id = '${request.session['user_id']}'
    AND
    matching_status = 1
    ORDER BY
      care_request_insert_datetime DESC
    
  `);

  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});

//careList 게시글 목록 조회
webServer.get("/careList.json", function (request, response) {
  const queryResult = MysqlConnection.queryExcute(`
  SELECT
  *
  FROM
    care_request_bbs
  WHERE
  (care_request_insert_user_id = '${request.session['user_id']}'
  OR
  care_provide_user_id = '${request.session['user_id']}')
  AND
  matching_status = 2
  ORDER BY
  care_request_insert_datetime DESC
    
  `);

  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});




//careRequest 게시글 상세조회 기능
webServer.get('/careRequestSelectOne.json', function (request, response) {
  console.log('/careRequestSelectOne.json request.query : ', request.query);

  let queryParam = [request.query['care_request_number']];
  const queryResult = MysqlConnection.queryExcute(`
    SELECT
      *
    FROM
      care_request_bbs
    WHERE
      care_request_number = ?
  `, queryParam);

  queryResult.then(function (result) {
    console.log('/careRequestSelectOne.json queryResult result.rows', result.rows);
    response.json(result.rows);
  }).catch(function (error) {
    console.log('/careRequestSelectOne.json queryResult error : ', error);
    response.json(error);
  });
});




//petRequest 수정 URL
webServer.post("/careRequestUpdate.json", function (request, response) {
  console.log("/careRequestUpdate.json request body : ", request.body);

  let queryParam = [
    request.body["care_request_title"],
    request.body["care_request_content"],
    request.body["date"],
    request.body["care_price"],
    request.body["pet_name"],
    request.body["pet_age"],
    request.body["pet_animal_type"],
    request.body["pet_animal_kind"],
    request.body["pet_sex"],
    request.body ["care_request_number"]
  ];

  const queryResult = MysqlConnection.queryExcute(
    `
    UPDATE
      care_request_bbs
    SET
      care_request_title = ?
        , care_request_content = ?
        , date = ?
        , care_price = ?
        , pet_name = ?
        , pet_age = ?
        , pet_animal_type = ?
        , pet_animal_kind = ?
        , pet_sex = ?
    WHERE
      care_request_number = ?
  `, queryParam);
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});


//careRequest 게시글 삭제 기능
webServer.get('/careRequestDelete.json', function (request, response) {
  console.log('/careRequestDelete.json request.query : ', request.query);

  let queryParam = [request.query['care_request_number']];
  const queryResult = MysqlConnection.queryExcute(`
    DELETE
    FROM
      care_request_bbs
    WHERE
      care_request_number = ?
  `, queryParam);

  queryResult.then(function (result) {
    console.log('/careRequestDelete.json queryResult result.rows', result.rows);
    response.json(result.rows);
  }).catch(function (error) {
    console.log('/careRequestDelete.json queryResult error : ', error);
    response.json(error);
  });
});

webServer.post("/sessionRequest.json", function (request, response) {
  if (request.body.care_request_insert_user_id == request.session['user_id']) {
        response.json({isSuccess: false})
  } else {
    response.json({isSuccess: true})
  }
 });

 webServer.post("/sessionRequest2.json", function (request, response) {
  if (request.body.matching_status == 1 & request.body.care_request_insert_user_id == request.session['user_id']) {
        response.json({isSuccess: true})
  } else {
    response.json({isSuccess: false})
  }
 });

 webServer.post("/sessionRequest3.json", function (request, response) {
  if (request.body.matching_status == 2) {
        response.json({isSuccess: true})
  } else {
    response.json({isSuccess: false})
  }
 });



//careRequest 게시글 목록 조회2
webServer.get("/careRequestSelectCard.json", function (request, response) {
  const queryResult = MysqlConnection.queryExcute(`
    SELECT
      care_request_number
      , care_request_title
      , care_request_insert_datetime
      , care_request_insert_user_id
      ,img_url
    FROM
      care_request_bbs
    WHERE
      matching_status = 0
    ORDER BY
      care_request_insert_datetime DESC
  `);

  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});


//
webServer.get('/userRequestSelectOne.json', function (request, response) {
  console.log('/userRequestSelectOne.json request.query : ', request.query);

  let queryParam = [request.query['care_request_number']];
  const queryResult = MysqlConnection.queryExcute(`
    SELECT
      *
    FROM
      care_request_bbs,user 
    WHERE
      user_id = care_provide_user_id
    AND
      care_request_number = ?
  `, queryParam);

  queryResult.then(function (result) {
    console.log('/userRequestSelectOne.json queryResult result.rows', result.rows);
    response.json(result.rows);
  }).catch(function (error) {
    console.log('/userRequestSelectOne.json queryResult error : ', error);
    response.json(error);
  });
});



webServer.post("/acceptMatching.json", function (request, response) {
  console.log("/acceptMatching.json request body : ", request.body);

  let queryParam = [
    request.body["care_request_number"]
  ];

  const queryResult = MysqlConnection.queryExcute(
    `
    UPDATE
      care_request_bbs
    SET
        matching_status = 2
    WHERE
      care_request_number = ?
  `, queryParam);
  queryResult
    .then(function (result) {
      response.json(result.rows);
    })
    .catch(function (error) {
      response.json(error);
    });
});






/**
 * @author : 최정우
 * @since : 2022.09.20
 * @dscription : ROOT URL, Router's, 화면요청 URL 등.. 이 외 나머지 정적 자원에 대한 처리 기능
 */
 webServer.get('*.*', function (request, response, next) {
  response.sendFile(`${BASE_DIR}${request.params['0']}.${request.params['1']}`);
})