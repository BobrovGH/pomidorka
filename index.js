let watchInterval;
let milisecs = 0;
let seconds = 0;
let minutes = 0;
let totalBreakTime = [0,0];
let totalHardWorkTime = [0,0];
let isWatchRunning = false;

let isStartButtonEnabled = true;
let isBreakButtonEnabled = false;

//контроль кнопок
function disableStartButton() {
  isStartButtonEnabled = false;
  isBreakButtonEnabled = true;
  document.getElementById('startButton').disabled = true;
  document.getElementById('breakButton').disabled = false;
}
function disableBreakButton() {
  isStartButtonEnabled = true;
  isBreakButtonEnabled = false;
  document.getElementById('startButton').disabled = false;
  document.getElementById('breakButton').disabled = true;
}
function toggleButtons() {
  if (isStartButtonEnabled) {
    disableStartButton();
  } else {
    disableBreakButton();
  }
}

//запустить секундомер, если он не запущен
function startWatch(progressOf) {
  if (!isWatchRunning) {
    watchInterval = setInterval(() => updateWatch(progressOf), 10); 
    isWatchRunning = true;
  }
}
//очистить секундомер
function clearWatch() {
  clearInterval(watchInterval);
  isWatchRunning = false;
  document.getElementById('watch').textContent = '00:00:00';
  milisecs = 0;
  seconds = 0;
  minutes = 0;
}
//запустить продуктивность
function startHardWork() {
  toggleButtons()
  writeTime();
  clearWatch();
  document.getElementById('watchStatus').textContent = 'Время продуктивности';
  document.getElementById('annotationProgressBar').textContent = 'Желательное время продуктивности: 25 мин.';

  startWatch(25);
}
//запустить перерыв(отдых)
function startBreak() {
  toggleButtons()
  writeTime();
  clearWatch();
  document.getElementById('watchStatus').textContent = 'Время отдыха';
  document.getElementById('annotationProgressBar').textContent = 'Желательное время отдыха: 5 мин.';

  startWatch(5);
}

//обновление секундомера и статус-бара
function updateWatch(progressOf) {
  milisecs++;

  if (milisecs === 100) {
    milisecs = 0;
    seconds++;
  }

  if (seconds === 60) {
    seconds = 0;
    minutes++;
  }
  const formattedTime =
    countTime(minutes) + ':' +
    countTime(seconds) + ':' +
    countTime(milisecs);
  document.getElementById('watch').textContent = formattedTime;
  const totalSeconds = minutes * 60 + seconds;
  const progressBarWidth = (totalSeconds / (progressOf * 60)) * 100;
  document.getElementById('progress').style.width = progressBarWidth + '%';
}
//счёт времени
function countTime(num) {
  return (num < 10) ? '0' + num : num;
}

//обновление массива статистики
function countStat(array) {
  array[0]+=minutes;
  array[1]+=seconds;
  let total = array[0]*60+array[1];
  let mins = Math.floor(total/ 60);
  let secs = total % 60;
  return [mins,secs]
}

//ведение истории и статистики
function writeTime() {
  const currentStatus = document.getElementById('watchStatus').textContent;
  const historyContainer = document.querySelector('.history-container');
  const currentTime = document.getElementById('watch').textContent;
  let newItem;
  switch (currentStatus) {
    case 'Время отдыха':
      newItem = document.createElement('h3');
      newItem.textContent = currentStatus + ': ' + currentTime;
      historyContainer.appendChild(newItem);
      statBreak = countStat(totalBreakTime);
      document.getElementById('stat-break').textContent = 'Всего отдых: ' + statBreak[0] + ' мин. ' + statBreak[1] + ' сек.';
      break;
    case 'Время продуктивности':
      newItem = document.createElement('h3');
      newItem.textContent = currentStatus + ': ' + currentTime;
      historyContainer.appendChild(newItem);
      statHardWork = countStat(totalHardWorkTime);
      document.getElementById('stat-hard-work').textContent = 'Всего продуктивность: ' + statHardWork[0] + ' мин. ' + statHardWork[1] + ' сек.';
      break;
    case 'Для запуска кликни "Продуктивность"':
      const title = document.getElementById('history-container-default');
      title.textContent = 'Помидорка заработала. Хорошей работы!';
      break;
  }
}

document.getElementById('startButton').addEventListener('click', startHardWork);
document.getElementById('breakButton').addEventListener('click', startBreak);

