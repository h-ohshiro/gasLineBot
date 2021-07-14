// アクセストークンとuserIdを設定
// userIDはビジネスアカウントでログインした場合、LINEアカウントと連携すると表示される。
const CHANNEL_ACCESS_TOKEN = "アクセストークン";
const to = "ユーザーID";

function pushMessage() {
  // スプレッドシートの水やりの周期を取得する。
  let date = new Date();
  date.setHours(date.getHours() + 14); //+14で日本時刻に調整
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const month = date.getMonth() + 1;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheets()[0];
  const range = sh.getRange("A5:C16");
  const periodCycle = range.getCell(month, 2).getValue();

  // スプレッドシートの水やりを開始した日を取得する。
  const start = sh.getRange("A1").getValue();
  let startDay = new Date(start);
  startDay.setHours(startDay.getHours() + 14); //+14で日本時刻に調整
  startDay = new Date(startDay.getFullYear(), startDay.getMonth(), startDay.getDate());
  const wateringDay = startDay;

  // 水やりする日を更新する。
  while (date > wateringDay) {
    wateringDay.setDate(wateringDay.getDate() + periodCycle);
  }
  //   現在年月日と水やりの日付を比較し、一致した場合、送信する内容をスプレッドシートより取得しpushする。
  const dateYear = date.getFullYear();
  const dateMonth = date.getMonth() + 1;
  const dateDay = date.getDate();
  const nextWateringYear = wateringDay.getFullYear();
  const nextWateringMonth = wateringDay.getMonth() + 1;
  const nextWateringDay = wateringDay.getDate();

  if (dateYear == nextWateringYear) {
    if (dateMonth == nextWateringMonth) {
      if (dateDay == nextWateringDay) {
        const message = range.getCell(month, 3).getValue();
        return push(message);
      }
    }
  }
}

//メッセージを送信する関数を作成する。
function push(text) {
  const url = "https://api.line.me/v2/bot/message/push";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + CHANNEL_ACCESS_TOKEN,
  };

  const postData = {
    to: to,
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
