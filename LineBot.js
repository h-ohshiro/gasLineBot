// アクセストークンとuserIdを設定
// userIDはビジネスアカウントでログインした場合、LINEアカウントと連携すると表示される。
const CHANNEL_ACCESS_TOKEN = "アクセストークン";
const to = "ユーザーID";

function main() {
  // スプレッドシートの入力値を取得
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheets()[0];
  const range = sh.getRange("A5:C16");
  const date = new Date();
  const month = date.getMonth() + 1;

  // 水やりの日だけLINE送信
  if (isWateringDay(sh, range, date)) {
    const message = range.getCell(month, 3).getValue(); //メッセージを取得
    return push(message);
  }
}

/*
  スプレッドシートのデータを取得し、次回の水やり日を演算する
  @return：当日が水やり日→true、それ以外→false
*/
function isWateringDay(sh, range, date) {
  // スプレッドシートの毎月の水やり周期を取得
  let numberOfMonth = [];
  for (let i = 1; i <= 12; i++) {
    numberOfMonth.push(range.getCell(i, 2).getValue());
  }

  // スプレッドシートの水やり起点（開始日）を取得
  const start = sh.getRange("A1").getValue();
  let calDate = new Date(start);

  // 水やりする日を更新
  while (date > calDate) {
    if (date.getDate >= calDate.getDate) {
      calDate.setDate(calDate.getDate() + numberOfMonth[calDate.getMonth()]);
    }
  }
  console.log("現在年月日:" + date);
  console.log("次回の水やり日:" + calDate);

  // ここから検証用、後で消す
  // calDate.setDate(5);
  // console.log("次回の水やり日（検証用）:" + calDate);
  // ここまで検証用

  // 現在年月日と水やりの日付が一致した場合、trueを返す
  if (date.getFullYear() == calDate.getFullYear()) {
    console.log("年が一緒");
    if (date.getMonth() == calDate.getMonth()) {
      console.log("月が一緒");
      if (date.getDate() == calDate.getDate()) {
        console.log("日が一緒");
        return true;
      }
    }
  }
  return false;
}

// プッシュ
function push(text) {
  const url = "https://api.line.me/v2/bot/message/push";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
  };

  const postData = {
    to: TO,
    messages: [
      {
        type: "text",
        text: text,
      },
    ],
  };

  const options = {
    method: "post",
    headers: headers,
    payload: JSON.stringify(postData),
  };
  return UrlFetchApp.fetch(url, options);
}
