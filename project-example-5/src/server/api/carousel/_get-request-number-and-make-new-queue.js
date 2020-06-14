module.exports = function getRequestNumberAndMakeNewQueue(queue, groups) {
  const separatedQueue = queue.split(':');
  const reflinksQueue = separatedQueue[1].split('-');

  const queuedManagerId = parseInt(separatedQueue[0], 10);
  const queuedReflinkId = parseInt(reflinksQueue[queuedManagerId], 10);

  let nextManagerId;
  let nextReflinkId;

  if (queuedManagerId < reflinksQueue.length - 1) {
    nextManagerId = queuedManagerId + 1;
  } else {
    nextManagerId = 0;
  }

  if (queuedReflinkId < groups[queuedManagerId].length - 1) {
    nextReflinkId = queuedReflinkId + 1;
  } else {
    nextReflinkId = 0;
  }

  reflinksQueue[queuedManagerId] = nextReflinkId;

  return {
    requestNumber: groups[queuedManagerId][queuedReflinkId],
    newQueue: [nextManagerId, reflinksQueue.join('-')].join(':'),
  };
};
