# Computer-Aided Melanoma Diagnosis Through Lesion Detection and Shape Feature Analysis

This thesis introduces a more accessible solution for the discovery of malignant lesions through a deep learning pipeline designed for mobile integration.
The core of the system consists of two key models: an object detection model based on YOLOv11 and a U-Net segmentation model with a ResNet-50 encoder. To improve the performance of the
detection model, a hybrid dataset was created by combining the HAM10000 dataset with a set of synthetically generated multi-lesion images that simulate real-world mobile captures.

 These models are integrated into a mobile application where:
- Users can register, log in, update their profiles, manage and create skin examinations.
- Using either the device camera or gallery, they can upload skin images, upon which the system performs automatic lesions detection. 
- Each examination includes visual feedback with bounding boxes, diagnostic scores, and a list with the skin lesions from the image. 
- Additionally, the app supports advanced shape analysis for selected individual lesions, providing segmentation masks and different shape and color scores, such as asymmetry, border irregularity, and color variety, to assist in establishing a diagnosis.

<p align="center">
  <img src="https://github.com/user-attachments/assets/5f9dc909-2318-4d3b-9aee-1e9fa0bbd572" width="200"/>
  <img src="https://github.com/user-attachments/assets/b87b2347-8d62-4070-a92d-11139ac8f703" width="200"/>
  <img src="https://github.com/user-attachments/assets/fef0cbd7-90a5-4b60-8656-aadccf782e44" width="200"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a84677be-5c13-40c7-b51a-3209ef2ac80f" width="200"/>
  <img src="https://github.com/user-attachments/assets/ff07cb0a-7b15-4319-b988-8fc066b56632" width="200"/>
  <img src="https://github.com/user-attachments/assets/e89b7a41-a054-45fc-b441-30ece9c17aae" width="200"/>
</p>
