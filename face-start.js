(function () {
  const video = document.getElementById('video');
  // ==========加载训练模型==========
  Promise.all([
    faceapi.nets.ageGenderNet.loadFromUri('/weights'),
    faceapi.nets.tinyFaceDetector.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/weights'),
    faceapi.nets.faceLandmark68TinyNet.loadFromUri('/weights'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/weights'),
    faceapi.nets.faceExpressionNet.loadFromUri('/weights'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/weights'),
    // 加载训练好的模型
    // ageGenderNet:          年龄、性别识别模型，大约420KB
    // faceExpressionNet:     人脸表情识别模型，识别表情,开心，沮丧，普通，大约310KB
    // faceLandmark68Net：    68个点人脸地标检测模型（默认模型），大约350KB
    // faceLandmark68TinyNet：68个点人脸地标检测模型（小模型），大约80KB
    // faceRecognitionNet:    人脸识别模型，可以比较任意两个人脸的相似性，大约6.2MB
    // ssdMobilenetv1：       SSD 移动网络 V1，大约5.4MB，准确的最高，推理时间最慢
    // tinyFaceDetector:      微型人脸检测器（实时人脸检测器），与 SSD Mobilenet V1 人脸检测器相比，它速度更快、体积更小且资源消耗更少，但在检测小人脸方面的表现略逊一筹。移动和网络友好
    // mtcnn                  大约2MB
    // tinyYolov2             识别身体轮廓的算法，不知道怎么用
  ]).then((res) => {
    startVideo();
  });

  // ==========加载训练模型==========

  // ==========采集视频==========
  function startVideo() {
    navigator.getUserMedia(
      {
        video: {
          width: { min: 1280 },
          height: { min: 720 },
        },
      },
      (stream) => (video.srcObject = stream),
      (err) => console.error(err)
    );
  }
  // ==========采集视频==========

  video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    // console.log('canvas', canvas);

    document.body.append(canvas);

    const displaySize = { width: video.width || video.style.width, height: video.height || video.style.height };

    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);

    // const run = async () => {
    //   const detections = await faceapi
    //     .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    //     .withFaceLandmarks()
    //     .withFaceExpressions();
    //   const resizedDetections = faceapi.resizeResults(detections, displaySize);
    //   canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    //   faceapi.draw.drawDetections(canvas, resizedDetections);
    //   faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    //   faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    //   window.requestAnimationFrame(run);
    // };
  });
})();
