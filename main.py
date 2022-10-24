import cv2
import mediapipe as mp

import paho.mqtt.client as mqtt
import json
import time

FPS = 60

mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_hands = mp.solutions.hands

cap = cv2.VideoCapture(0)
hands = mp_hands.Hands(min_detection_confidence = 0.5, min_tracking_confidence = 0.5, max_num_hands = 1)

client = mqtt.Client()

client.connect('broker.emqx.io', 1883)

while cap.isOpened():
    start = time.time()
    success, image = cap.read()
    if not success:
        print('Ignoring empty camera frame.')
        continue

    image = cv2.cvtColor(cv2.flip(image, -1), cv2.COLOR_BGR2RGB)

    image.flags.writeable = False

    results = hands.process(image)

    points = []

    if results.multi_hand_landmarks != None:
        for handLandmarks in results.multi_hand_landmarks:
            for point in mp_hands.HandLandmark:

                normalizedLandmark = handLandmarks.landmark[point]

                points.append((int(10*normalizedLandmark.x), int(10*normalizedLandmark.y), int(10*normalizedLandmark.z)))

        client.publish('points', json.dumps(points))        

        sleep_time = 1/FPS - (time.time() - start)
        if sleep_time < 0:
            continue
        time.sleep(sleep_time)

cap.release()